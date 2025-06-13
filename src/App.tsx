import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { WaxPassProvider } from '@/lib/WaxPassContext';
import WaxPassCalculator from "./pages/WaxPassCalculator";

function App() {
  return (
    <WaxPassProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            <Route path="/" element={<WaxPassCalculator />} />
            <Route path="*" element={<WaxPassCalculator />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </WaxPassProvider>
  );
}

export default App;
