import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { videos } = await req.json()

  if (!videos || !Array.isArray(videos)) {
    return NextResponse.json({ error: "No videos provided" }, { status: 400 })
  }

  // Get user's channel
  let channel = await prisma.channel.findFirst({
    where: { userId: session.user.id },
  })

  // Create channel if doesn't exist
  if (!channel) {
    channel = await prisma.channel.create({
      data: {
        userId: session.user.id,
        youtubeChannelId: videos[0]?.snippet?.channelId || "unknown",
        channelName: videos[0]?.snippet?.channelTitle || "unknown",
      },
    })
  }

  // Save each video
  const saved = await Promise.all(
    videos.map((video: any) =>
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

  return NextResponse.json({ saved: saved.length })
}