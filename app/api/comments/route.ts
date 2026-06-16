import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const channel = await prisma.channel.findFirst({
    where: { userId: session?.user?.id as string },
    include: {
      videos: {
        include: {
          comments: {
            include: {
              replies: true,
            },
          },
        },
      },
    },
  })

  const comments = channel?.videos.flatMap((v) => v.comments) || []

  return NextResponse.json(comments)
}