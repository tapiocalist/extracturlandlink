'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ColorTestPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'simplified'>('current');

  return (
    <div className="min-h-screen bg-apple-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-apple-text mb-4">
              Color Scheme Comparison
            </h1>
            <p className="text-apple-gray text-lg">
              Compare current multi-color design vs. simplified yellow + black/white scheme
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-apple p-1 shadow-sm border border-apple-gray border-opacity-20">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'current'
                    ? 'bg-apple-yellow text-apple-text shadow-sm'
                    : 'text-apple-gray hover:text-apple-text'
                }`}
              >
                Current Design
              </button>
              <button
                onClick={() => setActiveTab('simplified')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'simplified'
                    ? 'bg-apple-yellow text-apple-text shadow-sm'
                    : 'text-apple-gray hover:text-apple-text'
                }`}
              >
                Simplified Design
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Design */}
            {activeTab === 'current' && (
              <>
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-apple-text mb-4">
                    Current Multi-Color Icons
                  </h2>
                  
                  <div className="space-y-4">
                    {/* URL Item with Multiple Colors */}
                    <div className="p-4 bg-apple-background rounded-apple border border-apple-gray border-opacity-20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-apple-text">Sample URL #1</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Valid
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <a href="#" className="text-blue-600 hover:underline text-sm break-all flex-1">
                          https://example.com/sample-url
                        </a>
                        
                        {/* Current Multi-Color Icons */}
                        <button className="text-blue-600 hover:text-blue-800 p-2" title="Copy URL">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 p-2" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-800 p-2" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons with Multiple Colors */}
                    <div className="flex gap-3">
                      <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-600">
                        Copy All URLs
                      </Button>
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600">
                        Open URLs
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-apple-text mb-4">
                    Issues with Current Design
                  </h3>
                  <ul className="space-y-2 text-apple-gray">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Too many colors: blue, green, red, yellow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Inconsistent with Apple-style minimalism</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Visual noise distracts from content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Lacks cohesive design language</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Simplified Design */}
            {activeTab === 'simplified' && (
              <>
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-apple-text mb-4">
                    Simplified Yellow + Black/White
                  </h2>
                  
                  <div className="space-y-4">
                    {/* URL Item with Simplified Colors */}
                    <div className="p-4 bg-apple-background rounded-apple border border-apple-gray border-opacity-20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-apple-text">Sample URL #1</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-apple-yellow text-black font-medium">
                          1
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <a href="#" className="text-apple-text hover:underline text-sm break-all flex-1">
                          https://example.com/sample-url
                        </a>
                        
                        {/* Simplified Icons - Yellow + Black */}
                        <button className="bg-apple-yellow text-black hover:bg-opacity-80 p-2 rounded-lg" title="Copy URL">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="text-black hover:bg-black hover:bg-opacity-10 p-2 rounded-lg" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-black hover:bg-black hover:bg-opacity-10 p-2 rounded-lg" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Second URL Item */}
                    <div className="p-4 bg-apple-background rounded-apple border border-apple-gray border-opacity-20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-apple-text">Sample URL #2</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-apple-yellow text-black font-medium">
                          2
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <a href="#" className="text-apple-text hover:underline text-sm break-all flex-1">
                          https://another-example.com/longer-url-path
                        </a>
                        
                        <button className="bg-apple-yellow text-black hover:bg-opacity-80 p-2 rounded-lg" title="Copy URL">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="text-black hover:bg-black hover:bg-opacity-10 p-2 rounded-lg" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-black hover:bg-black hover:bg-opacity-10 p-2 rounded-lg" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons with Simplified Colors */}
                    <div className="flex gap-3">
                      <Button variant="primary">
                        Copy All URLs
                      </Button>
                      <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                        Open URLs (2)
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-apple-text mb-4">
                    Benefits of Simplified Design
                  </h3>
                  <ul className="space-y-2 text-apple-gray">
                    <li className="flex items-start gap-2">
                      <span className="text-apple-yellow mt-1">•</span>
                      <span>Clean, minimal color palette</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-apple-yellow mt-1">•</span>
                      <span>Consistent with Apple design principles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-apple-yellow mt-1">•</span>
                      <span>Yellow numbers for clear identification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-apple-yellow mt-1">•</span>
                      <span>Better focus on content over decoration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-apple-yellow mt-1">•</span>
                      <span>Cohesive visual language throughout</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Color Palette Reference */}
          <div className="mt-12 card p-6">
            <h3 className="text-lg font-semibold text-apple-text mb-4">
              Simplified Color Palette
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-apple-yellow rounded-apple mx-auto mb-2 border border-apple-gray border-opacity-20"></div>
                <p className="text-sm font-medium text-apple-text">Primary Yellow</p>
                <p className="text-xs text-apple-gray">#FFD60A</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-apple mx-auto mb-2"></div>
                <p className="text-sm font-medium text-apple-text">Black</p>
                <p className="text-xs text-apple-gray">#000000</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-apple mx-auto mb-2 border border-apple-gray border-opacity-20"></div>
                <p className="text-sm font-medium text-apple-text">White</p>
                <p className="text-xs text-apple-gray">#FFFFFF</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-apple-gray rounded-apple mx-auto mb-2"></div>
                <p className="text-sm font-medium text-apple-text">Gray (accents)</p>
                <p className="text-xs text-apple-gray">#8E8E93</p>
              </div>
            </div>
          </div>

          {/* Implementation Notes */}
          <div className="mt-8 card p-6 bg-yellow-50 border border-yellow-200">
            <h3 className="text-lg font-semibold text-apple-text mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-apple-yellow rounded-full flex items-center justify-center text-black text-sm font-bold">!</span>
              Implementation Notes
            </h3>
            
            <div className="space-y-3 text-apple-gray">
              <p><strong>Numbers/Indicators:</strong> Yellow background with black text for clear visibility</p>
              <p><strong>Primary Actions:</strong> Yellow buttons (existing GET URL button style)</p>
              <p><strong>Secondary Actions:</strong> Black text on white background with hover states</p>
              <p><strong>Icons:</strong> Either yellow background + black icon, or black icon on white background</p>
              <p><strong>Status Indicators:</strong> Replace green "Valid" badges with yellow numbered badges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}