// import { auth } from "@/auth"
// import { redirect } from "next/navigation"

// export default async function VideosPage() {
//   const session = await auth()

//   if (!session) {
//     redirect("/")
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Videos</h1>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search videos..."
//         className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
//       />

//       {/* Empty state */}
//       <div className="text-center py-20 text-gray-500">
//         <p className="text-lg">No videos indexed yet.</p>
//         <p className="text-sm mt-2">Sync your YouTube channel to get started.</p>
//       </div>
//     </div>
//   )
// }
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function VideosPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  const channel = await prisma.channel.findFirst({
    where: { userId: session.user.id as string},
    include: { videos: true },
  })

  const videos = channel?.videos || []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Videos</h1>
      <p className="text-gray-400">{videos.length} videos indexed</p>

      <div className="space-y-3">
        {videos.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No videos yet. Click Sync Now on the dashboard.</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="bg-gray-900 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-semibold">{video.title}</p>
                <p className="text-gray-400 text-sm">{video.youtubeId}</p>
              </div>
              <span className="text-green-400 text-sm">Indexed ✓</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}