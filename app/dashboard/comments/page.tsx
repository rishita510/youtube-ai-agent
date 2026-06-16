// import { auth } from "@/auth"
// import { redirect } from "next/navigation"
// import { prisma } from "@/lib/prisma"

// export default async function CommentsPage() {
//   const session = await auth()

//   if (!session?.user?.id) {
//     redirect("/")
//   }

//   const channel = await prisma.channel.findFirst({
//     where: { userId: session?.user?.id as string },
//     include: {
//       videos: {
//         include: {
//           comments: {
//             include: {
//               replies: true,
//             },
//           },
//         },
//       },
//     },
//   })

//   const comments = channel?.videos.flatMap((v) => v.comments) || []

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Comments</h1>
//       <p className="text-gray-400">{comments.length} comments found</p>

//       <div className="space-y-4">
//         {comments.length === 0 ? (
//           <div className="text-center py-20 text-gray-500">
//             <p>No comments yet. Sync your channel first.</p>
//           </div>
//         ) : (
//           comments.map((comment) => (
//             <div key={comment.id} className="bg-gray-900 p-6 rounded-xl space-y-4">
//               <div>
//                 <p className="text-sm text-gray-400">{comment.authorName}</p>
//                 <p className="mt-1">{comment.commentText}</p>
//               </div>

//               {comment.replies.length > 0 ? (
//                 <div className="bg-gray-800 p-4 rounded-lg">
//                   <p className="text-sm text-gray-400 mb-1">AI Reply:</p>
//                   <p>{comment.replies[0].replyText}</p>
//                   <span className="text-xs text-yellow-400 mt-2 inline-block">
//                     {comment.replies[0].status}
//                   </span>
//                 </div>
//               ) : (
//                 <div className="bg-gray-800 p-4 rounded-lg text-gray-500 text-sm">
//                   No AI reply yet
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"

type Reply = {
  id: string
  replyText: string
  status: string
}

type Comment = {
  id: string
  commentText: string
  authorName: string | null
  replies: Reply[]
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => {
        setComments(data)
        setLoading(false)
      })
  }, [])

  const generateReply = async (commentId: string) => {
    setGenerating(commentId)
    const res = await fetch("/api/replies/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    })
    const data = await res.json()

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: [data.reply] }
          : c
      )
    )
    setGenerating(null)
  }

  if (loading) return <p className="text-gray-400">Loading comments...</p>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Comments</h1>
      <p className="text-gray-400">{comments.length} comments found</p>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No comments yet. Sync your channel first.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-900 p-6 rounded-xl space-y-4">
              <div>
                <p className="text-sm text-gray-400">{comment.authorName}</p>
                <p className="mt-1">{comment.commentText}</p>
              </div>

              {comment.replies.length > 0 ? (
                <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-gray-400">AI Reply:</p>
                  <p>{comment.replies[0].replyText}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-600 text-white text-sm px-4 py-1 rounded-lg hover:bg-green-700">
                      Approve
                    </button>
                    <button className="bg-red-600 text-white text-sm px-4 py-1 rounded-lg hover:bg-red-700">
                      Reject
                    </button>
                    <button
                      onClick={() => generateReply(comment.id)}
                      className="bg-gray-600 text-white text-sm px-4 py-1 rounded-lg hover:bg-gray-700"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => generateReply(comment.id)}
                  disabled={generating === comment.id}
                  className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  {generating === comment.id ? "Generating..." : "Generate AI Reply"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}