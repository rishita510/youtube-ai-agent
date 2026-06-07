import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function CommentsPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Comments</h1>

      {/* Empty state */}
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">No comments yet.</p>
        <p className="text-sm mt-2">Comments will appear here once your channel is synced.</p>
      </div>
    </div>
  )
}