import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Send, Bot, Clock, UserCheck,
  CheckCircle2, ChevronDown, Paperclip, Sparkles,
  Copy, RotateCcw, Tag, StickyNote, MessageSquare,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { useApp } from '../context/AppContext'
import { StatusBadge, PriorityBadge } from '../components/StatusBadge'
import Avatar from '../components/Avatar'
import AIInsightBanner from '../components/AIInsightBanner'
import TypingIndicator from '../components/TypingIndicator'
import clsx from 'clsx'

const AI_RESPONSES = [
  'Based on our knowledge base, this issue is typically resolved by clearing browser cache and cookies. Would you like me to send the step-by-step guide to the customer?',
  'I\'ve analyzed similar cases. This is likely related to a 3D Secure authentication failure on the card issuer side. I recommend guiding the customer to contact their bank or use an alternative payment method.',
  'I can see this customer is on the Enterprise plan with a high-priority SLA. I\'ll prepare an acknowledgment email and escalate to senior support automatically.',
  'This matches a known pattern from our infrastructure update on June 2. Engineering is working on a fix. I\'ll send the customer a proactive status update.',
]

const CHANNEL_LABELS = { email: 'Email', chat: 'Live Chat', portal: 'Portal', phone: 'Phone' }

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tickets, updateTicketStatus, addMessage } = useApp()
  const messagesEndRef = useRef(null)

  // Find ticket first before any state that depends on it
  const ticket = tickets.find(t => t.id === id)

  // All hooks must be called unconditionally
  const [reply,        setReply]        = useState('')
  const [showAiTyping, setShowAiTyping] = useState(false)
  const [activeTab,    setActiveTab]    = useState('conversation')
  const [status,       setStatus]       = useState(ticket?.status || 'open')
  const [copied,       setCopied]       = useState(false)

  // Sync status when ticket changes in context
  useEffect(() => {
    if (ticket) setStatus(ticket.status)
  }, [ticket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket?.messages, showAiTyping])

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-slate-300" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-900 mb-1">Ticket not found</p>
          <p className="text-sm text-slate-500">The ticket "{id}" doesn't exist or was deleted.</p>
        </div>
        <button onClick={() => navigate('/tickets')} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </button>
      </div>
    )
  }

  function handleStatusChange(newStatus) {
    setStatus(newStatus)
    updateTicketStatus(ticket.id, newStatus)
  }

  function handleSend(e) {
    e?.preventDefault()
    if (!reply.trim()) return
    addMessage(ticket.id, { role: 'agent', content: reply })
    setReply('')

    setShowAiTyping(true)
    setTimeout(() => {
      setShowAiTyping(false)
      addMessage(ticket.id, {
        role: 'ai',
        content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
      })
    }, 2200)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend()
  }

  function handleCopyId() {
    navigator.clipboard?.writeText(ticket.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function MessageBubble({ msg }) {
    const isAgent  = msg.role === 'agent'
    const isAI     = msg.role === 'ai'
    const isSystem = msg.role === 'system'

    if (isSystem) {
      return (
        <div className="flex justify-center">
          <span className="text-[11px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{msg.content}</span>
        </div>
      )
    }

    return (
      <div className={clsx('flex gap-3', isAgent ? 'flex-row-reverse' : 'flex-row')}>
        {/* Avatar */}
        {isAI ? (
          <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-violet-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
        ) : isAgent ? (
          <Avatar name="Alex Rivera" size="sm" className="mt-0.5" />
        ) : (
          <Avatar name={ticket.customer.name} size="sm" className="mt-0.5" />
        )}

        {/* Content */}
        <div className={clsx('max-w-[75%] flex flex-col gap-1', isAgent ? 'items-end' : 'items-start')}>
          <div className="flex items-center gap-2">
            {!isAgent && (
              <span className="text-[11px] font-semibold text-slate-500">
                {isAI ? 'SupportAI' : ticket.customer.name}
              </span>
            )}
            <span className="text-[11px] text-slate-400">
              {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className={clsx(
            'px-4 py-3 text-sm leading-relaxed',
            isAgent
              ? 'bg-brand-600 text-white rounded-2xl rounded-br-sm shadow-sm'
              : isAI
              ? 'bg-gradient-to-br from-brand-50 to-violet-50 text-slate-700 border border-brand-100/80 rounded-2xl rounded-bl-sm'
              : 'bg-white text-slate-800 border border-slate-100 shadow-card rounded-2xl rounded-bl-sm'
          )}>
            {isAI && (
              <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-brand-600">
                <Sparkles className="w-3 h-3" /> AI Suggestion
              </div>
            )}
            {msg.content}
          </div>
        </div>
      </div>
    )
  }

  const slaMinutesLeft = Math.round(
    (new Date(ticket.sla.breachAt) - new Date()) / 60000
  )
  const slaHoursLeft = Math.round(slaMinutesLeft / 60)
  const slaUrgent = slaMinutesLeft < 120 && !ticket.sla.breached

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate('/tickets')} className="btn-icon mt-1 shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-600 transition-colors"
              title="Copy ticket ID"
            >
              {ticket.id}
              <Copy className="w-3 h-3" />
              {copied && <span className="text-emerald-500 font-sans">Copied!</span>}
            </button>
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={status} />
          </div>
          <h1 className="text-lg font-bold text-slate-900">{ticket.subject}</h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative hidden sm:block">
            <select
              value={status}
              onChange={e => handleStatusChange(e.target.value)}
              className="appearance-none btn-secondary pr-8 text-xs cursor-pointer"
            >
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={() => handleStatusChange('resolved')}
            disabled={status === 'resolved' || status === 'closed'}
            className="btn-primary text-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_296px] gap-5">
        {/* Left — conversation */}
        <div className="space-y-4 min-w-0">
          {ticket.aiSuggestion && (
            <AIInsightBanner
              suggestion={ticket.aiSuggestion}
              confidence={ticket.aiConfidence}
              onApply={() => setReply(ticket.aiSuggestion)}
            />
          )}

          <div className="card overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex items-center gap-1 px-5 py-3 border-b border-slate-50 bg-slate-50/40">
              {[
                { id: 'conversation', label: 'Conversation', icon: MessageSquare },
                { id: 'notes',        label: 'Internal Notes', icon: StickyNote },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
              <div className="ml-auto text-[11px] text-slate-400">
                {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-5 min-h-[320px] max-h-[520px] overflow-y-auto">
              {activeTab === 'conversation' ? (
                <>
                  {ticket.messages.map(msg => (
                    <MessageBubble key={msg.id} msg={msg} />
                  ))}
                  {showAiTyping && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-violet-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <TypingIndicator label="AI is drafting a response…" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <StickyNote className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No internal notes yet</p>
                  <p className="text-xs text-slate-400">Notes are only visible to your team</p>
                </div>
              )}
            </div>

            {/* Reply box */}
            <div className="border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
              <form onSubmit={handleSend} className="p-4 space-y-3">
                <textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a reply… (Ctrl+Enter to send)"
                  rows={3}
                  className="input resize-none text-sm"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button type="button" className="btn-icon text-slate-400">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAiTyping(true)
                        setTimeout(() => {
                          setShowAiTyping(false)
                          setReply(AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)])
                        }, 1500)
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5" /> AI Draft
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {reply && (
                      <button
                        type="button"
                        onClick={() => setReply('')}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!reply.trim()}
                      className="btn-primary text-xs"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Reply
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right — sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="card p-4">
            <p className="section-label mb-3">Customer</p>
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={ticket.customer.name} size="lg" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{ticket.customer.name}</p>
                <p className="text-xs text-slate-500 truncate">{ticket.customer.company}</p>
              </div>
            </div>
            <div className="space-y-2 pb-4 border-b border-slate-50">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Email</span>
                <span className="text-slate-700 font-medium truncate ml-4 text-right">{ticket.customer.email}</span>
              </div>
            </div>
            <button className="btn-secondary w-full mt-3 text-xs justify-center">View Profile →</button>
          </div>

          {/* Details */}
          <div className="card p-4 space-y-3">
            <p className="section-label">Details</p>
            {[
              { label: 'Category', value: ticket.category },
              { label: 'Channel',  value: CHANNEL_LABELS[ticket.channel] || ticket.channel },
              { label: 'Created',  value: format(new Date(ticket.createdAt), 'MMM d, yyyy · HH:mm') },
              { label: 'Updated',  value: formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true }) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between text-xs gap-3">
                <span className="text-slate-400 shrink-0">{label}</span>
                <span className="text-slate-700 font-medium text-right">{value}</span>
              </div>
            ))}
          </div>

          {/* Assignee */}
          <div className="card p-4">
            <p className="section-label mb-3">Assigned To</p>
            {ticket.assignee ? (
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={ticket.assignee.name} size="sm" />
                <span className="text-sm font-semibold text-slate-900">{ticket.assignee.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-xs text-slate-400">Unassigned</span>
              </div>
            )}
            <button className="btn-secondary w-full text-xs justify-center">
              <UserCheck className="w-3.5 h-3.5" />
              {ticket.assignee ? 'Reassign' : 'Assign Agent'}
            </button>
          </div>

          {/* Tags */}
          <div className="card p-4">
            <p className="section-label mb-3">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {ticket.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-full">
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* SLA */}
          <div className={clsx(
            'card p-4',
            ticket.sla.breached ? 'border-red-200/80 bg-red-50/60' : slaUrgent ? 'border-amber-200/80 bg-amber-50/40' : ''
          )}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={clsx(
                'w-3.5 h-3.5',
                ticket.sla.breached ? 'text-red-500' : slaUrgent ? 'text-amber-500' : 'text-slate-400'
              )} />
              <p className="section-label">SLA</p>
            </div>
            <p className={clsx(
              'text-xs font-semibold',
              ticket.sla.breached ? 'text-red-700' : slaUrgent ? 'text-amber-700' : 'text-slate-600'
            )}>
              {ticket.sla.breached
                ? 'SLA Breached'
                : `Due ${formatDistanceToNow(new Date(ticket.sla.breachAt), { addSuffix: true })}`
              }
            </p>
            {!ticket.sla.breached && (
              <p className="text-[11px] text-slate-400 mt-1">
                {format(new Date(ticket.sla.breachAt), 'MMM d · HH:mm')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
