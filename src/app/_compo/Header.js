'use client'


import { Button } from '@/components/ui/button'
import { MountainIcon, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-colors hover:text-primary" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="text-lg font-bold">SopKit</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="https://github.com/orgs/SopKit/repositories"
            className="text-muted-foreground hover:text-foreground transition-colors"
            prefetch={false}
          >
            Tools
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground transition-colors"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="https://github.com/sopkit"
            className="text-muted-foreground hover:text-foreground transition-colors"
            prefetch={false}
          >
            Contact
          </Link>
          <Link href="/dmca" className="text-muted-foreground hover:text-foreground transition-colors">
            DMCA
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/tos" className="text-muted-foreground hover:text-foreground transition-colors">
            TOS
          </Link>
          <Link href="https://github.com/SopKit/suggest/issues/new">
            <Button variant="outline" className="ml-4">Suggest</Button>
          </Link>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <nav className="container py-4 flex flex-col space-y-4">
              <Link
                href="https://github.com/orgs/SopKit/repositories"
                className="text-muted-foreground hover:text-foreground transition-colors"
                prefetch={false}
              >
                Tools
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
                prefetch={false}
              >
                About
              </Link>
              <Link
                href="https://github.com/sopkit"
                className="text-muted-foreground hover:text-foreground transition-colors"
                prefetch={false}
              >
                Contact
              </Link>
              <Link href="/dmca" className="text-muted-foreground hover:text-foreground transition-colors">
                DMCA
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/tos" className="text-muted-foreground hover:text-foreground transition-colors">
                TOS
              </Link>
              <Link href="https://github.com/SopKit/suggest/issues/new">
                <Button variant="outline" className="w-full">Suggest</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
