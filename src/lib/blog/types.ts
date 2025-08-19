export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  date: string
  author: string
  tags: string[]
  readTime: number
  featured: boolean
  published: boolean
}

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  readTime: number
  featured: boolean
  published: boolean
}

export interface BlogListProps {
  posts: BlogPostMeta[]
  featured?: boolean
}

export interface BlogCardProps {
  post: BlogPostMeta
  featured?: boolean
}

export interface BlogPostProps {
  post: BlogPost
}