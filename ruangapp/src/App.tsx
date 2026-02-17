import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AdminRuangan from './pages/AdminRuangan';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import UserBorrowing from './pages/UserBorrowing';
import AdminBorrowing from './pages/AdminBorrowing';
import UserCariRuangan from './pages/UserCariRuangan';

function AppRoutes() {
  const { user, isLoading } = useAuth();

  // Tunggu sampai loading selesai
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Redirect home ke dashboard yang sesuai
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const isAdmin = user.role.toLowerCase() === "admin";

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirect root ke dashboard yang sesuai */}
      <Route
        path="/"
        element={<Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />}
      />

      {/* User Routes */}
      <Route
        path="/user/dashboard"
        element={
          <RoleBasedRoute>
            <UserLayout>
              <UserDashboard />
            </UserLayout>
          </RoleBasedRoute>
        }
      />

      <Route
        path="/user/borrowings"
        element={
          <RoleBasedRoute>
            <UserLayout>
              <UserBorrowing />
            </UserLayout>
          </RoleBasedRoute>
        }
      />

      <Route
        path="/user/findrooms"
        element={
          <RoleBasedRoute>
            <UserLayout>
              <UserCariRuangan />
            </UserLayout>
          </RoleBasedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleBasedRoute requiredRole="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </RoleBasedRoute>
        }
      />

      <Route
        path="/admin/borrowings"
        element={
          <RoleBasedRoute requiredRole="admin">
            <AdminLayout>
              <AdminBorrowing />
            </AdminLayout>
          </RoleBasedRoute>
        }
      />

      <Route
        path="/admin/rooms"
        element={
          <RoleBasedRoute requiredRole="admin">
            <AdminLayout>
              <AdminRuangan />
            </AdminLayout>
          </RoleBasedRoute>
        }
      />

    </Routes>
    
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

