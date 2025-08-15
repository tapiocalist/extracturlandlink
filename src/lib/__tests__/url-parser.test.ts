import { describe, it, expect, beforeEach } from 'vitest'
import { validateUrl, sanitizeHtml, parseHyperlinkedContent } from '../url-parser'

describe('validateUrl', () => {
  it('should validate valid HTTP URLs', () => {
    expect(validateUrl('http://example.com')).toBe(true)
    expect(validateUrl('http://www.example.com')).toBe(true)
    expect(validateUrl('http://example.com/path')).toBe(true)
    expect(validateUrl('http://example.com/path?query=value')).toBe(true)
    expect(validateUrl('http://example.com/path#fragment')).toBe(true)
  })

  it('should validate valid HTTPS URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true)
    expect(validateUrl('https://www.example.com')).toBe(true)
    expect(validateUrl('https://subdomain.example.com')).toBe(true)
    expect(validateUrl('https://example.com:8080')).toBe(true)
  })

  it('should validate localhost URLs', () => {
    expect(validateUrl('http://localhost')).toBe(true)
    expect(validateUrl('http://localhost:3000')).toBe(true)
    expect(validateUrl('https://localhost:8080')).toBe(true)
  })

  it('should validate FTP URLs', () => {
    expect(validateUrl('ftp://ftp.example.com')).toBe(true)
    expect(validateUrl('ftps://secure.example.com')).toBe(true)
  })

  it('should validate mailto URLs', () => {
    expect(validateUrl('mailto:test@example.com')).toBe(true)
    expect(validateUrl('mailto:user@domain.org')).toBe(true)
  })

  it('should reject invalid URLs', () => {
    expect(validateUrl('')).toBe(false)
    expect(validateUrl('   ')).toBe(false)
    expect(validateUrl('not-a-url')).toBe(false)
    expect(validateUrl('http://')).toBe(false)
    expect(validateUrl('https://')).toBe(false)
    expect(validateUrl('http://.')).toBe(false)
    expect(validateUrl('http://..')).toBe(false)
    expect(validateUrl('http://../')).toBe(false)
    expect(validateUrl('http://?')).toBe(false)
    expect(validateUrl('http://#')).toBe(false)
    expect(validateUrl('http:// shouldfail.com')).toBe(false)
  })

  it('should reject URLs with invalid protocols', () => {
    expect(validateUrl('javascript:alert(1)')).toBe(false)
    expect(validateUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    expect(validateUrl('file:///etc/passwd')).toBe(false)
  })

  it('should handle null and undefined inputs', () => {
    expect(validateUrl(null as any)).toBe(false)
    expect(validateUrl(undefined as any)).toBe(false)
    expect(validateUrl(123 as any)).toBe(false)
  })

  it('should handle URLs with special characters', () => {
    expect(validateUrl('https://example.com/path with spaces')).toBe(false)
    expect(validateUrl('https://example.com/path%20with%20encoded%20spaces')).toBe(true)
    expect(validateUrl('https://example.com/path?q=hello world')).toBe(false)
    expect(validateUrl('https://example.com/path?q=hello%20world')).toBe(true)
  })
})

describe('sanitizeHtml', () => {
  it('should preserve safe HTML tags', () => {
    const input = '<p>Hello <strong>world</strong></p>'
    const result = sanitizeHtml(input)
    expect(result).toBe('<p>Hello <strong>world</strong></p>')
  })

  it('should preserve anchor tags with valid URLs', () => {
    const input = '<a href="https://example.com">Link</a>'
    const result = sanitizeHtml(input)
    expect(result).toBe('<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>')
  })

  it('should remove anchor tags with invalid URLs', () => {
    const input = '<a href="javascript:alert(1)">Malicious Link</a>'
    const result = sanitizeHtml(input)
    expect(result).toBe('Malicious Link')
  })

  it('should remove dangerous script tags', () => {
    const input = '<script>alert("xss")</script><p>Safe content</p>'
    const result = sanitizeHtml(input)
    expect(result).toBe('alert("xss")<p>Safe content</p>')
  })

  it('should remove dangerous event handlers', () => {
    const input = '<p onclick="alert(1)">Click me</p>'
    const result = sanitizeHtml(input)
    expect(result).toBe('<p>Click me</p>')
  })

  it('should handle nested HTML structures', () => {
    const input = '<div><p>Text with <a href="https://example.com">link</a> and <em>emphasis</em></p></div>'
    const result = sanitizeHtml(input)
    expect(result).toBe('<div><p>Text with <a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a> and <em>emphasis</em></p></div>')
  })

  it('should handle empty and invalid inputs', () => {
    expect(sanitizeHtml('')).toBe('')
    expect(sanitizeHtml(null as any)).toBe('')
    expect(sanitizeHtml(undefined as any)).toBe('')
  })

  it('should remove style and link tags', () => {
    const input = '<style>body { background: red; }</style><link rel="stylesheet" href="evil.css"><p>Content</p>'
    const result = sanitizeHtml(input)
    expect(result).toBe('body { background: red; }<p>Content</p>')
  })

  it('should preserve line breaks', () => {
    const input = '<p>Line 1<br>Line 2</p>'
    const result = sanitizeHtml(input)
    expect(result).toBe('<p>Line 1<br>Line 2</p>')
  })
})

