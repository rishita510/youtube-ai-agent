import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">
          Welcome, {session.user?.name} 👋
        </h1>
        <p className="text-gray-400">
          Connected account: {session.user?.email}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-900 p-6 rounded-xl">
            <p className="text-gray-400 text-sm">Videos Indexed</p>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl">
            <p className="text-gray-400 text-sm">Comments Today</p>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl">
            <p className="text-gray-400 text-sm">AI Replies Generated</p>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>
      </div>
    </main>
  )
}