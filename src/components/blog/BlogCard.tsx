'use client'

import React from 'react'
import Link from 'next/link'
import { BlogCardProps } from '@/lib/blog/types'

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const cardClass = featured 
    ? "bg-white/70 backdrop-blur-sm rounded-3xl p-8 h-full border border-apple-yellow hover:border-apple-yellow/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    : "bg-white/70 backdrop-blur-sm rounded-3xl p-6 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1"

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className={cardClass}>
          {/* Featured Badge */}
          {featured && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-apple-yellow text-black">
                Featured
              </span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-black mb-3 group-hover:text-gray-700 transition-colors ${
            featured ? 'text-2xl' : 'text-xl'
          }`}>
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-content-gray leading-relaxed mb-4 line-clamp-3">
            {post.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center gap-4">
              <span>{post.author}</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </Link>
    </article>
  )
}