import { BlogPost, BlogPostMeta } from './types'

// 示例博客文章数据
const blogPosts: BlogPost[] = [
  {
    slug: 'getting-started-with-url-extractor',
    title: 'Getting Started with URL Extractor',
    description: 'Learn how to extract URLs from Google Sheets, documents, and other sources quickly and efficiently.',
    content: `
# Getting Started with URL Extractor

URL Extractor is a powerful tool designed to help you extract and manage URLs from various sources. Whether you're working with Google Sheets, Word documents, or emails, this guide will help you get started.

## What is URL Extractor?

URL Extractor automatically detects and extracts hyperlinks from any content you paste. It's perfect for:

- **Researchers** organizing reference links
- **Marketers** managing campaign URLs
- **Content creators** collecting source materials
- **Data analysts** processing spreadsheet data

## How to Use URL Extractor

### Step 1: Paste Your Content
Simply paste any hyperlinked content into the text area. The tool supports:
- Google Sheets cells with hyperlinks
- Word document text
- Email content
- Web page selections

### Step 2: Extract URLs
Click the "GET URL" button to automatically extract all URLs from your content. The tool will:
- Detect embedded hyperlinks
- Preserve display text
- Validate URL formats
- Organize results clearly

### Step 3: Manage Your URLs
Once extracted, you can:
- Edit display names
- Copy individual URLs
- Copy all URLs at once
- Open multiple URLs
- Delete unwanted links

## Tips for Best Results

1. **Preserve Formatting**: Use Ctrl+V to paste content and maintain hyperlink formatting
2. **Check Results**: Review extracted URLs for accuracy
3. **Organize**: Use the edit feature to create meaningful display names
4. **Batch Operations**: Use "Copy All URLs" for efficiency

## Privacy and Security

URL Extractor processes all content locally in your browser. Your data never leaves your device, ensuring complete privacy and security.

## Conclusion

URL Extractor streamlines the process of managing multiple URLs, saving you time and reducing manual work. Try it today and experience the difference!
    `,
    date: '2024-01-15',
    author: 'URL Extractor Team',
    tags: ['tutorial', 'getting-started', 'guide'],
    readTime: 5,
    featured: true,
    published: true
  },
  {
    slug: 'advanced-url-extraction-tips',
    title: 'Advanced URL Extraction Tips and Tricks',
    description: 'Discover advanced techniques for extracting URLs from complex documents and handling edge cases.',
    content: `
# Advanced URL Extraction Tips and Tricks

Take your URL extraction skills to the next level with these advanced techniques and best practices.

## Working with Complex Documents

### Google Sheets Advanced Features
When working with Google Sheets, you might encounter:
- **Merged cells** with multiple URLs
- **Formula-generated links** 
- **Conditional formatting** affecting display

**Pro Tip**: Copy the entire range and paste it as a single block for best results.

### Microsoft Office Documents
For Word and Excel documents:
- Use "Paste Special" → "Keep Source Formatting"
- Handle embedded objects carefully
- Watch for hidden hyperlinks in images

## Handling Edge Cases

### Mixed Content Types
When your content contains both plain URLs and hyperlinked text:
1. Paste the content normally
2. Use "Convert URLs to Links" for plain text URLs
3. Review and organize the combined results

### International URLs
URL Extractor handles international domains and Unicode characters:
- IDN (Internationalized Domain Names)
- Non-ASCII characters in paths
- Various URL schemes (http, https, ftp, etc.)

### Large Datasets
For processing large amounts of URLs:
- Break content into smaller chunks
- Use batch operations efficiently
- Monitor browser performance

## Productivity Workflows

### Research Workflow
1. Collect sources in a Google Sheet
2. Extract all URLs at once
3. Organize by topic or priority
4. Export for reference management

### Marketing Campaign Management
1. Gather campaign URLs from various sources
2. Extract and validate all links
3. Check for duplicates
4. Organize by campaign type

### Content Curation
1. Extract URLs from multiple articles
2. Edit display names for clarity
3. Group by category
4. Export for content planning

## Browser Optimization

### Popup Blocker Settings
To open multiple URLs efficiently:
- Allow popups for the URL Extractor site
- Use "Open URLs" feature for batch opening
- Consider browser tab limits

### Performance Tips
- Clear browser cache regularly
- Close unnecessary tabs before processing
- Use incognito mode for sensitive content

## Troubleshooting Common Issues

### URLs Not Detected
If URLs aren't being detected:
- Check if content has actual hyperlinks
- Try "Convert URLs to Links" for plain text
- Verify URL format validity

### Formatting Issues
For formatting problems:
- Use Ctrl+V instead of right-click paste
- Check source document formatting
- Try copying smaller sections

### Browser Compatibility
URL Extractor works best with:
- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)

## Security Best Practices

### Safe URL Handling
- Always verify URLs before opening
- Be cautious with shortened URLs
- Check domain reputation
- Use antivirus protection

### Privacy Considerations
- All processing happens locally
- No data is sent to external servers
- Clear browser data after sensitive work
- Use private browsing when needed

## Conclusion

These advanced techniques will help you handle complex URL extraction scenarios efficiently. Remember that practice makes perfect – the more you use these features, the more proficient you'll become.

Happy extracting!
    `,
    date: '2024-01-10',
    author: 'URL Extractor Team',
    tags: ['advanced', 'tips', 'productivity', 'workflow'],
    readTime: 8,
    featured: false,
    published: true
  },
  {
    slug: 'url-extractor-for-researchers',
    title: 'URL Extractor for Academic Researchers',
    description: 'How academic researchers can use URL Extractor to manage citations, references, and research sources efficiently.',
    content: `
# URL Extractor for Academic Researchers

Academic research often involves managing hundreds of online sources. URL Extractor can streamline your research workflow significantly.

## Research Workflow Integration

### Literature Review Process
1. **Source Collection**: Gather URLs from databases, journals, and repositories
2. **Organization**: Extract and categorize by research topic
3. **Citation Management**: Prepare URLs for reference managers
4. **Collaboration**: Share organized link collections with team members

### Database Research
When working with academic databases:
- Extract URLs from search results
- Organize by relevance or date
- Prepare for citation software import
- Maintain backup link collections

## Best Practices for Researchers

### Source Verification
- Always verify URL accessibility
- Check for paywall restrictions
- Note access dates for citations
- Maintain backup copies when possible

### Organization Strategies
- Use descriptive display names
- Group by research theme
- Tag by methodology or field
- Maintain chronological order

### Collaboration Features
- Share extracted URL lists with colleagues
- Coordinate research efforts
- Avoid duplicate source collection
- Maintain team bibliographies

## Integration with Research Tools

### Reference Managers
URL Extractor works well with:
- Zotero
- Mendeley
- EndNote
- RefWorks

### Note-Taking Apps
Export URLs to:
- Notion
- Obsidian
- Roam Research
- OneNote

## Conclusion

URL Extractor can significantly improve your research efficiency by automating the tedious task of URL management and organization.
    `,
    date: '2024-01-05',
    author: 'Dr. Sarah Chen',
    tags: ['research', 'academic', 'workflow', 'productivity'],
    readTime: 6,
    featured: false,
    published: true
  }
]

// 获取所有已发布的文章
export function getAllPosts(): BlogPostMeta[] {
  return blogPosts
    .filter(post => post.published)
    .map(({ content, ...meta }) => meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// 获取特色文章
export function getFeaturedPosts(): BlogPostMeta[] {
  return getAllPosts().filter(post => post.featured)
}

// 根据 slug 获取单篇文章
export function getPostBySlug(slug: string): BlogPost | null {
  return blogPosts.find(post => post.slug === slug && post.published) || null
}

// 获取相关文章
export function getRelatedPosts(currentSlug: string, tags: string[], limit: number = 3): BlogPostMeta[] {
  return getAllPosts()
    .filter(post => 
      post.slug !== currentSlug && 
      post.tags.some(tag => tags.includes(tag))
    )
    .slice(0, limit)
}

// 根据标签获取文章
export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter(post => post.tags.includes(tag))
}

// 获取所有标签
export function getAllTags(): string[] {
  const tags = new Set<string>()
  blogPosts.forEach(post => {
    if (post.published) {
      post.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
}