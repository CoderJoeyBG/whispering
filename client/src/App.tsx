import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Browse from "@/pages/browse";
import Submit from "@/pages/submit";
import WhisperThread from "@/pages/whisper-thread";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import Themes from "@/pages/themes";
import About from "@/pages/about";
import Guidelines from "@/pages/guidelines";
import Contact from "@/pages/contact";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/browse" component={Browse} />
          <Route path="/submit" component={Submit} />
          <Route path="/whisper/:id" component={WhisperThread} />
          <Route path="/themes" component={Themes} />
          <Route path="/about" component={About} />
          <Route path="/guidelines" component={Guidelines} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin/login" component={AdminLogin} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/browse" component={Browse} />
          <Route path="/submit" component={Submit} />
          <Route path="/whisper/:id" component={WhisperThread} />
          <Route path="/themes" component={Themes} />
          <Route path="/about" component={About} />
          <Route path="/guidelines" component={Guidelines} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={AdminDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-midnight text-cool-gray">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
