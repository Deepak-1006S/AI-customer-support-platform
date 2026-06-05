import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Plus, Search, SortDesc, ChevronDown,
  Download, Ticket as TicketIcon, RefreshCw,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useApp } from '../context/AppContext'
import { StatusBadge, PriorityBadge } from '../components/StatusBadge'
import Avatar from '../components/Avatar'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import clsx from 'clsx'

const STATUS_FILTERS  = ['all', 'open', 'pending', 'resolved', 'closed']
const PRIORITY_FILTERS = ['all', 'urgent', 'high', 'medium', 'low']

const channelEmoji = { email: '📧', chat: '💬', portal: '🌐', phone: '📞' }

const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }

export default function Tickets() {
  const { tickets } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [search,         setSearch]         = useState(searchParams.get('q') || '')
  const [statusFilter,   setStatusFilter]   = useState('all')
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || 'all')
  const [sortBy,         setSortBy]         = useState('updatedAt')

  const filtered = useMemo(() => {
    let result = [...tickets]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.subject.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.customer.name.toLowerCase().includes(q) ||
        t.customer.email.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
    }
    if (statusFilter   !== 'all') result = result.filter(t => t.status   === statusFilter)
    if (priorityFilter !== 'all') result = result.filter(t => t.priority === priorityFilter)

    result.sort((a, b) => {
      if (sortBy === 'updatedAt') return new Date(b.updatedAt) - new Date(a.updatedAt)
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'priority')  return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
      return a.id.localeCompare(b.id)
    })
    return result
  }, [tickets, search, statusFilter, priorityFilter, sortBy])

  const counts = useMemo(() => {
    const c = { all: tickets.length }
    tickets.forEach(t => { c[t.status] = (c[t.status] || 0) + 1 })
    return c
  }, [tickets])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tickets"
        subtitle={`${filtered.length} of ${tickets.length} ticket${tickets.length !== 1 ? 's' : ''}`}
        actions={
          <div className="flex items-center gap-2">
            <button className="btn-secondary">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="btn-primary">
              <Plus className="w-4 h-4" /> New Ticket
            </button>
          </div>
        }
      />

      {/* ── Filters ── */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tickets, customers, categories…"
              className="input pl-9 h-9"
            />
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="appearance-none input h-9 pr-8 text-xs min-w-[130px]"
            >
              {PRIORITY_FILTERS.map(p => (
                <option key={p} value={p}>
                  {p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none input h-9 pr-8 text-xs min-w-[160px]"
            >
              <option value="updatedAt">Recently Updated</option>
              <option value="createdAt">Recently Created</option>
              <option value="priority">Priority</option>
              <option value="id">Ticket ID</option>
            </select>
            <SortDesc className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={() => { setSearch(''); setStatusFilter('all'); setPriorityFilter('all') }}
            className="btn-ghost text-xs h-9"
            title="Reset filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-fit">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
                statusFilter === s
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              <span className={clsx('ml-1.5 tabular-nums', statusFilter === s ? 'text-slate-400' : 'text-slate-400/60')}>
                {counts[s] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Ticket table ── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title="No tickets found"
          description="Try adjusting your search or filters."
          action={
            <button onClick={() => { setSearch(''); setStatusFilter('all'); setPriorityFilter('all') }} className="btn-secondary text-sm">
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          {/* Header row */}
          <div className="hidden lg:grid grid-cols-[120px_1fr_160px_100px_100px_120px_36px] gap-4 px-5 py-3 border-b border-slate-50 bg-slate-50/60">
            {['Ticket', 'Subject', 'Customer', 'Priority', 'Status', 'Updated', ''].map(h => (
              <div key={h} className="table-header">{h}</div>
            ))}
          </div>

          <div className="divide-y divide-slate-50/80">
            {filtered.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                className="w-full grid lg:grid-cols-[120px_1fr_160px_100px_100px_120px_36px] gap-4 items-center px-5 py-4 hover:bg-slate-50/70 transition-colors text-left group"
              >
                {/* ID + channel */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-mono font-medium text-slate-500 truncate">{ticket.id}</span>
                  <span className="text-sm hidden sm:block shrink-0" title={ticket.channel}>
                    {channelEmoji[ticket.channel]}
                  </span>
                </div>

                {/* Subject + assignee */}
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-slate-800 truncate group-hover:text-brand-700 transition-colors">
                    {ticket.subject}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {ticket.category}
                    {ticket.assignee && ` · → ${ticket.assignee.name}`}
                  </p>
                </div>

                {/* Customer */}
                <div className="hidden lg:flex items-center gap-2 min-w-0">
                  <Avatar name={ticket.customer.name} size="xs" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{ticket.customer.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{ticket.customer.company}</p>
                  </div>
                </div>

                {/* Priority */}
                <div className="hidden lg:block">
                  <PriorityBadge priority={ticket.priority} />
                </div>

                {/* Status */}
                <div className="hidden lg:block">
                  <StatusBadge status={ticket.status} />
                </div>

                {/* Updated */}
                <div className="hidden lg:block">
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                  </span>
                </div>

                {/* Arrow */}
                <div className="hidden lg:flex items-center justify-center">
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-300 group-hover:text-brand-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/40 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>
            <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
              Export filtered →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
