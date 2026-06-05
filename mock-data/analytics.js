export const weeklyTickets = [
  { day: 'Mon', open: 24, resolved: 18, aiHandled: 14 },
  { day: 'Tue', open: 31, resolved: 27, aiHandled: 19 },
  { day: 'Wed', open: 28, resolved: 25, aiHandled: 18 },
  { day: 'Thu', open: 35, resolved: 29, aiHandled: 22 },
  { day: 'Fri', open: 22, resolved: 20, aiHandled: 16 },
  { day: 'Sat', open: 10, resolved: 9, aiHandled: 8 },
  { day: 'Sun', open: 8, resolved: 7, aiHandled: 6 },
]

export const monthlyTrend = [
  { month: 'Jan', tickets: 320, satisfaction: 88 },
  { month: 'Feb', tickets: 298, satisfaction: 89 },
  { month: 'Mar', tickets: 410, satisfaction: 91 },
  { month: 'Apr', tickets: 376, satisfaction: 90 },
  { month: 'May', tickets: 442, satisfaction: 93 },
  { month: 'Jun', tickets: 158, satisfaction: 94 },
]

export const categoryBreakdown = [
  { name: 'Billing', value: 28, color: '#6366f1' },
  { name: 'Technical', value: 35, color: '#8b5cf6' },
  { name: 'Account', value: 18, color: '#06b6d4' },
  { name: 'Feature Req.', value: 10, color: '#10b981' },
  { name: 'How-to', value: 9, color: '#f59e0b' },
]

export const channelBreakdown = [
  { name: 'Email', value: 42 },
  { name: 'Live Chat', value: 35 },
  { name: 'Portal', value: 18 },
  { name: 'Phone', value: 5 },
]

export const agentPerformance = [
  { name: 'Alex Rivera', resolved: 127, avgTime: '3m 14s', satisfaction: 96, aiAssist: 78 },
  { name: 'Priya Nair', resolved: 114, avgTime: '4m 02s', satisfaction: 95, aiAssist: 82 },
  { name: 'Sam Thompson', resolved: 98, avgTime: '5m 18s', satisfaction: 92, aiAssist: 71 },
  { name: 'Jordan Lee', resolved: 89, avgTime: '4m 45s', satisfaction: 93, aiAssist: 75 },
]

export const kpiMetrics = {
  firstResponseTime: { value: '4m 32s', change: -12, trend: 'down' },
  resolutionTime: { value: '1h 47m', change: -8, trend: 'down' },
  csat: { value: 94, change: +2, trend: 'up' },
  aiResolutionRate: { value: 68, change: +5, trend: 'up' },
  ticketsPerDay: { value: 42, change: +3, trend: 'up' },
  slaCompliance: { value: 97, change: +1, trend: 'up' },
}
