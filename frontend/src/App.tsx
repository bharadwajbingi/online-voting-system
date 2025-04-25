import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import AdminRegister from './pages/auth/AdminRegister';
import AdminLogin from './pages/auth/AdminLogin';
import VoterLogin from './pages/auth/VoterLogin';
import VerifyOTP from './pages/auth/VerifyOTP';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import CreateElection from './pages/admin/CreateElection';
import ElectionDetails from './pages/admin/ElectionDetails';
import ElectionGraph from './pages/admin/ElectionGraph';

// Voter Pages
import VoterDashboard from './pages/voter/Dashboard';
import FaceVerification from './pages/voter/FaceVerification';
import VoteConfirmation from './pages/voter/VoteConfirmation';
import VoterResults from './pages/voter/Results';
import VoterList from './pages/voter/VoterList';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toast />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/admin-login" replace />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/voter-login" element={<VoterLogin />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="create-election" element={<CreateElection />} />
          <Route path="election/:id" element={<ElectionDetails />} />
          <Route path="graph/:id" element={<ElectionGraph />} />
        </Route>

        {/* Voter Routes */}
        <Route path="/voter" element={<ProtectedRoute role="voter" />}>
          <Route path="dashboard" element={<VoterDashboard />} />
          <Route path="face-verification/:id" element={<FaceVerification />} />
          <Route path="vote-confirmation/:id" element={<VoteConfirmation />} />
          <Route path="results/:id" element={<VoterResults />} />
          <Route path="voter-list/:id" element={<VoterList />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;