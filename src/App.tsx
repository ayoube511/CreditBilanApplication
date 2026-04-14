import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Applications from "@/pages/Applications";
import Statistics from "@/pages/Statistics";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Layout>
          <Routes>
            <Route path={ROUTE_PATHS.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTE_PATHS.APPLICATIONS} element={<Applications />} />
            <Route path={ROUTE_PATHS.STATISTICS} element={<Statistics />} />
            <Route path={ROUTE_PATHS.SETTINGS} element={<Settings />} />
          </Routes>
        </Layout>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;