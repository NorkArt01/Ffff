"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { connectToDatabase } from "./mongodb"

// Search candidates by name or ID
export async function searchCandidates(query) {
  try {
    const { db } = await connectToDatabase()

    const candidates = await db
      .collection("candidates")
      .find({
        $or: [{ name: { $regex: query, $options: "i" } }, { candidateId: { $regex: query, $options: "i" } }],
      })
      .limit(10)
      .toArray()

    return candidates
  } catch (error) {
    console.error("Error searching candidates:", error)
    throw new Error("Failed to search candidates")
  }
}

// Register a new candidate
export async function registerCandidate(formData) {
  try {
    const { db } = await connectToDatabase()

    const candidateData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      school: formData.get("school"),
      category: formData.get("category"),
      participationType: formData.get("participationType"),
      programs: formData
        .get("programs")
        .split(",")
        .map((p) => p.trim()),
      bio: formData.get("bio"),
      photo: null, // We'll handle photo upload separately
      candidateId: `C${Math.floor(1000 + Math.random() * 9000)}`, // Generate a random ID
      totalPoints: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Handle photo upload if provided
    const photo = formData.get("photo")
    if (photo && photo.size > 0) {
      // In a real app, you'd upload to a storage service and store the URL
      // For now, we'll just note that a photo was provided
      candidateData.photo = "/placeholder.svg?height=200&width=200"
    }

    const result = await db.collection("candidates").insertOne(candidateData)

    revalidatePath("/scoreboard")
    revalidatePath("/search")

    return { success: true, id: result.insertedId }
  } catch (error) {
    console.error("Error registering candidate:", error)
    throw new Error("Failed to register candidate")
  }
}

// Add a new candidate (admin)
export async function addCandidate(formData) {
  try {
    const { db } = await connectToDatabase()

    const candidateData = {
      name: formData.get("name"),
      candidateId: formData.get("candidateId"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      school: formData.get("school"),
      category: formData.get("category"),
      participationType: formData.get("participationType"),
      programs: formData
        .get("programs")
        .split(",")
        .map((p) => p.trim()),
      bio: formData.get("bio"),
      photo: null,
      totalPoints: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Handle photo upload if provided
    const photo = formData.get("photo")
    if (photo && photo.size > 0) {
      // In a real app, you'd upload to a storage service and store the URL
      candidateData.photo = "/placeholder.svg?height=200&width=200"
    }

    const result = await db.collection("candidates").insertOne(candidateData)

    revalidatePath("/admin/dashboard/candidates")
    revalidatePath("/scoreboard")
    revalidatePath("/search")

    return { success: true, id: result.insertedId }
  } catch (error) {
    console.error("Error adding candidate:", error)
    throw new Error("Failed to add candidate")
  }
}

// Update a candidate
export async function updateCandidate(formData) {
  try {
    const { db } = await connectToDatabase()
    const id = formData.get("id")

    const updateData = {
      name: formData.get("name"),
      candidateId: formData.get("candidateId"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      school: formData.get("school"),
      category: formData.get("category"),
      participationType: formData.get("participationType"),
      programs: formData
        .get("programs")
        .split(",")
        .map((p) => p.trim()),
      bio: formData.get("bio"),
      updatedAt: new Date(),
    }

    // Handle photo upload if provided
    const photo = formData.get("photo")
    if (photo && photo.size > 0) {
      // In a real app, you'd upload to a storage service and store the URL
      updateData.photo = "/placeholder.svg?height=200&width=200"
    }

    await db.collection("candidates").updateOne({ _id: id }, { $set: updateData })

    revalidatePath(`/candidate/${id}`)
    revalidatePath("/admin/dashboard/candidates")
    revalidatePath("/scoreboard")
    revalidatePath("/search")

    return { success: true }
  } catch (error) {
    console.error("Error updating candidate:", error)
    throw new Error("Failed to update candidate")
  }
}

// Delete a candidate
export async function deleteCandidate(id) {
  try {
    const { db } = await connectToDatabase()

    await db.collection("candidates").deleteOne({ _id: id })

    revalidatePath("/admin/dashboard/candidates")
    revalidatePath("/scoreboard")
    revalidatePath("/search")

    return { success: true }
  } catch (error) {
    console.error("Error deleting candidate:", error)
    throw new Error("Failed to delete candidate")
  }
}

// Admin login
export async function adminLogin({ username, password }) {
  try {
    // Check credentials (hardcoded for now)
    if (username === "admin" && password === "12345@Admin") {
      // Set a cookie to maintain session
      cookies().set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      })

      return true
    }

    return false
  } catch (error) {
    console.error("Error during admin login:", error)
    throw new Error("Login failed")
  }
}

// Admin logout
export async function adminLogout() {
  try {
    cookies().delete("admin_session")
    return true
  } catch (error) {
    console.error("Error during admin logout:", error)
    throw new Error("Logout failed")
  }
}

// Add a new category
export async function addCategory(formData) {
  try {
    const { db } = await connectToDatabase()

    const categoryData = {
      name: formData.get("name"),
      description: formData.get("description"),
      createdAt: new Date(),
    }

    await db.collection("categories").insertOne(categoryData)

    revalidatePath("/admin/dashboard/categories")

    return { success: true }
  } catch (error) {
    console.error("Error adding category:", error)
    throw new Error("Failed to add category")
  }
}

// Add a new program
export async function addProgram(formData) {
  try {
    const { db } = await connectToDatabase()

    const programData = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      date: formData.get("date"),
      time: formData.get("time"),
      venue: formData.get("venue"),
      status: "upcoming",
      createdAt: new Date(),
    }

    await db.collection("programs").insertOne(programData)

    revalidatePath("/admin/dashboard/programs")

    return { success: true }
  } catch (error) {
    console.error("Error adding program:", error)
    throw new Error("Failed to add program")
  }
}

// Add scores for a candidate
export async function addScores(formData) {
  try {
    const { db } = await connectToDatabase()

    const candidateId = formData.get("candidateId")
    const programId = formData.get("programId")
    const points = Number.parseInt(formData.get("points"), 10)

    // Create score record
    const scoreData = {
      candidateId,
      programId,
      points,
      remarks: formData.get("remarks"),
      createdAt: new Date(),
    }

    await db.collection("scores").insertOne(scoreData)

    // Update candidate's total points
    await db.collection("candidates").updateOne({ _id: candidateId }, { $inc: { totalPoints: points } })

    revalidatePath("/scoreboard")
    revalidatePath(`/candidate/${candidateId}`)

    return { success: true }
  } catch (error) {
    console.error("Error adding scores:", error)
    throw new Error("Failed to add scores")
  }
}

