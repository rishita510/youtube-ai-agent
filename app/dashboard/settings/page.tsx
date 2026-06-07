// import { auth } from "@/auth"
// import { redirect } from "next/navigation"

// export default async function SettingsPage() {
//   const session = await auth()

//   if (!session) {
//     redirect("/")
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Settings</h1>

//       <div className="bg-gray-900 rounded-xl p-6 space-y-6">
//         {/* Reply Mode */}
//         <div>
//           <h2 className="text-lg font-semibold mb-3">Reply Mode</h2>
//           <div className="space-y-2">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" name="replyMode" value="manual" defaultChecked className="accent-white"/>
//               <span>Manual Approval</span>
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" name="replyMode" value="auto" className="accent-white"/>
//               <span>Auto Reply</span>
//             </label>
//           </div>
//         </div>

//         {/* Reply Tone */}
//         <div>
//           <h2 className="text-lg font-semibold mb-3">Reply Tone</h2>
//           <div className="space-y-2">
//             {["Professional", "Friendly", "Educational", "Custom"].map((tone) => (
//               <label key={tone} className="flex items-center gap-3 cursor-pointer">
//                 <input type="radio" name="replyTone" value={tone.toLowerCase()} className="accent-white"/>
//                 <span>{tone}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Custom Prompt */}
//         <div>
//           <h2 className="text-lg font-semibold mb-3">Custom Prompt</h2>
//           <textarea
//             rows={4}
//             placeholder="Always answer politely. Use simple explanations. Add emojis occasionally."
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
//           />
//         </div>

//         <button className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
//           Save Settings
//         </button>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState ,useEffect} from "react"

export default function SettingsPage() {
  const [replyMode, setReplyMode] = useState("manual")
  const [replyTone, setReplyTone] = useState("friendly")
  const [customPrompt, setCustomPrompt] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)


  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setReplyMode(data.replyMode || "manual")
          setReplyTone(data.replyTone || "friendly")
          setCustomPrompt(data.customPrompt || "")
        }
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ replyMode, replyTone, customPrompt }),
    })

    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="bg-gray-900 rounded-xl p-6 space-y-6">
        {/* Reply Mode */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Reply Mode</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="replyMode" value="manual"
                checked={replyMode === "manual"}
                onChange={() => setReplyMode("manual")}
                className="accent-white"/>
              <span>Manual Approval</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="replyMode" value="auto"
                checked={replyMode === "auto"}
                onChange={() => setReplyMode("auto")}
                className="accent-white"/>
              <span>Auto Reply</span>
            </label>
          </div>
        </div>

        {/* Reply Tone */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Reply Tone</h2>
          <div className="space-y-2">
            {["professional", "friendly", "educational", "custom"].map((tone) => (
              <label key={tone} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="replyTone" value={tone}
                  checked={replyTone === tone}
                  onChange={() => setReplyTone(tone)}
                  className="accent-white"/>
                <span className="capitalize">{tone}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Prompt */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Custom Prompt</h2>
          <textarea
            rows={4}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Always answer politely. Use simple explanations. Add emojis occasionally."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>
    </div>
  )
}