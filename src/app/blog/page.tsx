'use client'

import React from 'react'
import { BlogList } from '@/components/blog/BlogList'
import { getAllPosts } from '@/lib/blog/posts'

export default function BlogPage() {
  const allPosts = getAllPosts()

  return (
    <main className="min-h-screen bg-apple-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white/90 to-apple-background/80 backdrop-blur-sm border-b border-apple-gray border-opacity-20">
        <div className="container-apple py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              Blog
            </h1>
            <p className="text-xl text-content-gray mb-8 leading-relaxed max-w-2xl mx-auto">
              Simple tutorials and tips for URL extraction.
            </p>
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16">
        <div className="container-apple">
          <BlogList posts={allPosts} />
        </div>
      </section>
    </main>
  )
}