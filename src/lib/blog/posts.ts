import { BlogPost, BlogPostMeta } from './types'

// 简单的博客文章数据
const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-extract-urls-from-google-sheets',
    title: 'How to Extract URLs from Google Sheets',
    description: 'A simple guide to extract hyperlinks from Google Sheets using URL Extractor.',
    content: `
# How to Extract URLs from Google Sheets

Google Sheets often contains hyperlinked text that you need to extract as plain URLs. Here's how to do it easily.

## Step 1: Copy Your Content

Select the cells in Google Sheets that contain hyperlinks and copy them (Ctrl+C or Cmd+C).

## Step 2: Paste into URL Extractor

Go to URL Extractor and paste your content into the text area. Make sure to use Ctrl+V to preserve the hyperlink formatting.

## Step 3: Extract URLs

Click the "GET URL" button. The tool will automatically detect all hyperlinks and extract the URLs for you.

## Step 4: Manage Your URLs

You can now:
- Edit the display names
- Copy individual URLs
- Copy all URLs at once
- Delete unwanted links

## Tips

- Always use Ctrl+V when pasting to preserve hyperlinks
- If links appear as plain text, use the "Convert URLs to Links" button
- The tool works completely offline - your data stays private

That's it! You now have all your URLs extracted and organized.
    `,
    date: '2024-01-15',
    published: true
  },
  {
    slug: 'extract-urls-from-word-documents',
    title: 'Extract URLs from Word Documents',
    description: 'Learn how to quickly extract all hyperlinks from Microsoft Word documents.',
    content: `
# Extract URLs from Word Documents

Word documents often contain many hyperlinks. Here's how to extract them all at once.

## Method 1: Copy and Paste

1. Select all text in your Word document (Ctrl+A)
2. Copy the text (Ctrl+C)
3. Paste into URL Extractor (Ctrl+V)
4. Click "GET URL" to extract all links

## Method 2: Section by Section

If your document is large:
1. Copy one section at a time
2. Paste and extract URLs
3. Repeat for each section
4. Combine all results

## What Gets Extracted

URL Extractor will find:
- Regular hyperlinks
- Email addresses (mailto links)
- File links
- Internal document links

## Best Practices

- Use "Paste Special" → "Keep Source Formatting" if regular paste doesn't work
- Check the extracted URLs for accuracy
- Remove any unwanted internal links

This method works for any document with hyperlinks!
    `,
    date: '2024-01-10',
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

// 根据 slug 获取单篇文章
export function getPostBySlug(slug: string): BlogPost | null {
  return blogPosts.find(post => post.slug === slug && post.published) || null
}