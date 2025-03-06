"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Camera, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { fetchCandidateById, updateCandidate } from "@/lib/actions"

export default function EditCandidatePage({ params }) {
  const [candidate, setCandidate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        const data = await fetchCandidateById(params.id)
        setCandidate(data)
        if (data.photo) {
          setPhotoPreview(data.photo)
        }
      } catch (error) {
        console.error("Failed to load candidate:", error)
        toast({
          title: "Error",
          description: "Failed to load candidate data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCandidate()
  }, [params.id, toast])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.target)
    formData.append("id", params.id)

    try {
      if (photo) {
        formData.append("photo", photo)
      }

      await updateCandidate(formData)

      toast({
        title: "Candidate Updated",
        description: "The candidate has been updated successfully.",
      })

      router.push("/admin/dashboard/candidates")
    } catch (error) {
      console.error("Failed to update candidate:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update candidate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Edit Candidate</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-40">
              <p>Loading candidate data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Edit Candidate</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-40 gap-4">
              <p>Candidate not found</p>
              <Button asChild>
                <Link href="/admin/dashboard/candidates">Back to Candidates</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Candidate</h1>
        <Button asChild variant="outline">
          <Link href="/admin/dashboard/candidates">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates
          </Link>
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>
            <CardDescription>Edit candidate details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" defaultValue={candidate.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidateId">Candidate ID</Label>
                  <Input id="candidateId" name="candidateId" defaultValue={candidate.candidateId} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={candidate.email} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" defaultValue={candidate.phone} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School/Institution</Label>
                  <Input id="school" name="school" defaultValue={candidate.school} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={candidate.category} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="sub-junior">Sub Junior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="participationType">Participation Type</Label>
                  <Select name="participationType" defaultValue={candidate.participationType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="programs">Programs (Comma separated)</Label>
                  <Input
                    id="programs"
                    name="programs"
                    defaultValue={
                      Array.isArray(candidate.programs)
                        ? candidate.programs.map((p) => (typeof p === "string" ? p : p.name)).join(", ")
                        : candidate.programs
                    }
                    placeholder="E.g. Singing, Dancing, Poetry"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  defaultValue={candidate.bio}
                  placeholder="Tell us about the candidate..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Photo</Label>
                <div className="flex items-center gap-4">
                  {photoPreview ? (
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                      <img
                        src={photoPreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 flex items-center justify-center text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-24 w-24 rounded-md bg-muted flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <Input id="photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("photo").click()}>
                      <Upload className="mr-2 h-4 w-4" /> Upload Photo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard/candidates")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

