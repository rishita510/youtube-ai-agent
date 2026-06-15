import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function CommentsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/")
  }

  const channel = await prisma.channel.findFirst({
    where: { userId: session?.user?.id as string },
    include: {
      videos: {
        include: {
          comments: {
            include: {
              replies: true,
            },
          },
        },
      },
    },
  })

  const comments = channel?.videos.flatMap((v) => v.comments) || []

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
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">AI Reply:</p>
                  <p>{comment.replies[0].replyText}</p>
                  <span className="text-xs text-yellow-400 mt-2 inline-block">
                    {comment.replies[0].status}
                  </span>
                </div>
              ) : (
                <div className="bg-gray-800 p-4 rounded-lg text-gray-500 text-sm">
                  No AI reply yet
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}