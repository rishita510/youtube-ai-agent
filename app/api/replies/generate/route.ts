import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const { commentId } = await req.json()

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { video: true },
  })

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 })
  }

  const settings = await prisma.setting.findUnique({
    where: { userId: session.user.id as string },
  })

  const tone = settings?.replyTone || "friendly"
  const customPrompt = settings?.customPrompt || ""

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a YouTube content creator replying to comments on your videos. 
        Be ${tone} in your tone.
        Video title: ${comment.video.title}
        Video description: ${comment.video.description || ""}
        ${customPrompt ? `Additional instructions: ${customPrompt}` : ""}
        Keep replies concise and engaging. Max 3 sentences.`,
      },
      {
        role: "user",
        content: `Comment: "${comment.commentText}"\n\nGenerate a reply to this comment.`,
      },
    ],
  })

  const replyText = completion.choices[0].message.content || ""

  const reply = await prisma.reply.create({
    data: {
      commentId: comment.id,
      replyText,
      status: "PENDING",
    },
  })

  return NextResponse.json({ reply })
}