import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <>
      <footer className="border-t bg-gray-50 dark:bg-gray-900/50" role="contentinfo">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SopKit</h3>
              <p className="text-sm text-muted-foreground">
                Professional web development tools and utilities for developers worldwide.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://github.com/sopkit"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Visit our GitHub repository"
                  prefetch={false}>
                  GitHub
                </Link>
                <Link
                  href="https://twitter.com/sopkit"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Follow us on Twitter"
                  prefetch={false}>
                  Twitter
                </Link>
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider">Tools</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/json-formatter" className="text-muted-foreground hover:text-foreground transition-colors">
                    JSON Formatter
                  </Link>
                </li>
                <li>
                  <Link href="/html-to-jsx" className="text-muted-foreground hover:text-foreground transition-colors">
                    HTML to JSX
                  </Link>
                </li>
                <li>
                  <Link href="/markdown-to-html" className="text-muted-foreground hover:text-foreground transition-colors">
                    Markdown to HTML
                  </Link>
                </li>
                <li>
                  <Link href="/encoding" className="text-muted-foreground hover:text-foreground transition-colors">
                    Encoding Tools
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/tos" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap.xml" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="https://github.com/sopkit/sopkit.github.io/issues/new" className="text-muted-foreground hover:text-foreground transition-colors">
                    Report Issue
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/SopKit/suggest/issues/new" className="text-muted-foreground hover:text-foreground transition-colors">
                    Suggest Tool
                  </Link>
                </li>
                <li>
                  <a href="mailto:sh20raj@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 SopKit. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-4 sm:mt-0">
              Made with ❤️ for developers worldwide
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
