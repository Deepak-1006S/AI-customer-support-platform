import { useNavigate } from 'react-router-dom'
import {
  Ticket, CheckCircle2, Clock, Star, Bot, ArrowRight,
  AlertTriangle, Zap, TrendingUp, Activity,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import { StatusBadge, PriorityBadge } from '../components/StatusBadge'
import Avatar from '../components/Avatar'
import { useApp } from '../context/AppContext'
import { weeklyTickets, categoryBreakdown } from '../mock-data/analytics'
import { ticketStats } from '../mock-data/tickets'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-modal p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-slate-500 capitalize">{p.name}</span>
          <span className="font-semibold text-slate-800 ml-auto pl-3">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { tickets } = useApp()
  const navigate = useNavigate()

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)

  const urgentTickets = tickets.filter(
    t => t.priority === 'urgent' && t.status !== 'closed' && t.status !== 'resolved'
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${getGreeting()}, Alex`}
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">AI Active</span>
            </div>
          </div>
        }
      />

      {/* ── Urgent alert ── */}
      {urgentTickets.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3.5 bg-red-50 border border-red-200/60 rounded-2xl animate-fade-in">
          <div className="p-1.5 bg-red-100 rounded-lg shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-sm text-red-700 flex-1">
            <span className="font-semibold">{urgentTickets.length} urgent ticket{urgentTickets.length > 1 ? 's' : ''}</span>
            {' '}require immediate attention.
          </p>
          <button
            onClick={() => navigate('/tickets?priority=urgent')}
            className="shrink-0 flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:text-red-800 transition-colors"
          >
            View now <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── KPI Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Tickets"
          value={ticketStats.open}
          subtitle={`${ticketStats.totalToday} received today`}
          icon={Ticket}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          change={8}
          trend="up"
        />
        <StatCard
          title="Resolved Today"
          value={ticketStats.resolvedToday}
          subtitle={`of ${ticketStats.totalToday} total`}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          change={14}
          trend="up"
        />
        <StatCard
          title="Avg Response"
          value={ticketStats.avgResponseTime}
          subtitle="First response time"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          change={12}
          trend="down"
        />
        <StatCard
          title="CSAT Score"
          value={ticketStats.satisfactionScore}
          suffix="%"
          subtitle="Customer satisfaction"
          icon={Star}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          change={2}
          trend="up"
        />
      </div>

      {/* ── AI Performance Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 p-5 shadow-lg">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative flex items-center gap-5">
          <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-sm shrink-0">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-base">
              AI resolved {ticketStats.aiResolutionRate}% of tickets automatically today
            </p>
            <p className="text-sm text-white/75 mt-1">
              Saved your team approximately {Math.round(ticketStats.aiResolutionRate * 4.5 / 10)} hours · Response time improved by 12%
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{ticketStats.aiResolutionRate}%</p>
              <p className="text-xs text-white/60">AI Rate</p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium rounded-xl transition-all backdrop-blur-sm"
            >
              Analytics <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Ticket Volume</h2>
              <p className="text-xs text-slate-400 mt-0.5">This week</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {[
                { color: '#6366f1', label: 'Open' },
                { color: '#34d399', label: 'Resolved' },
                { color: '#a78bfa', label: 'AI' },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyTickets} barSize={9} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 4 }} />
              <Bar dataKey="open"       fill="#6366f1" radius={[4, 4, 0, 0]} name="open" />
              <Bar dataKey="resolved"   fill="#34d399" radius={[4, 4, 0, 0]} name="resolved" />
              <Bar dataKey="aiHandled"  fill="#a78bfa" radius={[4, 4, 0, 0]} name="AI handled" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">By Category</h2>
            <p className="text-xs text-slate-400 mt-0.5">This week</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%" cy="45%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {categoryBreakdown.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`${v}%`, 'Share']}
                contentStyle={{ border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgb(0 0 0 / 0.1)', fontSize: 12 }}
              />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent tickets */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Tickets</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest activity</p>
            </div>
            <button
              onClick={() => navigate('/tickets')}
              className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50/80">
            {recentTickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50/80 transition-colors text-left group"
              >
                <Avatar name={ticket.customer.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-mono text-slate-400">{ticket.id}</span>
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="text-[13px] font-semibold text-slate-800 truncate group-hover:text-brand-700 transition-colors">
                    {ticket.subject}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {ticket.customer.name} · {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </button>
            ))}
          </div>
        </div>

        {/* Side stats */}
        <div className="space-y-4">
          {/* Team activity */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Team Activity</h2>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3.5">
              {[
                { name: 'Alex Rivera',   tickets: 14, color: 'from-brand-400 to-brand-600' },
                { name: 'Priya Nair',    tickets: 11, color: 'from-violet-400 to-violet-600' },
                { name: 'Sam Thompson',  tickets: 9,  color: 'from-cyan-400 to-cyan-600' },
                { name: 'Jordan Lee',    tickets: 8,  color: 'from-emerald-400 to-emerald-600' },
              ].map(agent => (
                <div key={agent.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-700">{agent.name}</span>
                    <span className="text-slate-400 tabular-nums">{agent.tickets} resolved</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full bg-gradient-to-r', agent.color)}
                      style={{ width: `${(agent.tickets / 14) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channels */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Channels Today</h2>
            <div className="space-y-3">
              {[
                { label: 'Email',     count: 18, pct: 43, color: 'bg-brand-500' },
                { label: 'Live Chat', count: 14, pct: 33, color: 'bg-emerald-500' },
                { label: 'Portal',    count: 7,  pct: 17, color: 'bg-amber-500' },
                { label: 'Phone',     count: 3,  pct: 7,  color: 'bg-slate-400' },
              ].map(c => (
                <div key={c.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{c.label}</span>
                    <span className="font-bold text-slate-900 tabular-nums">{c.count}</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={clsx('h-full rounded-full', c.color)} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
