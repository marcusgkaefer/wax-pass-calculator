import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { WaxPassProvider } from '@/lib/WaxPassContext';

// New main site pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Locations from "./pages/Locations";
import FirstVisit from "./pages/FirstVisit";
import Book from '@/pages/Book';

// Existing demo pages
import Index from "./pages/Index";
import WaxPassCalculator from "./pages/WaxPassCalculator";
import TabLayout from "./pages/TabLayout";
import CardBased from "./pages/CardBased";
import MapView from "./pages/MapView";
import StepByStep from "./pages/StepByStep";
import SinglePage from "./pages/SinglePage";
import ServiceSelector from "./pages/ServiceSelector";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <WaxPassProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            {/* Main Site Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:category" element={<Services />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/first-visit" element={<FirstVisit />} />
            <Route path="/first-visit/:page" element={<FirstVisit />} />
            <Route path="/book" element={<Book />} />
            <Route path="/wax-pass-calculator" element={<WaxPassCalculator />} />
            
            {/* Demo Routes - accessible via /demo prefix */}
            <Route path="/demos" element={<Index />} />
            <Route path="/demo/tab-layout" element={<TabLayout />} />
            <Route path="/demo/card-based" element={<CardBased />} />
            <Route path="/demo/map-view" element={<MapView />} />
            <Route path="/demo/step-by-step" element={<StepByStep />} />
            <Route path="/demo/single-page" element={<SinglePage />} />
            <Route path="/demo/service-selector" element={<ServiceSelector />} />
            
            {/* Legacy Routes for backward compatibility */}
            <Route path="/tab-layout" element={<TabLayout />} />
            <Route path="/card-based" element={<CardBased />} />
            <Route path="/map-view" element={<MapView />} />
            <Route path="/step-by-step" element={<StepByStep />} />
            <Route path="/single-page" element={<SinglePage />} />
            <Route path="/service-selector" element={<ServiceSelector />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </WaxPassProvider>
  );
}

export default App;
