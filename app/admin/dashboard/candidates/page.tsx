import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CandidateTable } from "@/components/candidate-table"
import { fetchCandidates } from "@/lib/data"

export default async function CandidatesPage({ searchParams }) {
  const query = searchParams?.query || ""
  const page = Number(searchParams?.page) || 1
  const { candidates, totalPages } = await fetchCandidates({ query, page, limit: 10 })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Candidates</h1>
        <Button asChild>
          <Link href="/admin/dashboard/candidates/new">
            <Plus className="mr-2 h-4 w-4" /> Add Candidate
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Candidates</CardTitle>
          <CardDescription>View, add, edit, and delete candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <form className="flex-1" action="/admin/dashboard/candidates">
              <div className="relative">
                <Input placeholder="Search candidates..." name="query" defaultValue={query} className="pr-10" />
                <Button type="submit" size="sm" variant="ghost" className="absolute right-0 top-0 h-full px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </form>
          </div>

          <CandidateTable candidates={candidates} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                <Link
                  href={{
                    pathname: "/admin/dashboard/candidates",
                    query: { ...(query ? { query } : {}), page: page - 1 },
                  }}
                >
                  Previous
                </Link>
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
                <Link
                  href={{
                    pathname: "/admin/dashboard/candidates",
                    query: { ...(query ? { query } : {}), page: page + 1 },
                  }}
                >
                  Next
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

