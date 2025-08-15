/**
 * Example usage of URL parsing utilities
 * This file demonstrates how to use the URL extraction functions
 */

import { parseHyperlinkedContent, validateUrl, sanitizeHtml } from '../url-parser'

// Example 1: Basic URL validation
console.log('=== URL Validation Examples ===')
console.log('Valid HTTPS URL:', validateUrl('https://example.com')) // true
console.log('Valid HTTP URL:', validateUrl('http://localhost:3000')) // true
console.log('Invalid URL:', validateUrl('not-a-url')) // false
console.log('Malicious URL:', validateUrl('javascript:alert(1)')) // false

// Example 2: HTML sanitization
console.log('\n=== HTML Sanitization Examples ===')
const unsafeHtml = '<p>Safe content</p><script>alert("xss")</script><a href="https://example.com">Good link</a><a href="javascript:alert(1)">Bad link</a>'
const safeHtml = sanitizeHtml(unsafeHtml)
console.log('Original HTML:', unsafeHtml)
console.log('Sanitized HTML:', safeHtml)

// Example 3: Parsing hyperlinked content (like from Google Sheets)
console.log('\n=== Content Parsing Examples ===')
const googleSheetsContent = `
  <table>
    <tr>
      <td><a href="https://docs.google.com/document/d/123">Project Documentation</a></td>
      <td><a href="https://github.com/company/project">GitHub Repository</a></td>
    </tr>
    <tr>
      <td><a href="https://figma.com/design/456">Design Files</a></td>
      <td><a href="mailto:team@company.com">Contact Team</a></td>
    </tr>
  </table>
`

const result = parseHyperlinkedContent(googleSheetsContent)
console.log('Extracted URLs:')
result.extractedUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url.url} (Display: "${url.displayText}")`)
})

// Example 4: Mixed content with plain text URLs
console.log('\n=== Mixed Content Example ===')
const mixedContent = `
  <p>Check out our <a href="https://company.com">website</a> for more info.</p>
  <p>You can also visit https://blog.company.com or contact us at mailto:info@company.com</p>
`

const mixedResult = parseHyperlinkedContent(mixedContent)
console.log('Mixed content URLs:')
mixedResult.extractedUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url.url} (${url.isValid ? 'Valid' : 'Invalid'})`)
})

// Example 5: Error handling
console.log('\n=== Error Handling Examples ===')
try {
  const emptyResult = parseHyperlinkedContent('')
  console.log('Empty content result:', emptyResult.extractedUrls.length, 'URLs found')
  
  const nullResult = parseHyperlinkedContent(null as any)
  console.log('Null content result:', nullResult.extractedUrls.length, 'URLs found')
} catch (error) {
  console.log('Error handled gracefully:', error)
}

export {
  // Re-export functions for easy importing
  parseHyperlinkedContent,
  validateUrl,
  sanitizeHtml
}