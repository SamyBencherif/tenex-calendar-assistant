import React from 'react'
import { CalendarProvider, useCalendar } from './context/CalendarContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CalendarGrid from './components/CalendarGrid'
import ChatAssistant from './components/ChatAssistant'
import { AnimatePresence } from 'framer-motion'

function AppContent() {
  const { isSidebarOpen } = useCalendar();
  
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Header />
      <main className="flex-1 flex overflow-hidden relative">
        <AnimatePresence mode="wait">
          {isSidebarOpen && <Sidebar />}
        </AnimatePresence>
        <CalendarGrid />
        <ChatAssistant />
      </main>
    </div>
  );
}

function App() {
  return (
    <CalendarProvider>
      <AppContent />
    </CalendarProvider>
  )
}

export default App
