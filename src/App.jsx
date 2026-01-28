import React from 'react'
import { CalendarProvider } from './context/CalendarContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CalendarGrid from './components/CalendarGrid'
import ChatAssistant from './components/ChatAssistant'

function App() {
  return (
    <CalendarProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-white">
        <Header />
        <main className="flex-1 flex overflow-hidden">
          <Sidebar />
          <CalendarGrid />
          <ChatAssistant />
        </main>
      </div>
    </CalendarProvider>
  )
}

export default App
