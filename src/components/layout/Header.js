"use client";

import { Button } from '@/components/ui/button';
import { MountainIcon } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="container fixed mx-auto flex top-0 h-20 w-full items-center justify-between px-4 md:px-6 bg-400 backdrop:blur-3xl">
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
        <Link
          href="/about"
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
        <Link href="/dmca" className="text-muted-foreground hover:text-foreground">
          DMCA
        </Link>
        <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
          Privacy
        </Link>
        <Link href="/tos" className="text-muted-foreground hover:text-foreground">
          TOS
        </Link>
      </nav>
      <Link href="https://github.com/SopKit/suggest/issues/new">
        <Button variant="outline">Suggest</Button>
      </Link>
    </header>
  );
}