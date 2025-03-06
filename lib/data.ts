// This file contains functions to fetch data from the database

import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

// Fetch top candidates for the home page
export async function fetchTopCandidates(limit = 3) {
  try {
    const { db } = await connectToDatabase()

    const candidates = await db.collection("candidates").find({}).sort({ totalPoints: -1 }).limit(limit).toArray()

    return candidates
  } catch (error) {
    console.error("Error fetching top candidates:", error)
    // Return mock data as fallback
    return [
      {
        _id: "1",
        name: "John Smith",
        school: "St. Mary's High School",
        totalPoints: 85,
      },
      {
        _id: "2",
        name: "Emily Johnson",
        school: "Greenwood Academy",
        totalPoints: 78,
      },
      {
        _id: "3",
        name: "Michael Chen",
        school: "Riverside School",
        totalPoints: 72,
      },
    ]
  }
}

// Fetch categories for the scoreboard
export async function fetchCategories() {
  try {
    const { db } = await connectToDatabase()

    const categories = await db.collection("categories").find({}).toArray()

    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return mock data as fallback
    return [
      {
        _id: "cat1",
        name: "Music",
        description: "Vocal and instrumental performances",
      },
      {
        _id: "cat2",
        name: "Dance",
        description: "Classical and contemporary dance forms",
      },
      {
        _id: "cat3",
        name: "Literary",
        description: "Poetry, essay writing, and debates",
      },
      {
        _id: "cat4",
        name: "Visual Arts",
        description: "Painting, sculpture, and photography",
      },
    ]
  }
}

// Fetch scoreboard data
export async function fetchScoreboard() {
  try {
    const { db } = await connectToDatabase()

    // Get overall standings
    const overall = await db.collection("candidates").find({}).sort({ totalPoints: -1 }).limit(20).toArray()

    // Get category-wise standings
    const categories = await fetchCategories()
    const byCategory = {}

    for (const category of categories) {
      const candidates = await db
        .collection("candidates")
        .find({ category: category.name })
        .sort({ totalPoints: -1 })
        .limit(10)
        .toArray()

      byCategory[category._id] = candidates
    }

    return { overall, byCategory }
  } catch (error) {
    console.error("Error fetching scoreboard:", error)
    // Return mock data as fallback
    return {
      overall: [
        {
          _id: "1",
          name: "John Smith",
          school: "St. Mary's High School",
          points: 85,
        },
        {
          _id: "2",
          name: "Emily Johnson",
          school: "Greenwood Academy",
          points: 78,
        },
        {
          _id: "3",
          name: "Michael Chen",
          school: "Riverside School",
          points: 72,
        },
        {
          _id: "4",
          name: "Sarah Williams",
          school: "Oakridge Institute",
          points: 68,
        },
        {
          _id: "5",
          name: "David Rodriguez",
          school: "Lincoln High School",
          points: 65,
        },
      ],
      byCategory: {
        cat1: [
          {
            _id: "1",
            name: "John Smith",
            school: "St. Mary's High School",
            points: 28,
          },
          {
            _id: "6",
            name: "Aisha Patel",
            school: "Westview Academy",
            points: 26,
          },
          {
            _id: "3",
            name: "Michael Chen",
            school: "Riverside School",
            points: 24,
          },
        ],
        cat2: [
          {
            _id: "2",
            name: "Emily Johnson",
            school: "Greenwood Academy",
            points: 30,
          },
          {
            _id: "7",
            name: "James Wilson",
            school: "Northside School",
            points: 28,
          },
          {
            _id: "1",
            name: "John Smith",
            school: "St. Mary's High School",
            points: 25,
          },
        ],
        cat3: [
          {
            _id: "4",
            name: "Sarah Williams",
            school: "Oakridge Institute",
            points: 27,
          },
          {
            _id: "3",
            name: "Michael Chen",
            school: "Riverside School",
            points: 25,
          },
          {
            _id: "8",
            name: "Olivia Martinez",
            school: "Eastside High",
            points: 23,
          },
        ],
        cat4: [
          {
            _id: "5",
            name: "David Rodriguez",
            school: "Lincoln High School",
            points: 29,
          },
          {
            _id: "2",
            name: "Emily Johnson",
            school: "Greenwood Academy",
            points: 26,
          },
          {
            _id: "9",
            name: "Sophia Kim",
            school: "Central Academy",
            points: 24,
          },
        ],
      },
    }
  }
}

// Fetch candidate by ID
export async function fetchCandidateById(id) {
  try {
    const { db } = await connectToDatabase()

    const candidate = await db.collection("candidates").findOne({ _id: new ObjectId(id) })

    if (!candidate) {
      return null
    }

    // Get candidate's scores
    const scores = await db.collection("scores").find({ candidateId: id }).toArray()

    // Get programs the candidate is registered for
    const programs = await db
      .collection("programs")
      .find({ _id: { $in: candidate.programs.map((p) => (typeof p === "string" ? p : p._id)) } })
      .toArray()

    return {
      ...candidate,
      scores,
      programs,
    }
  } catch (error) {
    console.error("Error fetching candidate:", error)
    return null
  }
}

// Fetch candidates with pagination and search
export async function fetchCandidates({ query = "", page = 1, limit = 10 }) {
  try {
    const { db } = await connectToDatabase()
    const skip = (page - 1) * limit

    const filter = query
      ? {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { candidateId: { $regex: query, $options: "i" } },
            { school: { $regex: query, $options: "i" } },
          ],
        }
      : {}

    const candidates = await db
      .collection("candidates")
      .find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const totalCandidates = await db.collection("candidates").countDocuments(filter)
    const totalPages = Math.ceil(totalCandidates / limit)

    return {
      candidates,
      totalPages,
      currentPage: page,
    }
  } catch (error) {
    console.error("Error fetching candidates:", error)
    return { candidates: [], totalPages: 0, currentPage: 1 }
  }
}

