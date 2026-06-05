import clsx from 'clsx'

const statusConfig = {
  open:     { label: 'Open',     cls: 'badge-open' },
  pending:  { label: 'Pending',  cls: 'badge-pending' },
  resolved: { label: 'Resolved', cls: 'badge-resolved' },
  closed:   { label: 'Closed',   cls: 'badge-closed' },
}

const priorityConfig = {
  urgent: { label: 'Urgent', cls: 'badge-urgent', dot: 'bg-red-500' },
  high:   { label: 'High',   cls: 'badge-high',   dot: 'bg-orange-500' },
  medium: { label: 'Medium', cls: 'badge-medium', dot: 'bg-yellow-500' },
  low:    { label: 'Low',    cls: 'badge-low',    dot: 'bg-slate-400' },
}

export function StatusBadge({ status }) {
  const cfg = statusConfig[status] ?? { label: status, cls: 'badge bg-slate-100 text-slate-600' }
  return <span className={cfg.cls}>{cfg.label}</span>
}

export function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] ?? { label: priority, cls: 'badge bg-slate-100 text-slate-600', dot: 'bg-slate-400' }
  return (
    <span className={cfg.cls}>
      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
      {cfg.label}
    </span>
  )
}
