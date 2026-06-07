import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const setting = await prisma.setting.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(setting)
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { replyMode, replyTone, customPrompt } = await req.json()

  const setting = await prisma.setting.upsert({
    where: { userId: session.user.id },
    update: { replyMode, replyTone, customPrompt },
    create: {
      userId: session.user.id,
      replyMode,
      replyTone,
      customPrompt,
    },
  })

  return NextResponse.json(setting)
}