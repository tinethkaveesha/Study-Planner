import { useState } from 'react'

export default function GroupModal() {
  const [isOpen] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl rounded-none border-2 border-cyan-400 bg-gradient-to-br from-slate-900 to-purple-900/50 p-8 shadow-2xl shadow-cyan-500/40">
        <h2 className="font-mono font-bold text-2xl text-cyan-400 mb-6 tracking-wider">$ STUDY_GROUPS</h2>
        <p className="font-mono text-sm text-gray-400">&gt; Group collaboration interface</p>
      </div>
    </div>
  )
}
