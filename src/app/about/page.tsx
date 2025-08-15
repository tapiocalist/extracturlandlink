'use client';

export default function About() {
  return (
    <main className="min-h-screen bg-apple-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-apple-background border-b border-apple-gray border-opacity-20">
        <div className="container-apple py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              About URL Extractor
            </h1>
            <p className="text-xl text-content-gray mb-8 leading-relaxed max-w-2xl mx-auto">
              A simple, efficient tool designed to streamline your workflow when dealing with multiple hyperlinked URLs.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container-apple">
          <div className="max-w-4xl mx-auto">
            {/* Project Introduction */}
            <div className="card p-8 mb-12">
              <h2 className="text-3xl font-bold text-black mb-6 tracking-tight">
                What is URL Extractor?
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-content-gray leading-relaxed">
                  URL Extractor is a web-based tool that helps you efficiently extract and manage URLs from hyperlinked text content. 
                  Whether you're working with Google Sheets, documents, emails, or any content with embedded links, this tool 
                  streamlines the process of collecting and organizing multiple URLs.
                </p>
                <p className="text-lg text-content-gray leading-relaxed">
                  Built with modern web technologies and following modern design principles, URL Extractor provides a clean, 
                  intuitive interface that makes URL management simple and efficient.
                </p>
              </div>
            </div>

            {/* Why We Built This */}
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12">
              <div className="card p-6">
                <h3 className="text-2xl font-bold text-black mb-4">
                  The Problem
                </h3>
                <p className="text-lg text-content-gray leading-relaxed">
                  Working with multiple URLs from spreadsheets, documents, or emails often means clicking each link individually 
                  or manually copying URLs one by one. This process is time-consuming and inefficient.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="text-2xl font-bold text-black mb-4">
                  Our Solution
                </h3>
                <p className="text-lg text-content-gray leading-relaxed">
                  URL Extractor automatically detects and extracts all URLs from your content, allowing you to manage, 
                  edit, and open multiple links efficiently. All processing happens locally for privacy and speed.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="card p-6 sm:p-8 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-8 text-center">
                Key Features
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group">
                  <div className="bg-white rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <h4 className="text-xl font-bold text-black mb-4">
                      Smart Detection
                    </h4>
                    <p className="text-content-gray leading-relaxed">
                      Automatically detects hyperlinks in various formats and sources
                    </p>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-white rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <h4 className="text-xl font-bold text-black mb-4">
                      URL Management
                    </h4>
                    <p className="text-content-gray leading-relaxed">
                      Edit, delete, and organize extracted URLs to fit your needs
                    </p>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-white rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <h4 className="text-xl font-bold text-black mb-4">
                      Bulk Operations
                    </h4>
                    <p className="text-content-gray leading-relaxed">
                      Copy all URLs or open multiple links with a single click
                    </p>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-white rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <h4 className="text-xl font-bold text-black mb-4">
                      Privacy First
                    </h4>
                    <p className="text-content-gray leading-relaxed">
                      All processing happens locally - your data never leaves your device
                    </p>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-white rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <h4 className="text-xl font-bold text-black mb-4">
                      Responsive Design
                    </h4>
                    <p className="text-content-gray leading-relaxed">
                      Works seamlessly on desktop, tablet, and mobile devices
                    </p>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-white rounded-3xl p-8 h-full border border-gray-100 hover:border-apple-yellow transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <h4 className="text-xl font-bold text-black mb-4">
                      Fast & Reliable
                    </h4>
                    <p className="text-content-gray leading-relaxed">
                      Built with modern web technologies for optimal performance
                    </p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>
    </main>
  );
}