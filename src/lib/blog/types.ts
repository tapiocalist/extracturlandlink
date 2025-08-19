export interface BlogPost {
    slug: string
    title: string
    description: string
    content: string
    date: string
    published: boolean
}

export interface BlogPostMeta {
    slug: string
    title: string
    description: string
    date: string
    published: boolean
}

export interface BlogListProps {
    posts: BlogPostMeta[]
}

export interface BlogCardProps {
    post: BlogPostMeta
}

export interface BlogPostProps {
    post: BlogPost
}