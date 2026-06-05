import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Ticket, MessageSquare, Users,
  BarChart3, BookOpen, Settings, Bot, ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import clsx from 'clsx'
import { useApp } from '../context/AppContext'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Tickets',   path: '/tickets',   icon: Ticket },
  { label: 'Live Chat', path: '/live-chat', icon: MessageSquare, badge: 'live' },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Knowledge', path: '/knowledge', icon: BookOpen },
]

const BOTTOM_ITEMS = [
  { label: 'Settings', path: '/settings', icon: Settings },
]

const AGENT = { name: 'Alex Rivera', role: 'Senior Agent', initials: 'AR', status: 'online' }

export default function Sidebar({ collapsed, mobileOpen, onMobileClose, onToggleCollapse }) {
  const { chats } = useApp()
  const activeChatCount = chats.filter(c => c.status === 'active').length

  const NavItem = ({ label, path, icon: Icon, badge }) => (
    <NavLink
      to={path}
      onClick={onMobileClose}
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <span
          className={clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
            'transition-all duration-150 cursor-pointer group relative',
            isActive
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
            collapsed && 'justify-center px-2'
          )}
        >
          {/* Icon wrapper */}
          <span className="relative shrink-0">
            <Icon
              className={clsx(
                'w-[18px] h-[18px] transition-colors',
                isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-700'
              )}
            />
            {badge === 'live' && activeChatCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white" />
            )}
          </span>

          {/* Label */}
          {!collapsed && (
            <span className="flex-1 truncate">{label}</span>
          )}

          {/* Live badge */}
          {badge === 'live' && activeChatCount > 0 && !collapsed && (
            <span className="ml-auto shrink-0 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeChatCount}
            </span>
          )}

          {/* Collapsed tooltip */}
          {collapsed && (
            <span className="
              pointer-events-none absolute left-full ml-2 px-2.5 py-1.5
              bg-slate-900 text-white text-xs font-medium rounded-lg whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity duration-150
              z-50 shadow-lg
            ">
              {label}
            </span>
          )}
        </span>
      )}
    </NavLink>
  )

  return (
    <aside
      className={clsx(
        /* Base */
        'flex flex-col bg-white border-r border-slate-100 h-full z-30',
        'transition-all duration-300 ease-in-out',
        /* Desktop */
        'hidden lg:flex',
        collapsed ? 'w-[68px]' : 'w-64',
        /* Mobile */
        'fixed lg:relative',
        mobileOpen ? 'flex w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* ── Logo ── */}
      <div className={clsx(
        'flex items-center h-16 border-b border-slate-100 shrink-0 px-4',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="flex items-center justify-center w-8 h-8 bg-brand-600 rounded-xl shrink-0">
          <Bot className="w-[18px] h-[18px] text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-slate-900 truncate">SupportAI</p>
            <p className="text-[11px] text-slate-400 truncate">Customer Platform</p>
          </div>
        )}
        {/* Desktop collapse toggle */}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="btn-icon text-slate-400 hover:text-slate-600 shrink-0"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="mx-auto mt-1 btn-icon text-slate-400 hover:text-slate-600"
          title="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* ── Nav ── */}
      <nav className={clsx('flex-1 py-3 space-y-0.5 overflow-y-auto', collapsed ? 'px-2' : 'px-3')}>
        {!collapsed && (
          <p className="section-label px-3 mb-2">Menu</p>
        )}
        {NAV_ITEMS.map(item => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      {/* ── Bottom ── */}
      <div className={clsx('pb-3 border-t border-slate-100 space-y-0.5 pt-3', collapsed ? 'px-2' : 'px-3')}>
        {BOTTOM_ITEMS.map(item => (
          <NavItem key={item.path} {...item} />
        ))}

        {/* Agent card */}
        <div className={clsx(
          'mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-slate-50',
          collapsed && 'justify-center px-2'
        )}>
          <div className="relative shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {AGENT.initials}
            </div>
            <span className={clsx(
              'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white',
              AGENT.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
            )} />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 truncate">{AGENT.name}</p>
              <p className="text-[11px] text-slate-400 capitalize">{AGENT.status}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
