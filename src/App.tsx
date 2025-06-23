import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WaxPassCalculator from './pages/WaxPassCalculator'
import { WaxPassProvider } from './lib/WaxPassContext'
import { Toaster } from './components/ui/toaster'
import { config } from './lib/config'
import './App.css'

function App() {
  return (
    <Router>
      <WaxPassProvider>
        <div className="min-h-screen">
          {/* Mock Data Banner */}
          {config.useMockData && (
            <div className="bg-amber-500 text-amber-900 px-4 py-2 text-center text-sm font-medium">
              Demo Mode: Using sample data. For production, configure your Zenoti API key.
            </div>
          )}
          
          <Routes>
            <Route path="/" element={<WaxPassCalculator />} />
          </Routes>
          <Toaster />
        </div>
      </WaxPassProvider>
    </Router>
  )
}

export default App
