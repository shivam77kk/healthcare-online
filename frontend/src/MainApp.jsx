import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import Guards
import { AdminRoute, PatientRoute, PublicRoute, RoleBasedRedirect } from './guards/ProtectedRoute';

// Import Components
import Login from './components/auth/Login';
import PatientDashboard from './components/patient/PatientDashboard';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-red-500 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const Loading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Placeholder components
const AdminDashboard = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">Admin features coming soon...</p>
    </div>
  </div>
);

const PatientRegister = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900">Patient Registration</h1>
      <p className="text-gray-600 mt-2">Registration form coming soon...</p>
      <a 
        href="/login" 
        className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Back to Login
      </a>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-gray-600 mt-2">Page not found</p>
      <a 
        href="/" 
        className="inline-block mt-4 text-blue-600 hover:text-blue-500"
      >
        Go back home
      </a>
    </div>
  </div>
);

const MainApp = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <PatientRegister />
                  </PublicRoute>
                }
              />

              {/* Protected Routes - Admin */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute fallback={<Loading />}>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* Protected Routes - Patient */}
              <Route
                path="/patient/dashboard"
                element={
                  <PatientRoute fallback={<Loading />}>
                    <PatientDashboard />
                  </PatientRoute>
                }
              />

              {/* Root Route - Redirect based on authentication */}
              <Route path="/" element={<RoleBasedRedirect />} />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default MainApp;
