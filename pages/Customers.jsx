import { useState, useMemo } from 'react'
import { Search, Plus, ChevronDown, Users, Star, Ticket } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useApp } from '../context/AppContext'
import Avatar from '../components/Avatar'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import clsx from 'clsx'

const PLAN_BADGE = {
  Enterprise: 'bg-violet-50 text-violet-700 ring-1 ring-violet-100',
  Pro:        'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
  Business:   'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  Starter:    'bg-slate-100 text-slate-500',
}

const STATUS_BADGE = {
  active:    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  suspended: 'bg-red-50 text-red-700 ring-1 ring-red-100',
}

export default function Customers() {
  const { customers } = useApp()
  const [search,       setSearch]       = useState('')
  const [planFilter,   setPlanFilter]   = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    let r = [...customers]
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(c =>
        c.name.toLowerCase().includes(q)    ||
        c.email.toLowerCase().includes(q)   ||
        c.company.toLowerCase().includes(q)
      )
    }
    if (planFilter   !== 'all') r = r.filter(c => c.plan   === planFilter)
    if (statusFilter !== 'all') r = r.filter(c => c.status === statusFilter)
    return r
  }, [customers, search, planFilter, statusFilter])

  const stats = useMemo(() => ({
    total:      customers.length,
    active:     customers.filter(c => c.status === 'active').length,
    enterprise: customers.filter(c => c.plan === 'Enterprise').length,
    openTickets: customers.reduce((a, c) => a + c.openTickets, 0),
  }), [customers])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} total · ${stats.active} active`}
        actions={
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        }
      />

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total',        value: stats.total,      icon: Users,  color: 'text-slate-900',    bg: 'bg-slate-100',   iconColor: 'text-slate-500' },
          { label: 'Active',       value: stats.active,     icon: Users,  color: 'text-emerald-700',  bg: 'bg-emerald-50',  iconColor: 'text-emerald-600' },
          { label: 'Enterprise',   value: stats.enterprise, icon: Star,   color: 'text-violet-700',   bg: 'bg-violet-50',   iconColor: 'text-violet-600' },
          { label: 'Open Tickets', value: stats.openTickets,icon: Ticket, color: 'text-blue-700',     bg: 'bg-blue-50',     iconColor: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-4">
            <div className={clsx('p-2.5 rounded-xl shrink-0', s.bg)}>
              <s.icon className={clsx('w-5 h-5', s.iconColor)} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{s.label}</p>
              <p className={clsx('text-2xl font-bold mt-0.5 tabular-nums', s.color)}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, company…"
            className="input pl-9 h-9"
          />
        </div>

        <div className="relative">
          <select
            value={planFilter}
            onChange={e => setPlanFilter(e.target.value)}
            className="appearance-none input h-9 pr-8 text-xs min-w-[140px]"
          >
            <option value="all">All Plans</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Pro">Pro</option>
            <option value="Business">Business</option>
            <option value="Starter">Starter</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none input h-9 pr-8 text-xs min-w-[130px]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers found"
          description="Try a different search or remove filters."
          action={
            <button onClick={() => { setSearch(''); setPlanFilter('all'); setStatusFilter('all') }} className="btn-secondary text-sm">
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_120px_100px_130px] gap-4 px-5 py-3 bg-slate-50/60 border-b border-slate-50">
            {['Customer', 'Company', 'Plan', 'Status', 'Tickets', 'CSAT', 'Last Active'].map(h => (
              <div key={h} className="table-header">{h}</div>
            ))}
          </div>

          <div className="divide-y divide-slate-50/80">
            {filtered.map(customer => (
              <div
                key={customer.id}
                className="grid lg:grid-cols-[2fr_1.5fr_1fr_1fr_120px_100px_130px] gap-4 items-center px-5 py-4 hover:bg-slate-50/70 transition-colors cursor-pointer group"
              >
                {/* Name + email */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={customer.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 truncate group-hover:text-brand-700 transition-colors">
                      {customer.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{customer.email}</p>
                  </div>
                </div>

                {/* Company */}
                <p className="text-sm text-slate-700 hidden lg:block truncate font-medium">{customer.company}</p>

                {/* Plan */}
                <div className="hidden lg:block">
                  <span className={clsx('badge', PLAN_BADGE[customer.plan] || 'bg-slate-100 text-slate-500')}>
                    {customer.plan}
                  </span>
                </div>

                {/* Status */}
                <div className="hidden lg:block">
                  <span className={clsx('badge', STATUS_BADGE[customer.status] || 'bg-slate-100 text-slate-500')}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </div>

                {/* Tickets */}
                <div className="hidden lg:flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">{customer.totalTickets}</span>
                  {customer.openTickets > 0 && (
                    <span className="text-xs text-blue-600 font-semibold">({customer.openTickets} open)</span>
                  )}
                </div>

                {/* CSAT */}
                <div className="hidden lg:flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">{customer.satisfaction}%</span>
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        'h-full rounded-full',
                        customer.satisfaction >= 90 ? 'bg-emerald-500' :
                        customer.satisfaction >= 75 ? 'bg-amber-500'   : 'bg-red-400'
                      )}
                      style={{ width: `${customer.satisfaction}%` }}
                    />
                  </div>
                </div>

                {/* Last active */}
                <p className="text-[11px] text-slate-400 hidden lg:block tabular-nums">
                  {formatDistanceToNow(new Date(customer.lastActivity), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/40">
            <p className="text-xs text-slate-400">
              {filtered.length} customer{filtered.length !== 1 ? 's' : ''} shown
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
