export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-4xl font-bold">AI YouTube Comment Agent</h1>
        <p className="text-gray-400 text-lg">
          Reply to YouTube comments automatically using AI.
        </p>
        
         <a href="/api/auth/signin?callbackUrl=https%3A%2F%2Fyoutube-ai-agent-tksl.onrender.com%2Fdashboard"
          className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition"
        >
          Connect YouTube
        </a>
        <ul className="text-gray-400 text-sm space-y-2 text-left inline-block">
          <li>✓ Context-aware replies</li>
          <li>✓ Learns from your videos</li>
          <li>✓ Auto-reply mode</li>
          <li>✓ Approval mode</li>
        </ul>
      </div>
    </main>
  )
}