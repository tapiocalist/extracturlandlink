'use client'

import React from 'react'
import Link from 'next/link'
import { BlogCardProps } from '@/lib/blog/types'

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          {/* Title */}
          <h3 className="text-xl font-bold text-black mb-3 group-hover:text-gray-700 transition-colors">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-content-gray leading-relaxed mb-4 line-clamp-3">
            {post.description}
          </p>

          {/* Date */}
          <div className="text-sm text-gray-500 mt-auto">
            {new Date(post.date).toLocaleDateString()}
          </div>
        </div>
      </Link>
    </article>
  )
}