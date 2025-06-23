import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WaxPassCalculator from './pages/WaxPassCalculator'
import { WaxPassProvider } from './lib/WaxPassContext'
import { Toaster } from './components/ui/toaster'
import { config } from './lib/config'
import { Info, X } from 'lucide-react'
import './App.css'

function App() {
  const [showDemoInfo, setShowDemoInfo] = useState(true)
  
  return (
    <Router>
      <WaxPassProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 bg-pattern-dots relative">
          {/* Global Floating Gradient Orbs Background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-300/10 to-cyan-300/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-300/10 to-pink-300/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* Subtle Demo Mode Indicator */}
          {config.useMockData && showDemoInfo && (
            <div className="fixed bottom-20 right-4 z-50 transition-all duration-500 ease-out transform translate-x-0 opacity-100">
              <div className="glass-premium border border-white/30 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 max-w-xs backdrop-blur-xl">
                <Info className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Demo mode with sample data</span>
                <button
                  onClick={() => setShowDemoInfo(false)}
                  className="ml-2 hover:bg-gray-200/50 rounded-full p-1 transition-colors"
                  aria-label="Close demo info"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </div>
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
