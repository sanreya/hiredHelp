import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { UserLayout } from './components/layout/UserLayout';
import { TechnicianLayout } from './components/layout/TechnicianLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { ServicesPage } from './pages/user/ServicesPage';
import { CreateRequestPage } from './pages/user/CreateRequestPage';
import { MyRequestsPage } from './pages/user/MyRequestsPage';
import { RequestDetailsPage } from './pages/user/RequestDetailsPage';
import { FindTechniciansPage } from './pages/user/FindTechniciansPage';
import { CompletedJobsPage as UserCompletedJobs } from './pages/user/CompletedJobsPage';
import { ReviewTechnicianPage } from './pages/user/ReviewTechnicianPage';
import { UserProfile } from './pages/user/UserProfile';

// Technician Pages
import { TechnicianDashboard } from './pages/technician/TechnicianDashboard';
import { PendingRequestsPage } from './pages/technician/PendingRequestsPage';
import { ActiveJobsPage } from './pages/technician/ActiveJobsPage';
import { CompletedJobsPage as TechCompletedJobs } from './pages/technician/CompletedJobsPage';
import { TechnicianProfile } from './pages/technician/TechnicianProfile';
import { TechnicianSkills } from './pages/technician/TechnicianSkills';
import { ReviewsPage } from './pages/technician/ReviewsPage';

// Auth Guard Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole: 'USER' | 'TECHNICIAN' }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* User Routes */}
            <Route path="/user" element={<ProtectedRoute requiredRole="USER"><UserLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/user/dashboard" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="service-request/new" element={<CreateRequestPage />} />
              <Route path="requests" element={<MyRequestsPage />} />
              <Route path="requests/:id" element={<RequestDetailsPage />} />
              <Route path="requests/:id/technicians" element={<FindTechniciansPage />} />
              <Route path="completed" element={<UserCompletedJobs />} />
              <Route path="requests/:id/review" element={<ReviewTechnicianPage />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Technician Routes */}
            <Route path="/technician" element={<ProtectedRoute requiredRole="TECHNICIAN"><TechnicianLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/technician/dashboard" replace />} />
              <Route path="dashboard" element={<TechnicianDashboard />} />
              <Route path="requests" element={<PendingRequestsPage />} />
              <Route path="jobs/active" element={<ActiveJobsPage />} />
              <Route path="jobs/completed" element={<TechCompletedJobs />} />
              <Route path="profile" element={<TechnicianProfile />} />
              <Route path="skills" element={<TechnicianSkills />} />
              <Route path="reviews" element={<ReviewsPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
