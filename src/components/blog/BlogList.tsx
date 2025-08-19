'use client'

import React from 'react'
import { BlogCard } from './BlogCard'
import { BlogListProps } from '@/lib/blog/types'

export function BlogList({ posts, featured = false }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-content-gray">No blog posts found.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard 
          key={post.slug} 
          post={post} 
          featured={featured && post.featured}
        />
      ))}
    </div>
  )
}