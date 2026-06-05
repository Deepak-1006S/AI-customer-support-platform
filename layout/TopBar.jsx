import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Menu, Bell, Search, Sun, Moon, ChevronDown,
  X, AlertCircle, Bot, Clock, Info, LogOut,
  User, HelpCircle, Settings,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import clsx from 'clsx'

const notifIcon = {
  urgent: <AlertCircle className="w-4 h-4 text-red-500" />,
  ai:     <Bot className="w-4 h-4 text-brand-500" />,
  sla:    <Clock className="w-4 h-4 text-amber-500" />,
  info:   <Info className="w-4 h-4 text-slate-400" />,
}

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

export default function TopBar({ onMobileMenuClick }) {
  const { notifications, unreadCount, markAllNotificationsRead } = useApp()
  const { theme, toggleTheme } = useTheme()

  const [showNotifs,  setShowNotifs]  = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const notifRef   = useRef(null)
  const profileRef = useRef(null)
  const navigate   = useNavigate()

  useClickOutside(notifRef,   () => setShowNotifs(false))
  useClickOutside(profileRef, () => setShowProfile(false))

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tickets?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="flex items-center gap-3 px-5 h-[60px] bg-white border-b border-slate-100/80 shrink-0 z-10">
      {/* Mobile hamburger */}
      <button onClick={onMobileMenuClick} className="btn-icon lg:hidden">
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-sm relative">
        <Search className={clsx(
          'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
          searchFocused ? 'text-brand-500' : 'text-slate-400'
        )} />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search tickets, customers…"
          className="input pl-9 pr-8 h-9 text-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Right controls */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
        >
          {theme === 'light'
            ? <Moon className="w-[18px] h-[18px]" />
            : <Sun className="w-[18px] h-[18px]" />}
        </button>

        {/* Help */}
        <button className="btn-icon" title="Help & Documentation">
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotifs(o => !o); setShowProfile(false) }}
            className="btn-icon relative"
            aria-label={`Notifications — ${unreadCount} unread`}
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-white" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-modal z-50 animate-slide-down overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-slate-400">{unreadCount} unread</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50/80">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={clsx(
                      'flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors',
                      !n.read && 'bg-brand-50/40'
                    )}
                  >
                    <div className="mt-0.5 shrink-0">{notifIcon[n.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-slate-800 leading-snug">{n.text}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-2 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <div className="px-4 py-2.5 border-t border-slate-50">
                <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(o => !o); setShowNotifs(false) }}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              AR
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-semibold text-slate-800 leading-none">Alex Rivera</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Senior Agent</p>
            </div>
            <ChevronDown className={clsx(
              'w-3.5 h-3.5 text-slate-400 transition-transform duration-150',
              showProfile && 'rotate-180'
            )} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-modal z-50 animate-slide-down overflow-hidden">
              <div className="px-4 py-3.5 border-b border-slate-50">
                <p className="text-sm font-semibold text-slate-900">Alex Rivera</p>
                <p className="text-xs text-slate-400 mt-0.5">alex@company.io</p>
              </div>
              <div className="py-1">
                {[
                  { icon: User,        label: 'My Profile',      path: null },
                  { icon: Settings,    label: 'Settings',        path: '/settings' },
                  { icon: HelpCircle,  label: 'Help & Support',  path: null },
                ].map(({ icon: Icon, label, path }) => (
                  <button
                    key={label}
                    onClick={() => { setShowProfile(false); if (path) navigate(path) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    {label}
                  </button>
                ))}
              </div>
              <div className="py-1 border-t border-slate-50">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
