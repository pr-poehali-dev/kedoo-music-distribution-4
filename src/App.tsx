import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Releases from "./pages/Releases";
import CreateRelease from "./pages/CreateRelease";
import Tickets from "./pages/Tickets";
import Wallet from "./pages/Wallet";
import Trash from "./pages/Trash";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

type User = {
  id: string;
  email: string;
  username: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  theme: string;
  setTheme: (theme: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const App = () => {
  const [user, setUser] = useState<User>(null);
  const [theme, setTheme] = useState("default");

  const logout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, setUser, theme, setTheme, logout }}>
        <div data-theme={theme}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/releases" element={<Releases />} />
                <Route path="/releases/create" element={<CreateRelease />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/trash" element={<Trash />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </div>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
