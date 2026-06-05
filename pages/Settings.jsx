import { useState } from 'react'
import {
  Bot, Bell, Shield, Users, Palette,
  Save, Clock, ChevronRight,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Avatar from '../components/Avatar'
import clsx from 'clsx'

const SECTIONS = [
  { id: 'ai',            label: 'AI Configuration', icon: Bot },
  { id: 'notifications', label: 'Notifications',    icon: Bell },
  { id: 'sla',           label: 'SLA & Routing',    icon: Clock },
  { id: 'team',          label: 'Team & Agents',    icon: Users },
  { id: 'security',      label: 'Security',         icon: Shield },
  { id: 'appearance',    label: 'Appearance',       icon: Palette },
]

/* ── Reusable toggle switch ── */
function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={clsx(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full',
        'transition-colors duration-200 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        checked ? 'bg-brand-600' : 'bg-slate-200'
      )}
    >
      <span
        className={clsx(
          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm',
          'transition-transform duration-200 ease-in-out mt-0.5',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}

/* ── Setting row ── */
function SettingRow({ label, description, children, divider = true }) {
  return (
    <div className={clsx('flex items-center justify-between py-4 gap-6', divider && 'border-b border-slate-50 last:border-0')}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

/* ── Section heading ── */
function SectionHead({ title, subtitle }) {
  return (
    <div className="mb-6 pb-4 border-b border-slate-100">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  )
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('ai')
  const [saveState,     setSaveState]     = useState('idle') // idle | saving | saved

  /* AI */
  const [aiEnabled,            setAiEnabled]            = useState(true)
  const [aiAutoResolve,        setAiAutoResolve]        = useState(true)
  const [aiSuggestions,        setAiSuggestions]        = useState(true)
  const [aiDrafts,             setAiDrafts]             = useState(true)
  const [aiConfidence,         setAiConfidence]         = useState(85)
  const [aiModel,              setAiModel]              = useState('gpt-4o')

  /* Notifications */
  const [emailNotifs,  setEmailNotifs]  = useState(true)
  const [urgentAlerts, setUrgentAlerts] = useState(true)
  const [slaAlerts,    setSlaAlerts]    = useState(true)
  const [dailyDigest,  setDailyDigest]  = useState(false)
  const [slackNotifs,  setSlackNotifs]  = useState(false)

  /* SLA */
  const [urgentSla, setUrgentSla] = useState(4)
  const [highSla,   setHighSla]   = useState(8)
  const [mediumSla, setMediumSla] = useState(24)
  const [lowSla,    setLowSla]    = useState(72)

  function handleSave() {
    setSaveState('saving')
    setTimeout(() => {
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2500)
    }, 600)
  }

  const renderSection = () => {
    switch (activeSection) {

      case 'ai': return (
        <div>
          <SectionHead
            title="AI Configuration"
            subtitle="Control how SupportAI assists your team and handles customer interactions."
          />
          <SettingRow label="Enable AI Assistant" description="Master switch — disabling this turns off all AI features platform-wide.">
            <ToggleSwitch checked={aiEnabled} onChange={setAiEnabled} />
          </SettingRow>
          <SettingRow label="AI Model" description="The language model powering AI responses and suggestions.">
            <select
              value={aiModel}
              onChange={e => setAiModel(e.target.value)}
              className="input h-8 text-xs w-40"
              disabled={!aiEnabled}
            >
              <option value="gpt-4o">GPT-4o (Recommended)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="claude-3-5">Claude 3.5 Sonnet</option>
              <option value="gpt-3.5">GPT-3.5 Turbo (Fast)</option>
            </select>
          </SettingRow>
          <SettingRow label="Auto-Resolve Tickets" description="Allow AI to fully close tickets when confidence exceeds the threshold below.">
            <ToggleSwitch checked={aiAutoResolve} onChange={setAiAutoResolve} disabled={!aiEnabled} />
          </SettingRow>
          <SettingRow label="Agent AI Suggestions" description="Show suggested replies and actions to agents while they work.">
            <ToggleSwitch checked={aiSuggestions} onChange={setAiSuggestions} disabled={!aiEnabled} />
          </SettingRow>
          <SettingRow label="Auto-Draft Replies" description="AI pre-fills the reply box with a draft for agents to review before sending.">
            <ToggleSwitch checked={aiDrafts} onChange={setAiDrafts} disabled={!aiEnabled} />
          </SettingRow>
          <SettingRow
            label="Confidence Threshold"
            description={`AI only acts autonomously when it is ${aiConfidence}% or more confident.`}
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50} max={99}
                value={aiConfidence}
                onChange={e => setAiConfidence(+e.target.value)}
                className="w-28 accent-brand-600 cursor-pointer"
                disabled={!aiEnabled}
              />
              <span className="text-sm font-bold text-brand-600 w-10 text-right tabular-nums">
                {aiConfidence}%
              </span>
            </div>
          </SettingRow>
        </div>
      )

      case 'notifications': return (
        <div>
          <SectionHead
            title="Notifications"
            subtitle="Choose how and when you receive alerts about platform activity."
          />
          <SettingRow label="Email Notifications" description="Receive ticket updates and assignment emails.">
            <ToggleSwitch checked={emailNotifs} onChange={setEmailNotifs} />
          </SettingRow>
          <SettingRow label="Urgent Ticket Alerts" description="Instant alert when a ticket with Urgent priority is created.">
            <ToggleSwitch checked={urgentAlerts} onChange={setUrgentAlerts} />
          </SettingRow>
          <SettingRow label="SLA Breach Warnings" description="Alert 2 hours before an SLA deadline is missed.">
            <ToggleSwitch checked={slaAlerts} onChange={setSlaAlerts} />
          </SettingRow>
          <SettingRow label="Slack Integration" description="Send notifications to a Slack channel.">
            <ToggleSwitch checked={slackNotifs} onChange={setSlackNotifs} />
          </SettingRow>
          <SettingRow label="Daily Digest" description="Receive a morning summary of yesterday's activity." divider={false}>
            <ToggleSwitch checked={dailyDigest} onChange={setDailyDigest} />
          </SettingRow>
        </div>
      )

      case 'sla': return (
        <div>
          <SectionHead
            title="SLA & Routing"
            subtitle="Define first-response time targets for each priority level."
          />
          <div className="space-y-2 mb-6">
            {[
              { label: 'Urgent',  value: urgentSla, onChange: setUrgentSla, color: 'text-red-600',    dot: 'bg-red-500' },
              { label: 'High',    value: highSla,   onChange: setHighSla,   color: 'text-orange-600', dot: 'bg-orange-500' },
              { label: 'Medium',  value: mediumSla, onChange: setMediumSla, color: 'text-yellow-600', dot: 'bg-yellow-500' },
              { label: 'Low',     value: lowSla,    onChange: setLowSla,    color: 'text-slate-500',  dot: 'bg-slate-400' },
            ].map(({ label, value, onChange, color, dot }) => (
              <div key={label} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={clsx('w-2 h-2 rounded-full', dot)} />
                    <p className="text-sm font-semibold text-slate-800">{label} Priority</p>
                  </div>
                  <p className="text-xs text-slate-500">First response within {value} hour{value !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1} max={168}
                    value={value}
                    onChange={e => onChange(Math.max(1, Math.min(168, +e.target.value)))}
                    className="input h-9 w-20 text-sm text-center font-semibold"
                  />
                  <span className={clsx('text-xs font-semibold w-8', color)}>hrs</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl">
            <p className="text-xs font-semibold text-brand-700 mb-1">Auto-routing rules</p>
            <p className="text-xs text-brand-600/80">
              Tickets are automatically assigned to the agent with the lowest current workload within the matching SLA window.
            </p>
          </div>
        </div>
      )

      case 'team': return (
        <div>
          <SectionHead
            title="Team & Agents"
            subtitle="Manage your support agents, roles, and availability."
          />
          <div className="space-y-2 mb-5">
            {[
              { name: 'Alex Rivera',  role: 'Senior Agent', status: 'online',  tickets: 14 },
              { name: 'Priya Nair',   role: 'Agent',        status: 'online',  tickets: 11 },
              { name: 'Sam Thompson', role: 'Agent',        status: 'away',    tickets: 9 },
              { name: 'Jordan Lee',   role: 'Agent',        status: 'offline', tickets: 8 },
            ].map(agent => (
              <div key={agent.name} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar name={agent.name} size="sm" />
                    <span className={clsx(
                      'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
                      agent.status === 'online' ? 'bg-emerald-500' :
                      agent.status === 'away'   ? 'bg-amber-500'   : 'bg-slate-300'
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                    <p className="text-[11px] text-slate-400">{agent.role} · {agent.tickets} tickets this week</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    'badge text-[10px]',
                    agent.status === 'online' ? 'badge-resolved' :
                    agent.status === 'away'   ? 'badge-pending'  : 'badge-closed'
                  )}>
                    {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                  </span>
                  <button className="btn-ghost text-xs py-1 px-2">Manage</button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-secondary w-full justify-center gap-2">
            <Users className="w-4 h-4" /> Invite New Agent
          </button>
        </div>
      )

      case 'security': return (
        <div>
          <SectionHead
            title="Security"
            subtitle="Authentication, access controls, and compliance settings."
          />
          <SettingRow label="Two-Factor Authentication" description="Enforce 2FA for all agents. Users will be prompted on next login.">
            <ToggleSwitch checked={true} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="Single Sign-On (SSO)" description="Enable SAML 2.0 SSO with Okta, Azure AD, or Google Workspace.">
            <button className="btn-secondary text-xs flex items-center gap-1.5">Configure <ChevronRight className="w-3 h-3" /></button>
          </SettingRow>
          <SettingRow label="Audit Logs" description="Full activity log — view logins, ticket changes, and agent actions.">
            <button className="btn-secondary text-xs flex items-center gap-1.5">View Logs <ChevronRight className="w-3 h-3" /></button>
          </SettingRow>
          <SettingRow label="IP Allowlist" description="Restrict platform access to specific IP ranges.">
            <ToggleSwitch checked={false} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="Data Retention" description="Automatically purge closed tickets after 24 months to comply with GDPR." divider={false}>
            <ToggleSwitch checked={false} onChange={() => {}} />
          </SettingRow>
        </div>
      )

      case 'appearance': return (
        <div>
          <SectionHead
            title="Appearance"
            subtitle="Customize the platform's look and feel for your team."
          />
          <SettingRow label="Brand Color" description="Used as the primary accent throughout the interface.">
            <div className="flex items-center gap-2">
              {[
                { color: '#4f46e5', label: 'Indigo' },
                { color: '#0ea5e9', label: 'Sky' },
                { color: '#10b981', label: 'Emerald' },
                { color: '#f59e0b', label: 'Amber' },
                { color: '#ec4899', label: 'Pink' },
              ].map(({ color, label }) => (
                <button
                  key={color}
                  title={label}
                  className="w-7 h-7 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform ring-offset-1 ring-1 ring-transparent hover:ring-slate-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </SettingRow>
          <SettingRow label="Compact Density" description="Reduce spacing and font sizes for higher information density.">
            <ToggleSwitch checked={false} onChange={() => {}} />
          </SettingRow>
          <SettingRow label="Interface Language" description="Language for all UI text and system messages.">
            <select className="input h-8 text-xs w-36">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </SettingRow>
          <SettingRow label="Timezone" description="Used for timestamps and SLA calculations." divider={false}>
            <select className="input h-8 text-xs w-44">
              <option>UTC</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </SettingRow>
        </div>
      )

      default: return null
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Manage platform preferences and configuration"
        actions={
          <button
            onClick={handleSave}
            className={clsx(
              'btn-primary transition-all',
              saveState === 'saved' && 'bg-emerald-600 hover:bg-emerald-700',
              saveState === 'saving' && 'opacity-75 cursor-wait'
            )}
            disabled={saveState === 'saving'}
          >
            <Save className="w-4 h-4" />
            {saveState === 'saved' ? 'Saved!' : saveState === 'saving' ? 'Saving…' : 'Save Changes'}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[224px_1fr] gap-5">
        {/* Nav */}
        <div className="card p-2 h-fit">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left',
                activeSection === id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className={clsx('w-4 h-4 shrink-0', activeSection === id ? 'text-brand-600' : 'text-slate-400')} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card p-6 animate-fade-in">
          {renderSection()}
        </div>
      </div>
    </div>
  )
}
