import { useState } from 'react'
import { Bot, ChevronRight, X, Sparkles } from 'lucide-react'
import clsx from 'clsx'

export default function AIInsightBanner({ suggestion, confidence, onApply, onDismiss }) {
  const [dismissed, setDismissed] = useState(false)

  if (!suggestion || dismissed) return null

  const pct = Math.round((confidence ?? 0) * 100)
  const barColor =
    pct >= 90 ? 'bg-emerald-500' :
    pct >= 75 ? 'bg-amber-500'   : 'bg-slate-400'

  function handleDismiss() {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-brand-50 to-violet-50/60 border border-brand-100 rounded-2xl animate-fade-in">
      <div className="p-2 bg-gradient-to-br from-brand-500 to-violet-600 rounded-xl shrink-0 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <p className="text-xs font-bold text-brand-700 uppercase tracking-wide">AI Suggestion</p>
          <div className="flex items-center gap-1.5">
            <div className="h-1 w-14 bg-brand-100 rounded-full overflow-hidden">
              <div className={clsx('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] text-slate-400 font-medium tabular-nums">{pct}% confidence</span>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{suggestion}</p>
        {onApply && (
          <button
            onClick={onApply}
            className="flex items-center gap-1 mt-2.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Use this suggestion <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="text-slate-400 hover:text-slate-600 shrink-0 mt-0.5 hover:bg-slate-100 rounded-lg p-1 transition-colors"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
