'use client';

import React, { useState } from 'react';
import { URLExtractor } from '@/components/URLExtractor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ExtractedURL } from '@/lib/types';

export default function Home() {
  const [extractedUrls, setExtractedUrls] = useState<ExtractedURL[]>([]);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleURLsExtracted = (urls: ExtractedURL[]) => {
    setExtractedUrls(urls);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "Is my data safe?",
      answer: "Yes! All processing happens locally in your browser. Your content never leaves your device or gets sent to our servers. Complete privacy guaranteed."
    },
    {
      question: "What browsers are supported?",
      answer: "URL Extractor works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience."
    },
    {
      question: "How does URL extraction work?",
      answer: "Simply paste hyperlinked content from any source. Our tool automatically detects embedded links and extracts them while preserving the original display text."
    },
    {
      question: "Can I use this on mobile devices?",
      answer: "Absolutely! The tool is fully responsive and works great on tablets and smartphones with touch-friendly controls."
    },
    {
      question: "Is there a limit to URLs I can extract?",
      answer: "There are reasonable limits to ensure good performance, but they're generous enough for most use cases. You can extract hundreds of URLs at once."
    },
    {
      question: "Does it work with Google Sheets?",
      answer: "Yes! Google Sheets is one of our primary supported sources. Just copy cells with hyperlinked text and paste them directly into the tool."
    },
    {
      question: "Can I edit URLs after extraction?",
      answer: "Yes, you can edit display names, delete unwanted URLs, and organize your links exactly how you need them before copying or opening."
    },
    {
      question: "How do I copy all URLs at once?",
      answer: "Use the 'Copy All URLs' button to copy all extracted URLs to your clipboard at once. Perfect for pasting into other applications."
    },
    {
      question: "What file formats are supported?",
      answer: "Any content with hyperlinks works - Google Sheets, Word documents, PDFs, emails, web pages, or any text with embedded links."
    },
    {
      question: "Is this tool completely free?",
      answer: "Yes, URL Extractor is completely free to use with no registration required. All features are available without any limitations."
    }
  ];

  return (
    <main className="min-h-screen bg-apple-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white/90 to-apple-background/80 backdrop-blur-sm border-b border-apple-gray border-opacity-20">
        <div className="container-apple py-12 sm:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              URL Extractor
            </h1>
            <p className="text-xl text-content-gray mb-6 sm:mb-8 leading-relaxed">
              Transform messy hyperlinked content into organized, manageable URL lists in seconds
            </p>
            <p className="text-lg text-content-gray max-w-2xl mx-auto">
              Stop clicking links one by one. Extract all URLs from Google Sheets, documents, emails, or any hyperlinked content. Edit, organize, and export with ease. Perfect for researchers, marketers, and content creators.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="py-12">
        <div className="container-apple">
          <ErrorBoundary>
            <URLExtractor onURLsExtracted={handleURLsExtracted} />
          </ErrorBoundary>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container-apple">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-4">
              How to Use URL Extractor
            </h2>
            <p className="text-xl text-content-gray text-center mb-12 max-w-2xl mx-auto">
              Transform messy hyperlinked content into organized, manageable URL lists in three simple steps
            </p>
            
            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {/* Step 1 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200 hover:border-apple-yellow transition-colors">
                <div className="mb-6">
                  <h3 className="text-4xl font-bold text-black mb-4">1.</h3>
                  <h4 className="text-xl font-bold text-black mb-4">
                    Paste Your Content
                  </h4>
                </div>
                <p className="text-content-gray leading-relaxed">
                  Simply paste hyperlinked content from Google Sheets, Word documents, emails, or any source. The tool preserves all formatting and links automatically.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200 hover:border-apple-yellow transition-colors">
                <div className="mb-6">
                  <h3 className="text-4xl font-bold text-black mb-4">2.</h3>
                  <h4 className="text-xl font-bold text-black mb-4">
                    Extract URLs
                  </h4>
                </div>
                <p className="text-content-gray leading-relaxed">
                  Hit the "GET URL" button and watch as all embedded links are instantly extracted and organized. Each URL keeps its original display text for easy identification.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200 hover:border-apple-yellow transition-colors">
                <div className="mb-6">
                  <h3 className="text-4xl font-bold text-black mb-4">3.</h3>
                  <h4 className="text-xl font-bold text-black mb-4">
                    Manage & Export
                  </h4>
                </div>
                <p className="text-content-gray leading-relaxed">
                  Edit display names, remove unwanted URLs, copy everything to clipboard, or open multiple links at once. Complete control over your URL collection.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
              <div className="relative">
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-apple-yellow/20 hover:border-apple-yellow/40 transition-all duration-300 hover:bg-white/70">
                  <h4 className="text-xl font-bold text-black mb-4 text-center">
                    SMART DETECTION
                  </h4>
                  <p className="text-content-gray text-center leading-relaxed">
                    Automatically recognizes hyperlinks from any source - Google Sheets, Word docs, emails, or web pages. No manual formatting needed.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-apple-yellow/20 hover:border-apple-yellow/40 transition-all duration-300 hover:bg-white/70">
                  <h4 className="text-xl font-bold text-black mb-4 text-center">
                    URL MANAGEMENT
                  </h4>
                  <p className="text-content-gray text-center leading-relaxed">
                    Edit display names, remove duplicates, delete unwanted links, and organize your URLs exactly how you need them.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-apple-yellow/20 hover:border-apple-yellow/40 transition-all duration-300 hover:bg-white/70">
                  <h4 className="text-xl font-bold text-black mb-4 text-center">
                    BULK OPERATIONS
                  </h4>
                  <p className="text-content-gray text-center leading-relaxed">
                    Copy all URLs to clipboard with one click, or open multiple links simultaneously with smart popup blocker handling.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-apple-yellow/20 hover:border-apple-yellow/40 transition-all duration-300 hover:bg-white/70">
                  <h4 className="text-xl font-bold text-black mb-4 text-center">
                    PRIVACY FIRST
                  </h4>
                  <p className="text-content-gray text-center leading-relaxed">
                    100% client-side processing. Your content never leaves your browser or touches our servers. Complete privacy guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-16 bg-apple-background/60 backdrop-blur-sm">
        <div className="container-apple">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Perfect For
              </h2>
              <p className="text-xl text-content-gray max-w-3xl mx-auto leading-relaxed">
                Whether you're a researcher, content creator, or data analyst, URL Extractor streamlines your workflow
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Google Sheets Users
                  </h3>
                  <p className="text-content-gray leading-relaxed">
                    Turn spreadsheet cells with hyperlinked text into clean, organized URL lists for easy management and sharing
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Email Marketers
                  </h3>
                  <p className="text-content-gray leading-relaxed">
                    Extract and organize newsletter links, campaign URLs, and email content for analysis and reporting
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Document Workers
                  </h3>
                  <p className="text-content-gray leading-relaxed">
                    Pull links from Word docs, PDFs, and web pages to create reference lists and resource collections
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Researchers
                  </h3>
                  <p className="text-content-gray leading-relaxed">
                    Organize academic references, research sources, and citation links into manageable, searchable lists
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Content Creators
                  </h3>
                  <p className="text-content-gray leading-relaxed">
                    Manage source links, references, and resources for articles, blog posts, and multimedia content
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Digital Marketers
                  </h3>
                  <p className="text-content-gray leading-relaxed">
                    Process campaign links, social media URLs, and marketing assets for tracking and performance analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container-apple">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex items-center justify-between w-full py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-black pr-4">
                      {faq.question}
                    </h3>
                    <span className={`text-apple-gray text-xl transition-transform ${openFAQ === index ? 'rotate-90' : ''}`}>
                      →
                    </span>
                  </button>
                  {openFAQ === index && (
                    <div className="pb-4 pr-8">
                      <p className="text-content-gray leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}