import { describe, it, expect } from 'vitest'
import { parseHyperlinkedContent, validateUrl, sanitizeHtml } from '../url-parser'

describe('URL Parser Integration Tests', () => {
  it('should handle a realistic Google Sheets copied content', () => {
    const googleSheetsContent = `
      <table>
        <tr>
          <td><a href="https://docs.google.com/document/d/123">Project Doc</a></td>
          <td><a href="https://github.com/user/repo">GitHub Repo</a></td>
        </tr>
        <tr>
          <td><a href="https://figma.com/design/456">Design File</a></td>
          <td><a href="mailto:team@company.com">Contact Team</a></td>
        </tr>
      </table>
    `
    
    const result = parseHyperlinkedContent(googleSheetsContent)
    
    expect(result.extractedUrls).toHaveLength(4)
    expect(result.extractedUrls[0].url).toBe('https://docs.google.com/document/d/123')
    expect(result.extractedUrls[0].displayText).toBe('Project Doc')
    expect(result.extractedUrls[1].url).toBe('https://github.com/user/repo')
    expect(result.extractedUrls[2].url).toBe('https://figma.com/design/456')
    expect(result.extractedUrls[3].url).toBe('mailto:team@company.com')
    
    // Verify all URLs are marked as valid
    expect(result.extractedUrls.every(url => url.isValid)).toBe(true)
  })

  it('should handle Excel-like content with mixed valid and invalid URLs', () => {
    const excelContent = `
      <p>Resources:</p>
      <ul>
        <li><a href="https://valid-site.com">Valid Site</a></li>
        <li><a href="javascript:alert('xss')">Malicious Link</a></li>
        <li><a href="http://another-valid.org/path?param=value">Another Valid</a></li>
        <li><a href="not-a-url">Invalid URL</a></li>
      </ul>
      <p>Also check out https://plain-text-url.com for more info</p>
    `
    
    const result = parseHyperlinkedContent(excelContent)
    
    // Should only extract valid URLs
    expect(result.extractedUrls).toHaveLength(3)
    expect(result.extractedUrls[0].url).toBe('https://valid-site.com')
    expect(result.extractedUrls[1].url).toBe('http://another-valid.org/path?param=value')
    expect(result.extractedUrls[2].url).toBe('https://plain-text-url.com')
    
    // Verify sanitized HTML doesn't contain malicious content
    expect(result.originalHtml).not.toContain('javascript:')
    expect(result.originalHtml).toContain('Malicious Link') // Text should remain
  })

  it('should handle document content with various formatting', () => {
    const documentContent = `
      <div>
        <h2>Important Links</h2>
        <p>Please review the following resources:</p>
        <ol>
          <li><strong><a href="https://company.com/policy">Company Policy</a></strong></li>
          <li><em><a href="https://training.company.com">Training Materials</a></em></li>
          <li>Contact us at <a href="mailto:support@company.com">support@company.com</a></li>
        </ol>
        <p>Additional resources: https://help.company.com and https://status.company.com</p>
      </div>
    `
    
    const result = parseHyperlinkedContent(documentContent)
    
    expect(result.extractedUrls).toHaveLength(5)
    
    // Verify URLs are extracted correctly
    const urls = result.extractedUrls.map(u => u.url)
    expect(urls).toContain('https://company.com/policy')
    expect(urls).toContain('https://training.company.com')
    expect(urls).toContain('mailto:support@company.com')
    expect(urls).toContain('https://help.company.com')
    expect(urls).toContain('https://status.company.com')
    
    // Verify display text is preserved for anchor tags
    expect(result.extractedUrls[0].displayText).toBe('Company Policy')
    expect(result.extractedUrls[1].displayText).toBe('Training Materials')
    expect(result.extractedUrls[2].displayText).toBe('support@company.com')
    
    // Plain text URLs should use URL as display text
    expect(result.extractedUrls[3].displayText).toBe('https://help.company.com')
    expect(result.extractedUrls[4].displayText).toBe('https://status.company.com')
  })

  it('should handle edge case with duplicate URLs in different formats', () => {
    const content = `
      <p>Visit <a href="https://example.com/">Our Site</a></p>
      <p>Or go to https://different.com/ directly</p>
      <p>Also try <a href="https://example.com">without trailing slash</a></p>
    `
    
    const result = parseHyperlinkedContent(content)
    
    // Should extract all unique URLs
    expect(result.extractedUrls).toHaveLength(3)
    
    // Check that all expected URLs are present (order may vary)
    const urls = result.extractedUrls.map(u => u.url)
    expect(urls).toContain('https://example.com/')
    expect(urls).toContain('https://different.com/')
    expect(urls).toContain('https://example.com')
  })

  it('should maintain performance with large content', () => {
    // Generate large content with many URLs
    const urls = Array.from({ length: 100 }, (_, i) => 
      `<a href="https://example${i}.com">Link ${i}</a>`
    ).join(' ')
    
    const largeContent = `<div>${urls}</div>`
    
    const startTime = performance.now()
    const result = parseHyperlinkedContent(largeContent)
    const endTime = performance.now()
    
    expect(result.extractedUrls).toHaveLength(100)
    expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
    
    // Verify all URLs are valid and have correct indices
    result.extractedUrls.forEach((url, index) => {
      expect(url.url).toBe(`https://example${index}.com`)
      expect(url.displayText).toBe(`Link ${index}`)
      expect(url.originalIndex).toBe(index)
      expect(url.isValid).toBe(true)
    })
  })
})