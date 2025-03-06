"use client"

import { useState } from "react"
import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { searchCandidates } from "@/lib/actions"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const results = await searchCandidates(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Find Candidates</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Search for candidates by name or ID
        </p>
      </div>

      <Tabs defaultValue="search" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Candidates</CardTitle>
              <CardDescription>Enter a name or ID to find candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2 mb-8">
                <Input
                  type="text"
                  placeholder="Enter name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </form>

              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((candidate) => (
                    <Card key={candidate._id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 bg-muted p-4 flex items-center justify-center">
                          {candidate.photo ? (
                            <img
                              src={candidate.photo || "/placeholder.svg"}
                              alt={candidate.name}
                              className="h-24 w-24 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 md:p-6 w-full md:w-3/4">
                          <h3 className="text-lg font-bold">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">ID: {candidate.candidateId}</p>
                          <p className="text-sm mb-2">
                            <strong>School:</strong> {candidate.school}
                          </p>
                          <p className="text-sm mb-2">
                            <strong>Category:</strong> {candidate.category}
                          </p>
                          <p className="text-sm mb-4">
                            <strong>Total Points:</strong> {candidate.totalPoints}
                          </p>
                          <Button asChild size="sm">
                            <a href={`/candidate/${candidate._id}`}>View Full Profile</a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : searchQuery && !isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No candidates found. Try a different search term.</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>Scan a candidate's QR code to view their profile</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-md aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                <p className="text-center text-muted-foreground">
                  Camera access will be requested when you click the button below
                </p>
              </div>
              <Button asChild>
                <a href="/qr-scanner">Open QR Scanner</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

