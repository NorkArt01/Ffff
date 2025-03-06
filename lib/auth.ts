import { cookies } from "next/headers"

// Check if admin is authenticated
export async function checkAdminSession() {
  const cookieStore = cookies()
  const session = cookieStore.get("admin_session")

  return session?.value === "authenticated"
}

