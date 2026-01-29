import React from 'react'
import { CalendarProvider, useCalendar } from './context/CalendarContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CalendarGrid from './components/CalendarGrid'
import ChatAssistant from './components/ChatAssistant'
import { AnimatePresence, motion } from 'framer-motion'
import { LogIn } from 'lucide-react'

function AppContent() {
  const { isSidebarOpen, isAuthenticated, signIn } = useCalendar();
  
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Header />
      <main className="flex-1 flex overflow-hidden relative">
        <AnimatePresence mode="wait">
          {isSidebarOpen && <Sidebar />}
        </AnimatePresence>
        <CalendarGrid />
        <ChatAssistant />

        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900">Welcome to your Calendar</h2>
                <p className="text-gray-600">Please sign in with your Google account to view and manage your calendar events.</p>
              </div>
              <button
                onClick={signIn}
                className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Sign in with Google
              </button>
            </div>
          </motion.div>
        )}
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
