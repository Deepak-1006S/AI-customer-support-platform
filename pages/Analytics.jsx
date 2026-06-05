import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Avatar from '../components/Avatar'
import {
  weeklyTickets, monthlyTrend, categoryBreakdown,
  channelBreakdown, agentPerformance, kpiMetrics,
} from '../mock-data/analytics'
import clsx from 'clsx'

const PIE_COLORS     = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
const CHANNEL_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-modal p-3 text-xs">
      {label && <p className="font-semibold text-slate-700 mb-2">{label}</p>}
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.fill || p.color }} />
          <span className="text-slate-500 capitalize">{p.name}</span>
          <span className="font-bold text-slate-800 ml-auto pl-4 tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function MetricCard({ label, value, change, trend, suffix = '' }) {
  // For "down is good" metrics (response time, resolution time), flip the good/bad logic
  const isGood =
    (trend === 'up'   && change > 0) ||
    (trend === 'down' && change < 0)

  return (
    <div className="card p-5 hover:shadow-card-hover transition-shadow duration-200">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">{value}{suffix}</p>
      <div className={clsx('flex items-center gap-1.5 mt-3 text-xs font-semibold', isGood ? 'text-emerald-600' : 'text-red-500')}>
        {isGood
          ? <TrendingUp className="w-3.5 h-3.5" />
          : <TrendingDown className="w-3.5 h-3.5" />
        }
        {Math.abs(change)}% vs last month
      </div>
    </div>
  )
}

export default function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Platform performance, trends, and team insights"
        actions={
          <div className="flex items-center gap-2">
            <select className="input h-9 text-xs w-36">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
        }
      />

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard label="First Response"  value={kpiMetrics.firstResponseTime.value} change={kpiMetrics.firstResponseTime.change} trend={kpiMetrics.firstResponseTime.trend} />
        <MetricCard label="Resolution Time" value={kpiMetrics.resolutionTime.value}    change={kpiMetrics.resolutionTime.change}    trend={kpiMetrics.resolutionTime.trend} />
        <MetricCard label="CSAT Score"      value={kpiMetrics.csat.value}              change={kpiMetrics.csat.change}              trend={kpiMetrics.csat.trend}           suffix="%" />
        <MetricCard label="AI Resolution"   value={kpiMetrics.aiResolutionRate.value}  change={kpiMetrics.aiResolutionRate.change}  trend={kpiMetrics.aiResolutionRate.trend} suffix="%" />
        <MetricCard label="Tickets / Day"   value={kpiMetrics.ticketsPerDay.value}     change={kpiMetrics.ticketsPerDay.change}     trend={kpiMetrics.ticketsPerDay.trend} />
        <MetricCard label="SLA Compliance"  value={kpiMetrics.slaCompliance.value}     change={kpiMetrics.slaCompliance.change}     trend={kpiMetrics.slaCompliance.trend}  suffix="%" />
      </div>

      {/* ── Charts row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-slate-900">Daily Ticket Volume</h2>
            <p className="text-xs text-slate-400 mt-0.5">Open · Resolved · AI Handled</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyTickets} barSize={10} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 4 }} />
              <Bar dataKey="open"      fill="#6366f1" radius={[4, 4, 0, 0]} name="open" />
              <Bar dataKey="resolved"  fill="#34d399" radius={[4, 4, 0, 0]} name="resolved" />
              <Bar dataKey="aiHandled" fill="#a78bfa" radius={[4, 4, 0, 0]} name="AI handled" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-slate-900">Monthly CSAT Trend</h2>
            <p className="text-xs text-slate-400 mt-0.5">Customer satisfaction score over time</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="csatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[82, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="satisfaction"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#csatGrad)"
                name="CSAT %"
                dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">By Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%" cy="50%"
                innerRadius={58} outerRadius={82}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {categoryBreakdown.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, 'Share']} contentStyle={{ border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgb(0 0 0 / 0.1)', fontSize: 11 }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">By Channel</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={channelBreakdown}
                cx="50%" cy="50%"
                outerRadius={82}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {channelBreakdown.map((entry, i) => (
                  <Cell key={entry.name} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, 'Share']} contentStyle={{ border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgb(0 0 0 / 0.1)', fontSize: 11 }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">AI Assist Rate</h2>
          <div className="space-y-4">
            {agentPerformance.map(agent => (
              <div key={agent.name}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Avatar name={agent.name} size="xs" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 truncate">{agent.name.split(' ')[0]}</span>
                      <span className="text-xs font-bold text-slate-800 tabular-nums">{agent.aiAssist}%</span>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-400 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${agent.aiAssist}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Agent table ── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <h2 className="text-sm font-bold text-slate-900">Agent Performance</h2>
          <p className="text-xs text-slate-400 mt-0.5">This period</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                {['Agent', 'Resolved', 'Avg Handle Time', 'CSAT', 'AI Assist %'].map(h => (
                  <th key={h} className="px-5 py-3 text-left table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/80">
              {agentPerformance.map(agent => (
                <tr key={agent.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={agent.name} size="sm" />
                      <span className="text-sm font-semibold text-slate-900">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">{agent.resolved}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 tabular-nums">{agent.avgTime}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">{agent.satisfaction}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            'h-full rounded-full',
                            agent.satisfaction >= 95 ? 'bg-emerald-500' :
                            agent.satisfaction >= 88 ? 'bg-amber-500'   : 'bg-red-400'
                          )}
                          style={{ width: `${agent.satisfaction}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="badge bg-brand-50 text-brand-700 tabular-nums">{agent.aiAssist}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
