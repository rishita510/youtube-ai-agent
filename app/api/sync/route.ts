import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Call n8n webhook
  await fetch("https://n8n-lf3w.onrender.com/webhook/sync-videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: session.user.id }),
  })

  return NextResponse.json({ success: true })
}