// Fetch dashboard statistics for admin
export async function fetchDashboardStats() {
  try {
    const { db } = await connectToDatabase()

    // Get total candidates
    const totalCandidates = await db.collection("candidates").countDocuments()

    // Get new candidates (registered in the last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const newCandidates = await db.collection("candidates").countDocuments({
      createdAt: { $gte: oneWeekAgo },
    })

    // Get total programs
    const totalPrograms = await db.collection("programs").countDocuments()

    // Get completed programs
    const completedPrograms = await db.collection("programs").countDocuments({
      status: "completed",
    })

    // Get total schools
    const schools = await db.collection("candidates").distinct("school")
    const totalSchools = schools.length

    // Get districts (mocked for now)
    const districts = 8

    // Get days remaining (mocked for now)
    const daysRemaining = 3

    // Get top schools
    const topSchools = await db
      .collection("candidates")
      .aggregate([
        { $group: { _id: "$school", points: { $sum: "$totalPoints" }, candidates: { $sum: 1 } } },
        { $sort: { points: -1 } },
        { $limit: 5 },
        { $project: { _id: 1, name: "$_id", points: 1, candidates: 1 } },
      ])
      .toArray()

    // Get category distribution
    const categoryDistribution = await db
      .collection("candidates")
      .aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
      .toArray()

    const totalCount = categoryDistribution.reduce((sum, cat) => sum + cat.count, 0)

    categoryDistribution.forEach((cat) => {
      cat.name = cat._id
      cat.percentage = Math.round((cat.count / totalCount) * 100)
    })

    // Get upcoming programs
    const upcomingPrograms = await db
      .collection("programs")
      .find({ status: "upcoming" })
      .sort({ date: 1 })
      .limit(4)
      .toArray()

    // Mock recent activities for now
    const recentActivities = [
      {
        _id: "act1",
        title: "New Score Added",
        description: "Score added for Classical Dance - Junior Category",
        time: "10 minutes ago",
        icon: "Trophy",
      },
      {
        _id: "act2",
        title: "New Candidate Registered",
        description: "Sarah Williams from Oakridge Institute",
        time: "45 minutes ago",
        icon: "Users",
      },
      {
        _id: "act3",
        title: "Program Updated",
        description: "Venue changed for Group Dance competition",
        time: "2 hours ago",
        icon: "Calendar",
      },
      {
        _id: "act4",
        title: "Report Generated",
        description: "Daily summary report generated",
        time: "5 hours ago",
        icon: "FileText",
      },
    ]

    return {
      totalCandidates,
      newCandidates,
      totalPrograms,
      completedPrograms,
      totalSchools,
      districts,
      daysRemaining,
      topSchools,
      categoryDistribution,
      upcomingPrograms,
      recentActivities,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return mock data as fallback
    return {
      totalCandidates: 248,
      newCandidates: 12,
      totalPrograms: 32,
      completedPrograms: 18,
      totalSchools: 24,
      districts: 8,
      daysRemaining: 3,
      topSchools: [
        {
          _id: "school1",
          name: "St. Mary's High School",
          candidates: 28,
          points: 342,
        },
        {
          _id: "school2",
          name: "Greenwood Academy",
          candidates: 32,
          points: 315,
        },
        {
          _id: "school3",
          name: "Riverside School",
          candidates: 25,
          points: 287,
        },
        {
          _id: "school4",
          name: "Oakridge Institute",
          candidates: 22,
          points: 264,
        },
        {
          _id: "school5",
          name: "Lincoln High School",
          candidates: 18,
          points: 236,
        },
      ],
      categoryDistribution: [
        {
          name: "Junior",
          count: 98,
          percentage: 40,
        },
        {
          name: "Senior",
          count: 86,
          percentage: 35,
        },
        {
          name: "Sub Junior",
          count: 64,
          percentage: 25,
        },
      ],
      upcomingPrograms: [
        {
          _id: "prog1",
          name: "Classical Vocal Solo",
          date: "Mar 6, 2025",
          time: "10:00 AM",
          venue: "Main Auditorium",
        },
        {
          _id: "prog2",
          name: "Group Dance",
          date: "Mar 6, 2025",
          time: "2:00 PM",
          venue: "Open Air Theatre",
        },
        {
          _id: "prog3",
          name: "Debate Competition",
          date: "Mar 7, 2025",
          time: "9:30 AM",
          venue: "Conference Hall",
        },
        {
          _id: "prog4",
          name: "Painting Exhibition",
          date: "Mar 7, 2025",
          time: "11:00 AM",
          venue: "Art Gallery",
        },
      ],
      recentActivities: [
        {
          _id: "act1",
          title: "New Score Added",
          description: "Score added for Classical Dance - Junior Category",
          time: "10 minutes ago",
          icon: "Trophy",
        },
        {
          _id: "act2",
          title: "New Candidate Registered",
          description: "Sarah Williams from Oakridge Institute",
          time: "45 minutes ago",
          icon: "Users",
        },
        {
          _id: "act3",
          title: "Program Updated",
          description: "Venue changed for Group Dance competition",
          time: "2 hours ago",
          icon: "Calendar",
        },
        {
          _id: "act4",
          title: "Report Generated",
          description: "Daily summary report generated",
          time: "5 hours ago",
          icon: "FileText",
        },
      ],
    }
  }
}

