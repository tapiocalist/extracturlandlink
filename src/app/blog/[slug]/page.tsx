'use client'

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getRelatedPosts } from '@/lib/blog/posts'
import { BlogCard } from '@/components/blog/BlogCard'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post.slug, post.tags)

  // Simple markdown-like rendering (you could use a proper markdown parser)
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-4xl font-bold text-black mb-6 mt-8">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-3xl font-bold text-black mb-4 mt-6">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-2xl font-bold text-black mb-3 mt-4">{line.slice(4)}</h3>
        }
        
        // Bold text
        if (line.startsWith('- **') && line.includes('**')) {
          const parts = line.split('**')
          return (
            <li key={index} className="mb-2">
              <strong className="font-semibold text-black">{parts[1]}</strong>
              {parts[2] && <span className="text-content-gray">{parts[2]}</span>}
            </li>
          )
        }
        
        // List items
        if (line.startsWith('- ')) {
          return <li key={index} className="mb-2 text-content-gray">{line.slice(2)}</li>
        }
        
        // Numbered lists
        if (/^\d+\./.test(line)) {
          return <li key={index} className="mb-2 text-content-gray">{line.replace(/^\d+\.\s*/, '')}</li>
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />
        }
        
        // Regular paragraphs
        return <p key={index} className="mb-4 text-content-gray leading-relaxed">{line}</p>
      })
  }

  return (
    <main className="min-h-screen bg-apple-background">
      {/* Article Header */}
      <section className="bg-gradient-to-b from-white/90 to-apple-background/80 backdrop-blur-sm border-b border-apple-gray border-opacity-20">
        <div className="container-apple py-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link 
                href="/blog" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                ← Back to Blog
              </Link>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-apple-yellow text-black"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-content-gray mb-8 leading-relaxed">
              {post.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-content-gray">
              <span>By {post.author}</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container-apple">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg max-w-none">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-100">
                {renderContent(post.content)}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container-apple">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-black mb-12 text-center">
                Related Posts
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}