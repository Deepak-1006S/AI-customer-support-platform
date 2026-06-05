import clsx from 'clsx'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({
  title, value, subtitle,
  icon: Icon,
  iconColor = 'text-brand-600',
  iconBg    = 'bg-brand-50',
  change, trend,
  suffix = '', prefix = '',
}) {
  // trend: 'up' | 'down'
  // A change is "good" if:
  //   - trend=up and change > 0 (higher is better)
  //   - trend=down and change < 0 (lower is better, e.g. response time)
  const goodChange =
    (trend === 'up'   && change > 0) ||
    (trend === 'down' && change < 0)

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
          <p className="text-[26px] font-bold text-slate-900 mt-1 leading-none tabular-nums">
            {prefix}{value}{suffix}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={clsx('p-2.5 rounded-xl shrink-0', iconBg)}>
            <Icon className={clsx('w-5 h-5', iconColor)} />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className={clsx(
          'flex items-center gap-1.5 text-xs font-semibold pt-3 border-t border-slate-50',
          goodChange ? 'text-emerald-600' : 'text-red-500'
        )}>
          {goodChange
            ? <TrendingUp className="w-3.5 h-3.5" />
            : <TrendingDown className="w-3.5 h-3.5" />
          }
          <span>{Math.abs(change)}% vs last week</span>
        </div>
      )}
    </div>
  )
}
