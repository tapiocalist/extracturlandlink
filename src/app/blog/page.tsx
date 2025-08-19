'use client'

import React, { useState } from 'react'
import { BlogList } from '@/components/blog/BlogList'
import { getAllPosts, getFeaturedPosts, getAllTags } from '@/lib/blog/posts'
import { BlogPostMeta } from '@/lib/blog/types'

export default function BlogPage() {
  const allPosts = getAllPosts()
  const featuredPosts = getFeaturedPosts()
  const allTags = getAllTags()
  
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [filteredPosts, setFilteredPosts] = useState<BlogPostMeta[]>(allPosts)

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag)
    if (tag) {
      setFilteredPosts(allPosts.filter(post => post.tags.includes(tag)))
    } else {
      setFilteredPosts(allPosts)
    }
  }

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
              Tips, tutorials, and insights about URL extraction, productivity, and web tools.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container-apple">
            <h2 className="text-4xl font-bold text-black mb-12 text-center">
              Featured Posts
            </h2>
            <BlogList posts={featuredPosts} featured={true} />
          </div>
        </section>
      )}

      {/* Tag Filter */}
      <section className="py-8 bg-apple-background/60 backdrop-blur-sm">
        <div className="container-apple">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleTagFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTag === null
                  ? 'bg-apple-yellow text-black'
                  : 'bg-white/70 text-gray-700 hover:bg-apple-yellow/20'
              }`}
            >
              All Posts ({allPosts.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                  selectedTag === tag
                    ? 'bg-apple-yellow text-black'
                    : 'bg-white/70 text-gray-700 hover:bg-apple-yellow/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16">
        <div className="container-apple">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-black">
              {selectedTag ? `Posts tagged "${selectedTag}"` : 'All Posts'}
            </h2>
            <p className="text-content-gray">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <BlogList posts={filteredPosts} />
        </div>
      </section>
    </main>
  )
}