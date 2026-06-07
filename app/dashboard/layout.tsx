import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-6">YT Agent</h2>
        <Link href="/dashboard" className="px-4 py-2 rounded-lg hover:bg-gray-800">
          🏠 Home
        </Link>
        <Link href="/dashboard/videos" className="px-4 py-2 rounded-lg hover:bg-gray-800">
          🎬 Videos
        </Link>
        <Link href="/dashboard/comments" className="px-4 py-2 rounded-lg hover:bg-gray-800">
          💬 Comments
        </Link>
        <Link href="/dashboard/settings" className="px-4 py-2 rounded-lg hover:bg-gray-800">
          ⚙️ Settings
        </Link>
        <Link href="/dashboard/personality" className="px-4 py-2 rounded-lg hover:bg-gray-800">
          🤖 AI Personality
        </Link>
        <div className="mt-auto">
          <a href="/api/auth/signout" className="px-4 py-2 rounded-lg hover:bg-gray-800 text-red-400 block">
            Sign Out
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}