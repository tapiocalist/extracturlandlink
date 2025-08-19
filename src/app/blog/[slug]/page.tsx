'use client'

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/blog/posts'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

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
              <span>{new Date(post.date).toLocaleDateString()}</span>
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


    </main>
  )
}