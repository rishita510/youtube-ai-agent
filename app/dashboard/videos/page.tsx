import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function VideosPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Videos</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search videos..."
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
      />

      {/* Empty state */}
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">No videos indexed yet.</p>
        <p className="text-sm mt-2">Sync your YouTube channel to get started.</p>
      </div>
    </div>
  )
}