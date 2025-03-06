import { Medal } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchCategories, fetchScoreboard } from "@/lib/data"

export default async function ScoreboardPage() {
  const categories = await fetchCategories()
  const scoreboard = await fetchScoreboard()

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Live Scoreboard</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Real-time scores and standings for all categories
        </p>
      </div>

      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category._id} value={category._id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overall" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Standings</CardTitle>
              <CardDescription>Combined scores across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {scoreboard.overall.map((entry, index) => (
                  <div key={entry._id} className="flex items-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                      {index < 3 ? (
                        <Medal
                          className={`h-5 w-5 ${
                            index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"
                          }`}
                        />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{entry.name}</p>
                      <p className="text-sm text-muted-foreground">{entry.school}</p>
                    </div>
                    <div className="ml-auto font-bold text-xl">{entry.points}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category._id} value={category._id} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {scoreboard.byCategory[category._id].map((entry, index) => (
                    <div key={entry._id} className="flex items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                        {index < 3 ? (
                          <Medal
                            className={`h-5 w-5 ${
                              index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"
                            }`}
                          />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">{entry.school}</p>
                      </div>
                      <div className="ml-auto font-bold text-xl">{entry.points}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

