import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Search from "./pages/Search";
import MyGarden from "./pages/MyGarden";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFeedback from "./pages/AdminFeedback";
import AdminReminders from "./pages/AdminReminders";
import AdminUsers from "./pages/AdminUsers";
import Feedback from "./pages/Feedback";
import Reminders from "./pages/Reminders";
import PlantDetails from "./pages/PlantDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/search" element={<Search />} />
            <Route path="/plants/:id" element={<PlantDetails />} />
            <Route
              path="/my-garden"
              element={
                <ProtectedRoute requireUser>
                  <MyGarden />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute requireUser>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <ProtectedRoute requireUser>
                  <Reminders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminFeedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reminders"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminReminders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
