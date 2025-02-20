"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <p className="text-sm text-muted-foreground">
              SopKit is a collection of free and open-source development tools to enhance your workflow.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="https://github.com/sopkit" className="text-sm text-muted-foreground hover:text-foreground">
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/tos" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-sm text-muted-foreground hover:text-foreground">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://github.com/SopKit/suggest/issues/new" className="text-sm text-muted-foreground hover:text-foreground">
                  Suggest a Tool
                </Link>
              </li>
              <li>
                <Link href="https://github.com/sopkit" className="text-sm text-muted-foreground hover:text-foreground">
                  Contribute
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SopKit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}