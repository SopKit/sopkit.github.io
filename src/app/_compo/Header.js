import { Button } from '@/components/ui/button'
import { MountainIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <>
      <header
        className="container fixed mx-auto flex h-20 w-full #max-w-7xl items-center justify-between px-4 md:px-6  bg-400 backdrop:blur-3xl">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="text-lg font-bold">SopKit</span>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link
            href="https://github.com/orgs/SopKit/repositories"
            className="text-muted-foreground hover:text-foreground"
            prefetch={false}>
            Tools
          </Link>
          {/* <Link
            href="#"
            className="text-muted-foreground hover:text-foreground"
            prefetch={false}>
            Pricing
          </Link> */}
          <Link
            href="https://github.com/sopkit"
            className="text-muted-foreground hover:text-foreground"
            prefetch={false}>
            About
          </Link>
          <Link
            href="https://github.com/sopkit"
            className="text-muted-foreground hover:text-foreground"
            prefetch={false}>
            Contact
          </Link>
        </nav>
        <Link href={"https://github.com/sopkit"}>
        <Button variant="outline">Sign In</Button>
        </Link>
      </header>
    </>
  )
}
