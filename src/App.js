import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PujaList from './pages/Pujas/PujaList';
import PujaForm from './pages/Pujas/PujaForm';
import BookingList from './pages/Bookings/BookingList';

// Protected layout — shows sidebar, redirects to login if not admin
function Layout({ children }) {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/login" replace />;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  const { admin } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard"    element={<Layout><Dashboard /></Layout>} />
      <Route path="/pujas"        element={<Layout><PujaList /></Layout>} />
      <Route path="/pujas/new"    element={<Layout><PujaForm /></Layout>} />
      <Route path="/pujas/:id/edit" element={<Layout><PujaForm /></Layout>} />
      <Route path="/bookings"     element={<Layout><BookingList /></Layout>} />
      <Route path="*"             element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}