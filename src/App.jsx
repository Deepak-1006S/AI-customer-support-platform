import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'
import { ThemeProvider } from '../context/ThemeContext'
import AppLayout from '../layout/AppLayout'
import Dashboard from '../pages/Dashboard'
import Tickets from '../pages/Tickets'
import TicketDetail from '../pages/TicketDetail'
import LiveChat from '../pages/LiveChat'
import Analytics from '../pages/Analytics'
import Knowledge from '../pages/Knowledge'
import Settings from '../pages/Settings'
import Customers from '../pages/Customers'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="tickets/:id" element={<TicketDetail />} />
              <Route path="live-chat" element={<LiveChat />} />
              <Route path="customers" element={<Customers />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="knowledge" element={<Knowledge />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
