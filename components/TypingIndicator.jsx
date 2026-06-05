export default function TypingIndicator({ label = 'AI is thinking…' }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-100 rounded-2xl rounded-bl-sm shadow-card w-fit max-w-[200px]">
      <div className="flex items-center gap-0.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
      <span className="text-[11px] text-slate-500 font-medium truncate">{label}</span>
    </div>
  )
}
