import Link from "next/link"
import { Music } from "lucide-react"

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Music className="h-6 w-6" />
          <span>Arts Fest</span>
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden md:flex">
            <Link href="/register">Register</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:flex">
            <Link href="/admin">Admin Login</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

