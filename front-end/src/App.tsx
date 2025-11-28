/* --- IMPORTS --- */
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import GuestRoute from '@/components/GuestRoute';
import RequireRole from '@/components/RequireRole';


/* --- PAGES IMPORTS --- */
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Resultados from './pages/Resultados';
import Perfil from './pages/Perfil';
import ChatCliente from './pages/ChatCliente';
import ChatSupervisor from './pages/ChatSupervisor';
import NotFound from './pages/NotFound';


/* --- CODE --- */

// Initialize React Query Client
const queryClient = new QueryClient();

// Define the main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path='/'
              element={
                <GuestRoute>
                  <Index />
                </GuestRoute>
              }
            />
            <Route
              path='/login'
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path='/register'
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path='/onboarding'
              element={
                <ProtectedRoute>
                  <RequireRole role='user' redirectTo='/chat/supervisor'>
                    <Onboarding />
                  </RequireRole>
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <RequireRole role='user' redirectTo='/chat/supervisor'>
                    <Dashboard />
                  </RequireRole>
                </ProtectedRoute>
              }
            />
            <Route
              path='/resultados'
              element={
                <ProtectedRoute>
                  <RequireRole role='user' redirectTo='/chat/supervisor'>
                    <Resultados />
                  </RequireRole>
                </ProtectedRoute>
              }
            />
            <Route
              path='/perfil'
              element={
                <ProtectedRoute>
                  <RequireRole role='user' redirectTo='/chat/supervisor'>
                    <Perfil />
                  </RequireRole>
                </ProtectedRoute>
              }
            />
            <Route
              path='/chat/cliente'
              element={
                <ProtectedRoute>
                  <RequireRole role='user' redirectTo='/chat/supervisor'>
                    <ChatCliente />
                  </RequireRole>
                </ProtectedRoute>
              }
            />
            <Route
              path='/chat/supervisor/:sessionId?'
              element={
                <ProtectedRoute>
                  <RequireRole role='supervisor'>
                    <ChatSupervisor />
                  </RequireRole>
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);


// Export the App component
export default App;