describe('parseHyperlinkedContent', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
  })

  it('should extract URLs from anchor tags', () => {
    const input = '<p>Check out <a href="https://example.com">this link</a> and <a href="https://google.com">Google</a></p>'
    const result = parseHyperlinkedContent(input)
    
    expect(result.extractedUrls).toHaveLength(2)
    expect(result.extractedUrls[0].url).toBe('https://example.com')
    expect(result.extractedUrls[0].displayText).toBe('this link')
    expect(result.extractedUrls[0].isValid).toBe(true)
    expect(result.extractedUrls[1].url).toBe('https://google.com')
    expect(result.extractedUrls[1].displayText).toBe('Google')
  })

  it('should extract plain text URLs', () => {
    const input = 'Visit https://example.com or http://test.org for more info'
    const result = parseHyperlinkedContent(input)
    
    expect(result.extractedUrls).toHaveLength(2)
    expect(result.extractedUrls[0].url).toBe('https://example.com')
    expect(result.extractedUrls[0].displayText).toBe('https://example.com')
    expect(result.extractedUrls[1].url).toBe('http://test.org')
    expect(result.extractedUrls[1].displayText).toBe('http://test.org')
  })

  it('should handle mixed anchor tags and plain text URLs', () => {
    const input = '<p>Visit <a href="https://example.com">our site</a> or https://backup.com</p>'
    const result = parseHyperlinkedContent(input)
    
    expect(result.extractedUrls).toHaveLength(2)
    expect(result.extractedUrls[0].url).toBe('https://example.com')
    expect(result.extractedUrls[0].displayText).toBe('our site')
    expect(result.extractedUrls[1].url).toBe('https://backup.com')
    expect(result.extractedUrls[1].displayText).toBe('https://backup.com')
  })

  it('should avoid duplicate URLs', () => {
    const input = '<p><a href="https://example.com">Link</a> and also https://example.com</p>'
    const result = parseHyperlinkedContent(input)
    
    expect(result.extractedUrls).toHaveLength(1)
    expect(result.extractedUrls[0].url).toBe('https://example.com')
    expect(result.extractedUrls[0].displayText).toBe('Link')
  })

  it('should filter out invalid URLs', () => {
    const input = '<p><a href="javascript:alert(1)">Bad</a> <a href="https://good.com">Good</a></p>'
    const result = parseHyperlinkedContent(input)
    
    expect(result.extractedUrls).toHaveLength(1)
    expect(result.extractedUrls[0].url).toBe('https://good.com')
    expect(result.extractedUrls[0].displayText).toBe('Good')
  })

  it('should handle empty content', () => {
    const result = parseHyperlinkedContent('')
    expect(result.originalHtml).toBe('')
    expect(result.extractedUrls).toHaveLength(0)
  })

  it('should handle content with no URLs', () => {
    const input = '<p>This is just plain text with no links</p>'
    const result = parseHyperlinkedContent(input)
    
    expect(result.originalHtml).toBe('<p>This is just plain text with no links</p>')
    expect(result.extractedUrls).toHaveLength(0)
  })

  it('should preserve original HTML structure', () => {
    const input = '<div><p>Text with <a href="https://example.com">link</a></p></div>'
    const result = parseHyperlinkedContent(input)
    
    expect(result.originalHtml).toContain('<div>')
    expect(result.originalHtml).toContain('<p>')
    expect(result.originalHtml).toContain('target="_blank"')
    expect(result.originalHtml).toContain('rel="noopener noreferrer"')
  })

  it('should handle malformed HTML gracefully', () => {
    const input = '<p>Unclosed paragraph <a href="https://example.com">link</a>'
    const result = parseHyperlinkedContent(input)
    
    expect(result.extractedUrls).toHaveLength(1)
    expect(result.extractedUrls[0].url).toBe('https://example.com')
  })

  it('should assign unique IDs to extracted URLs', () => {
    const input = '<a href="https://example.com">Link 1</a> <a href="https://google.com">Link 2</a>'
    const result = parseHyperlinkedContent(input)
    
    expect(result.extractedUrls).toHaveLength(2)
    expect(result.extractedUrls[0].id).toBeDefined()
    expect(result.extractedUrls[1].id).toBeDefined()
    expect(result.extractedUrls[0].id).not.toBe(result.extractedUrls[1].id)
  })

  it('should set correct original index for URLs', () => {
    const input = '<a href="https://first.com">First</a> <a href="https://second.com">Second</a>'
    const result = parseHyperlinkedContent(input)
    
    expect(result.extractedUrls[0].originalIndex).toBe(0)
    expect(result.extractedUrls[1].originalIndex).toBe(1)
  })

  it('should handle complex URLs with query parameters and fragments', () => {
    const input = '<a href="https://example.com/path?param=value&other=123#section">Complex URL</a>'
    const result = parseHyperlinkedContent(input)
    
    expect(result.extractedUrls).toHaveLength(1)
    expect(result.extractedUrls[0].url).toBe('https://example.com/path?param=value&other=123#section')
    expect(result.extractedUrls[0].isValid).toBe(true)
  })

  it('should handle URLs with different protocols', () => {
    const input = `
      <a href="https://secure.com">HTTPS</a>
      <a href="http://regular.com">HTTP</a>
      <a href="ftp://files.com">FTP</a>
      <a href="mailto:test@example.com">Email</a>
    `
    const result = parseHyperlinkedContent(input)
    
    expect(result.extractedUrls).toHaveLength(4)
    expect(result.extractedUrls.every(url => url.isValid)).toBe(true)
  })
})
describe
('Edge Cases and Error Handling', () => {
  it('should handle very long URLs', () => {
    const longPath = 'a'.repeat(2000)
    const longUrl = `https://example.com/${longPath}`
    expect(validateUrl(longUrl)).toBe(true)
  })

  it('should handle URLs with international domain names', () => {
    expect(validateUrl('https://例え.テスト')).toBe(true)
    expect(validateUrl('https://xn--r8jz45g.xn--zckzah')).toBe(true) // punycode
  })

  it('should handle content with mixed encodings', () => {
    const input = '<p>Visit <a href="https://example.com/café">café</a></p>'
    const result = parseHyperlinkedContent(input)
    expect(result.extractedUrls).toHaveLength(1)
    expect(result.extractedUrls[0].url).toBe('https://example.com/café')
  })

  it('should handle deeply nested HTML structures', () => {
    const input = `
      <div>
        <section>
          <article>
            <p>Check out <a href="https://example.com">this link</a></p>
            <ul>
              <li><a href="https://google.com">Google</a></li>
              <li><a href="https://github.com">GitHub</a></li>
            </ul>
          </article>
        </section>
      </div>
    `
    const result = parseHyperlinkedContent(input)
    expect(result.extractedUrls).toHaveLength(3)
  })

  it('should handle HTML with comments and CDATA', () => {
    const input = `
      <!-- This is a comment -->
      <p>Visit <a href="https://example.com">example</a></p>
      <![CDATA[Some CDATA content]]>
    `
    const result = parseHyperlinkedContent(input)
    expect(result.extractedUrls).toHaveLength(1)
    expect(result.extractedUrls[0].url).toBe('https://example.com')
  })

  it('should handle URLs with unusual but valid characters', () => {
    const urls = [
      'https://example.com/path?query=value&other=123#fragment',
      'https://user:pass@example.com:8080/path',
      'https://example.com/path/with-dashes_and_underscores',
      'https://example.com/path/with.dots',
      'ftp://files.example.com/path/file.txt'
    ]
    
    urls.forEach(url => {
      expect(validateUrl(url)).toBe(true)
    })
  })

  it('should handle empty anchor tags', () => {
    const input = '<a href="https://example.com"></a>'
    const result = parseHyperlinkedContent(input)
    expect(result.extractedUrls).toHaveLength(1)
    expect(result.extractedUrls[0].displayText).toBe('https://example.com')
  })

  it('should handle anchor tags with only whitespace text', () => {
    const input = '<a href="https://example.com">   </a>'
    const result = parseHyperlinkedContent(input)
    expect(result.extractedUrls).toHaveLength(1)
    expect(result.extractedUrls[0].displayText).toBe('')
  })

  it('should handle malicious HTML injection attempts', () => {
    const maliciousInputs = [
      '<img src="x" onerror="alert(1)">',
      '<script>alert("xss")</script>',
      '<iframe src="javascript:alert(1)"></iframe>',
      '<object data="javascript:alert(1)"></object>',
      '<embed src="javascript:alert(1)">',
      '<link rel="stylesheet" href="javascript:alert(1)">'
    ]
    
    maliciousInputs.forEach(input => {
      const result = sanitizeHtml(input)
      expect(result).not.toContain('javascript:')
      expect(result).not.toContain('onerror')
      expect(result).not.toContain('<script')
      expect(result).not.toContain('<iframe')
      expect(result).not.toContain('<object')
      expect(result).not.toContain('<embed')
      expect(result).not.toContain('<link')
    })
  })
})