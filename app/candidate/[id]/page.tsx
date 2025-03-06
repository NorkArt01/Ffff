import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Award, Calendar, Medal, School, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCodeGenerator } from "@/components/qr-code-generator"
import { fetchCandidateById } from "@/lib/data"

export default async function CandidateProfilePage({ params }) {
  const candidate = await fetchCandidateById(params.id)

  if (!candidate) {
    return (
      <div className="container py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Candidate Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The candidate you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/search">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/search">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Link>
        </Button>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  {candidate.photo ? (
                    <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4">
                      <Image
                        src={candidate.photo || "/placeholder.svg"}
                        alt={candidate.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center mb-4">
                      <User className="h-24 w-24 text-muted-foreground/60" />
                    </div>
                  )}

                  <h1 className="text-2xl font-bold">{candidate.name}</h1>
                  <p className="text-muted-foreground">ID: {candidate.candidateId}</p>

                  <div className="mt-4 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <span>{candidate.school}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>{candidate.category}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>Scan to access this profile</CardDescription>
              </CardHeader>
              <CardContent>
                <QrCodeGenerator
                  defaultValue={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/candidate/${candidate._id}`}
                  size={150}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Overall scores and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-medium">Total Points</p>
                    <p className="text-3xl font-bold text-primary">{candidate.totalPoints}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Overall Rank</p>
                    <p className="text-3xl font-bold">{candidate.rank || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Programs</p>
                    <p className="text-3xl font-bold">{candidate.programs?.length || 0}</p>
                  </div>
                </div>

                {candidate.achievements && candidate.achievements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Achievements</h3>
                    <div className="space-y-2">
                      {candidate.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Medal className="h-4 w-4 text-yellow-500" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="programs">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="scores">Scores</TabsTrigger>
              </TabsList>

              <TabsContent value="programs" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Registered Programs</CardTitle>
                    <CardDescription>Programs the candidate is participating in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {candidate.programs && candidate.programs.length > 0 ? (
                      <div className="space-y-4">
                        {candidate.programs.map((program, index) => (
                          <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">{program.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {program.date} • {program.time} • {program.venue}
                              </p>
                              {program.status && (
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    program.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : program.status === "upcoming"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-6">No programs registered</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scores" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Program Scores</CardTitle>
                    <CardDescription>Scores received in each program</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {candidate.scores && candidate.scores.length > 0 ? (
                      <div className="space-y-4">
                        {candidate.scores.map((score, index) => (
                          <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                            <div>
                              <p className="font-medium">{score.programName}</p>
                              <p className="text-sm text-muted-foreground">{score.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">{score.points}</p>
                              <p className="text-sm text-muted-foreground">Rank: {score.rank || "-"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-6">No scores available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

