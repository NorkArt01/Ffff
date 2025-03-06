import type React from "react"
import { redirect } from "next/navigation"

import { AdminSidebar } from "@/components/admin-sidebar"
import { checkAdminSession } from "@/lib/auth"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = await checkAdminSession()

  if (!isAuthenticated) {
    redirect("/admin")
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
      </div>
    </div>
  )
}

