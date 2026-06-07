import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function PersonalityPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Teach AI My Style</h1>
      <p className="text-gray-400">Paste examples of your replies so the AI learns your tone.</p>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-2">Example {i}</h2>
            <textarea
              rows={3}
              placeholder="Paste an example of how you reply to comments..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>
        ))}
      </div>

      <button className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
        Save Examples
      </button>
    </div>
  )
}