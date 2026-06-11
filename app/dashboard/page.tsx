// 
// import { auth } from "@/auth"
// import { redirect } from "next/navigation"

// export default async function DashboardPage() {
//   const session = await auth()

//   if (!session) {
//     redirect("/")
//   }

//   return (
//     <main className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">
//           Welcome, {session.user?.name} 👋
//         </h1>
//         <form action="/api/sync" method="POST">
//           <button
//             type="submit"
//             className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition"
//           >
//             Sync Now
//           </button>
//         </form>
//       </div>

//       <p className="text-gray-400">
//         Connected account: {session.user?.email}
//       </p>

//       <div className="grid grid-cols-3 gap-4 mt-8">
//         <div className="bg-gray-900 p-6 rounded-xl">
//           <p className="text-gray-400 text-sm">Videos Indexed</p>
//           <p className="text-3xl font-bold mt-2">0</p>
//         </div>
//         <div className="bg-gray-900 p-6 rounded-xl">
//           <p className="text-gray-400 text-sm">Comments Today</p>
//           <p className="text-3xl font-bold mt-2">0</p>
//         </div>
//         <div className="bg-gray-900 p-6 rounded-xl">
//           <p className="text-gray-400 text-sm">AI Replies Generated</p>
//           <p className="text-3xl font-bold mt-2">0</p>
//         </div>
//       </div>
//     </main>
//   )
// }
"use client"

import { useState } from "react"

export default function DashboardPage() {
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState("")

  const handleSync = async () => {
    setSyncing(true)
    setMessage("")
    try {
      const res = await fetch("/api/sync", { method: "POST" })
      if (res.ok) {
        setMessage("Sync started!")
      } else {
        setMessage("Sync failed.")
      }
    } catch (e) {
      setMessage("Sync failed.")
    }
    setSyncing(false)
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard 👋</h1>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
        >
          {syncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>

      {message && <p className="text-green-400">{message}</p>}

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
    </main>
  )
}