"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Calendar, FileText, Home, LogOut, Settings, Trophy, User, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { adminLogout } from "@/lib/actions"

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/dashboard/candidates",
      label: "Candidates",
      icon: Users,
      active: pathname === "/admin/dashboard/candidates",
    },
    {
      href: "/admin/dashboard/programs",
      label: "Programs",
      icon: Calendar,
      active: pathname === "/admin/dashboard/programs",
    },
    {
      href: "/admin/dashboard/categories",
      label: "Categories",
      icon: FileText,
      active: pathname === "/admin/dashboard/categories",
    },
    {
      href: "/admin/dashboard/schools",
      label: "Schools",
      icon: User,
      active: pathname === "/admin/dashboard/schools",
    },
    {
      href: "/admin/dashboard/scores",
      label: "Scores",
      icon: Trophy,
      active: pathname === "/admin/dashboard/scores",
    },
    {
      href: "/admin/dashboard/controllers",
      label: "Controllers",
      icon: Users,
      active: pathname === "/admin/dashboard/controllers",
    },
    {
      href: "/admin/dashboard/reports",
      label: "Reports",
      icon: BarChart,
      active: pathname === "/admin/dashboard/reports",
    },
    {
      href: "/admin/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/admin/dashboard/settings",
    },
  ]

  const handleLogout = async () => {
    await adminLogout()
    window.location.href = "/admin"
  }

  return (
    <div className="hidden border-r bg-muted/40 lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <Trophy className="h-6 w-6" />
            <span>Arts Fest Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  route.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

