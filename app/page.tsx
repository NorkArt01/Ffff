import Link from "next/link"
import { ArrowRight, Calendar, Search, Trophy, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CountdownTimer from "@/components/countdown-timer"
import { fetchTopCandidates } from "@/lib/data"

export default async function Home() {
  const topCandidates = await fetchTopCandidates()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">Arts Fest 2025</h1>
            <p className="max-w-[700px] text-gray-200 md:text-xl">
              Celebrating creativity, talent, and artistic excellence
            </p>
            <div className="mt-8">
              <CountdownTimer targetDate="2025-03-15T09:00:00" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="bg-white text-purple-700 hover:bg-gray-100">
                <Link href="/scoreboard">
                  View Scoreboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                <Link href="/search">
                  Find Candidate <Search className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-purple-600" /> Live Scoreboard
                </CardTitle>
                <CardDescription>Track scores in real-time as events unfold</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our live scoreboard updates instantly, showing you the latest standings across all categories and
                  events.
                </p>
                <Button asChild variant="link" className="mt-4 p-0">
                  <Link href="/scoreboard">View Scoreboard</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-purple-600" /> Candidate Profiles
                </CardTitle>
                <CardDescription>Detailed information about participants</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Search for candidates by name or ID to view their profiles, registered events, and current scores.
                </p>
                <Button asChild variant="link" className="mt-4 p-0">
                  <Link href="/search">Search Candidates</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-purple-600" /> Event Schedule
                </CardTitle>
                <CardDescription>Complete program schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View the full schedule of all events, including times, venues, and participating candidates.
                </p>
                <Button asChild variant="link" className="mt-4 p-0">
                  <Link href="/schedule">View Schedule</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Performers */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Top Performers</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Recognizing excellence across all categories
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {topCandidates.map((candidate) => (
              <Card key={candidate._id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>{candidate.name}</CardTitle>
                      <CardDescription>{candidate.school}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Total Points</p>
                      <p className="text-2xl font-bold text-purple-600">{candidate.totalPoints}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/candidate/${candidate._id}`}>View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link href="/scoreboard">View Full Scoreboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Quick Access with QR Codes
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Scan your personal QR code to instantly access your profile and scores. No more searching through lists!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button asChild size="lg">
                  <Link href="/qr-scanner">Scan QR Code</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-700">
                <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                  <img src="/placeholder.svg?height=300&width=300" alt="QR Code Scanner" className="w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

