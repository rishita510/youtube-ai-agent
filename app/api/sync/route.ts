// import { auth } from "@/auth"
// import { NextResponse } from "next/server"

// export async function POST() {
//   const session = await auth()

//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   // Call n8n webhook
//   await fetch("https://rishita24.app.n8n.cloud/webhook/sync-videos", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId: session.user.id }),
//   })

//   return NextResponse.json({ success: true })
// }
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

export async function POST() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // 1. Fetch videos from YouTube API
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&type=video&key=${YOUTUBE_API_KEY}`
    )
    const data = await res.json()

    if (!data.items) {
      return NextResponse.json({ error: "No videos found" }, { status: 400 })
    }

    // 2. Get or create channel
    let channel = await prisma.channel.findFirst({
      where: { userId: session.user.id },
    })

    if (!channel) {
      channel = await prisma.channel.create({
        data: {
          userId: session.user.id,
          youtubeChannelId: CHANNEL_ID!,
          channelName: data.items[0]?.snippet?.channelTitle || "My Channel",
        },
      })
    }

    // 3. Save videos to database
    const saved = await Promise.all(
      data.items.map((video: any) =>
        prisma.video.upsert({
          where: { youtubeId: video.id.videoId },
          update: {
            title: video.snippet.title,
            description: video.snippet.description,
          },
          create: {
            channelId: channel!.id,
            youtubeId: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
          },
        })
      )
    )

    return NextResponse.json({ success: true, saved: saved.length })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}