import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MapView from "./pages/MapView";
import StepByStep from "./pages/StepByStep";
import CardBased from "./pages/CardBased";
import SinglePage from "./pages/SinglePage";
import TabLayout from "./pages/TabLayout";
import ServiceSelector from "./pages/ServiceSelector";
import WaxPassCalculator from "./pages/WaxPassCalculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/map-view" element={<MapView />} />
          <Route path="/step-by-step" element={<StepByStep />} />
          <Route path="/card-based" element={<CardBased />} />
          <Route path="/single-page" element={<SinglePage />} />
          <Route path="/tab-layout" element={<TabLayout />} />
          <Route path="/service-selector" element={<ServiceSelector />} />
          <Route path="/wax-pass-calculator" element={<WaxPassCalculator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
