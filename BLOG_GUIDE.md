# 如何添加博客文章

## 📝 添加新文章的步骤

### 1. 打开文章数据文件
编辑文件：`src/lib/blog/posts.ts`

### 2. 在 blogPosts 数组中添加新文章
在数组中添加一个新的对象：

```typescript
{
  slug: 'your-article-url-slug',           // URL 中显示的名称（英文，用连字符）
  title: '你的文章标题',                    // 文章标题
  description: '文章的简短描述',            // 在列表页显示的描述
  content: `
# 你的文章标题

这里写你的文章内容...

## 子标题

更多内容...

### 小标题

- 列表项 1
- 列表项 2

1. 编号列表 1
2. 编号列表 2

**粗体文字**

普通段落文字。
  `,
  date: '2024-01-20',                      // 发布日期 (YYYY-MM-DD)
  published: true                          // 是否发布（true 显示，false 隐藏）
}
```

### 3. 保存文件
保存 `posts.ts` 文件后，新文章就会自动出现在博客页面。

## 📋 文章格式说明

### Slug（URL 标识）
- 只能包含英文字母、数字和连字符
- 例如：`how-to-use-url-extractor`
- 这将成为文章的 URL：`/blog/how-to-use-url-extractor`

### 内容格式
文章内容支持简单的 Markdown 格式：

- `# 标题` - 大标题
- `## 子标题` - 中标题  
- `### 小标题` - 小标题
- `**粗体**` - 粗体文字
- `- 项目` - 无序列表
- `1. 项目` - 有序列表

### 日期格式
使用 `YYYY-MM-DD` 格式，例如：`2024-01-20`

## 🔄 发布流程

1. 编辑 `src/lib/blog/posts.ts`
2. 添加新文章对象
3. 保存文件
4. 提交到 Git：
   ```bash
   git add .
   git commit -m "Add new blog post: 文章标题"
   git push
   ```
5. Vercel 会自动部署更新

## 📝 示例文章

```typescript
{
  slug: 'extract-urls-from-emails',
  title: '如何从邮件中提取 URL',
  description: '学习如何快速从电子邮件中提取所有链接。',
  content: `
# 如何从邮件中提取 URL

电子邮件经常包含很多有用的链接。以下是提取它们的方法。

## 步骤 1：复制邮件内容

选择并复制邮件中的文本内容。

## 步骤 2：粘贴到 URL Extractor

打开 URL Extractor，将内容粘贴到文本框中。

## 步骤 3：提取链接

点击"GET URL"按钮，所有链接将被自动提取。

## 小贴士

- 使用 Ctrl+V 粘贴以保持链接格式
- 检查提取结果的准确性
- 删除不需要的链接

就这么简单！
  `,
  date: '2024-01-20',
  published: true
}
```

## 🎯 注意事项

- 每次添加文章后都要保存文件
- Slug 必须是唯一的，不能重复
- 内容中的换行会被保留
- 可以随时设置 `published: false` 来隐藏文章
- 文章按日期倒序排列（最新的在前面）

这样你就可以独立添加和管理博客文章了！