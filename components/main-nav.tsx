"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Medal, QrCode, Search, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/scoreboard",
      label: "Scoreboard",
      icon: Medal,
      active: pathname === "/scoreboard",
    },
    {
      href: "/search",
      label: "Search",
      icon: Search,
      active: pathname === "/search",
    },
    {
      href: "/qr-scanner",
      label: "QR Scanner",
      icon: QrCode,
      active: pathname === "/qr-scanner",
    },
    {
      href: "/register",
      label: "Register",
      icon: User,
      active: pathname === "/register",
    },
  ]

  return (
    <div className="flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid gap-2 py-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-lg font-medium rounded-md",
                  route.active ? "text-primary bg-muted" : "text-muted-foreground hover:text-primary hover:bg-muted",
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <nav className="hidden md:flex items-center gap-6 mx-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              route.active ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

