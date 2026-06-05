import { createContext, useContext, useState, useCallback } from 'react'
import { mockTickets } from '../mock-data/tickets'
import { mockCustomers } from '../mock-data/customers'
import { mockChats } from '../mock-data/chat'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [tickets, setTickets] = useState(mockTickets)
  const [customers] = useState(mockCustomers)
  const [chats, setChats] = useState(mockChats)
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'urgent', text: 'TKT-1007 needs immediate attention', time: '2m ago', read: false },
    { id: 'n2', type: 'ai', text: 'AI resolved 3 tickets automatically', time: '15m ago', read: false },
    { id: 'n3', type: 'sla', text: 'TKT-1003 SLA breach in 2 hours', time: '30m ago', read: false },
    { id: 'n4', type: 'info', text: 'Weekly analytics report ready', time: '1h ago', read: true },
  ])

  const updateTicketStatus = useCallback((id, status) => {
    setTickets(prev =>
      prev.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)
    )
  }, [])

  const assignTicket = useCallback((id, agentId, agentName) => {
    setTickets(prev =>
      prev.map(t => t.id === id ? { ...t, assignee: { id: agentId, name: agentName, avatar: null }, updatedAt: new Date().toISOString() } : t)
    )
  }, [])

  const addMessage = useCallback((ticketId, message) => {
    setTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? { ...t, messages: [...t.messages, { id: `m${Date.now()}`, ...message, createdAt: new Date().toISOString() }], updatedAt: new Date().toISOString() }
          : t
      )
    )
  }, [])

  const sendChatMessage = useCallback((chatId, content, role = 'agent') => {
    const newMsg = { id: `m${Date.now()}`, role, content, createdAt: new Date().toISOString() }
    setChats(prev =>
      prev.map(c =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: content, unread: 0 }
          : c
      )
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AppContext.Provider value={{
      tickets, customers, chats, notifications, unreadCount,
      updateTicketStatus, assignTicket, addMessage,
      sendChatMessage, markAllNotificationsRead,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
