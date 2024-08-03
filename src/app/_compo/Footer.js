import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <>
      <footer className="border-t">
        <div
          className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <p className="text-sm text-muted-foreground">&copy; 2024 SopKit. All rights reserved.</p>
          <p>If any tool is not working then <a href="https://github.com/sopkit/sopkit.github.io/issues/new">Report</a></p>
          <div className="flex items-center space-x-4">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}>
              Privacy
            </Link>
            <Link
              href="/tos"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}>
              Terms
            </Link>
            <Link
              href="https://github.com/sopkit"
              className="text-muted-foreground hover:text-foreground"
              prefetch={false}>
              Feedback
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
