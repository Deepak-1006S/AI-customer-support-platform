import { useState, useRef, useEffect } from 'react'
import {
  Send, Bot, MessageSquare,
  Paperclip, MoreVertical, Users, Clock,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { useApp } from '../context/AppContext'
import Avatar from '../components/Avatar'
import TypingIndicator from '../components/TypingIndicator'
import clsx from 'clsx'

const STATUS_DOT = {
  active:  'bg-emerald-500',
  waiting: 'bg-amber-500',
  ended:   'bg-slate-300',
}

const STATUS_LABEL = {
  active:  'Active',
  waiting: 'Waiting',
  ended:   'Ended',
}

const AI_RESPONSES = [
  'I understand your concern. Let me check your account details and get back to you right away.',
  'Based on what you\'ve described, this appears to be a known issue. Our team is actively working on a fix — expected resolution within 2 hours.',
  'I\'d be happy to help! Could you share a bit more detail so I can assist you more effectively?',
  'Thank you for reaching out. I\'ve created a priority ticket for you and escalated it to our technical team. You\'ll hear back within 1 hour.',
  'Great news — I found a solution in our knowledge base. Here are the steps to resolve this quickly…',
]

export default function LiveChat() {
  const { chats, sendChatMessage } = useApp()
  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id || null)
  const [message,  setMessage]  = useState('')
  const [aiTyping, setAiTyping] = useState(false)
  const [aiMode,   setAiMode]   = useState(true)
  const messagesEndRef = useRef(null)

  const selectedChat = chats.find(c => c.id === selectedChatId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedChat?.messages?.length, aiTyping])

  function handleSend(e) {
    e?.preventDefault()
    if (!message.trim() || !selectedChatId) return
    sendChatMessage(selectedChatId, message, 'agent')
    setMessage('')

    if (aiMode && selectedChat?.status !== 'ended') {
      setAiTyping(true)
      const delay = 1500 + Math.random() * 800
      setTimeout(() => {
        setAiTyping(false)
        sendChatMessage(
          selectedChatId,
          AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
          'ai'
        )
      }, delay)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const activeCount  = chats.filter(c => c.status === 'active').length
  const waitingCount = chats.filter(c => c.status === 'waiting').length

  return (
    <div className="flex gap-5 h-[calc(100vh-132px)]">
      {/* ── Chat list ── */}
      <div className="w-[280px] shrink-0 card flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-50">
          <h2 className="text-sm font-bold text-slate-900">Live Chats</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              {activeCount} active
            </span>
            {waitingCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
                <Clock className="w-3 h-3" />
                {waitingCount} waiting
              </span>
            )}
          </div>
        </div>

        {/* Chat items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50/80">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={clsx(
                'w-full text-left px-4 py-3.5 transition-colors hover:bg-slate-50/80',
                selectedChatId === chat.id && 'bg-brand-50/60 border-l-2 border-brand-500'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <Avatar name={chat.customer.name} size="sm" />
                  <span className={clsx(
                    'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-[2px] border-white',
                    STATUS_DOT[chat.status]
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[13px] font-semibold text-slate-900 truncate">
                      {chat.customer.name}
                    </span>
                    {chat.unread > 0 && (
                      <span className="ml-1 shrink-0 min-w-[18px] h-[18px] px-1 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{chat.lastMessage}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={clsx(
                      'text-[10px] font-semibold',
                      chat.status === 'active'  ? 'text-emerald-600' :
                      chat.status === 'waiting' ? 'text-amber-600'   : 'text-slate-400'
                    )}>
                      {STATUS_LABEL[chat.status]}
                    </span>
                    {chat.aiAssisted && (
                      <span className="flex items-center gap-0.5 text-[10px] text-brand-500 font-medium">
                        <Bot className="w-2.5 h-2.5" /> AI
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 ml-auto">
                      {formatDistanceToNow(new Date(chat.startedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-50 bg-slate-50/40">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Users className="w-3.5 h-3.5" />
            <span>{chats.length} total conversations today</span>
          </div>
        </div>
      </div>

      {/* ── Chat area ── */}
      {selectedChat ? (
        <div className="flex-1 card flex flex-col overflow-hidden min-w-0">
          {/* Chat header */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-50 shrink-0">
            <div className="relative">
              <Avatar name={selectedChat.customer.name} size="md" />
              <span className={clsx(
                'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
                STATUS_DOT[selectedChat.status]
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">{selectedChat.customer.name}</p>
              <p className="text-xs text-slate-400">{selectedChat.customer.email}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* AI Toggle */}
              <button
                onClick={() => setAiMode(m => !m)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
                  aiMode
                    ? 'bg-brand-50 text-brand-700 border-brand-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                )}
              >
                <Bot className="w-3.5 h-3.5" />
                AI {aiMode ? 'On' : 'Off'}
              </button>
              <button className="btn-icon">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
            {/* Date separator */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-slate-100" />
              <span className="text-[10px] text-slate-400 font-medium">
                {format(new Date(selectedChat.startedAt), 'MMMM d, yyyy')}
              </span>
              <div className="flex-1 border-t border-slate-100" />
            </div>

            {selectedChat.messages.map(msg => {
              if (msg.role === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="text-[11px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                )
              }

              const isAgent = msg.role === 'agent'
              const isAI    = msg.role === 'ai'

              return (
                <div key={msg.id} className={clsx('flex gap-3', isAgent ? 'flex-row-reverse' : 'flex-row')}>
                  {isAI ? (
                    <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-violet-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : isAgent ? (
                    <Avatar name="Alex Rivera" size="sm" className="mt-0.5" />
                  ) : (
                    <Avatar name={selectedChat.customer.name} size="sm" className="mt-0.5" />
                  )}

                  <div className={clsx('max-w-[70%] flex flex-col gap-1', isAgent ? 'items-end' : 'items-start')}>
                    {isAI && (
                      <span className="text-[10px] text-brand-500 font-semibold flex items-center gap-0.5">
                        <Bot className="w-2.5 h-2.5" /> SupportAI
                      </span>
                    )}
                    <div className={clsx(
                      'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                      isAgent
                        ? 'bg-brand-600 text-white rounded-br-sm shadow-sm'
                        : isAI
                        ? 'bg-white text-slate-700 border border-brand-100/80 rounded-bl-sm shadow-card'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm shadow-card'
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              )
            })}

            {aiTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-violet-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <TypingIndicator label="AI is typing…" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            {selectedChat.status === 'ended' ? (
              <div className="flex items-center justify-center gap-2 py-3">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                <p className="text-sm text-slate-400 font-medium">This conversation has ended</p>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex items-end gap-2.5">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={aiMode ? 'Type a message — AI will follow up…' : 'Type a message…'}
                    rows={1}
                    className="input resize-none pr-10 text-sm"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
                  <button type="button" className="btn-icon text-slate-400">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="w-9 h-9 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 card flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Select a conversation</p>
            <p className="text-xs text-slate-400 mt-1">Choose a chat from the list to get started</p>
          </div>
        </div>
      )}
    </div>
  )
}
