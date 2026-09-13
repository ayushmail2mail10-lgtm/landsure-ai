import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { AIAssistantModal } from './components/assistant/AIAssistantModal';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { DocumentReview } from './pages/DocumentReview';
import { RecordSearch } from './pages/RecordSearch';
import { RecordDetails } from './pages/RecordDetails';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { DemoHub } from './pages/DemoHub';

const ProtectedLayout = ({ children }) => {
  const { user } = useAuth();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onOpenAssistant={() => setIsAssistantOpen(true)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
};

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'officer') return <Navigate to="/officer" replace />;
  return <Navigate to="/citizen" replace />;
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/citizen" element={<ProtectedLayout><CitizenDashboard /></ProtectedLayout>} />
            <Route path="/upload" element={<ProtectedLayout><CitizenDashboard /></ProtectedLayout>} />
            <Route path="/officer" element={<ProtectedLayout><OfficerDashboard /></ProtectedLayout>} />
            <Route path="/admin" element={<ProtectedLayout><AdminDashboard /></ProtectedLayout>} />
            <Route path="/review/:id" element={<ProtectedLayout><DocumentReview /></ProtectedLayout>} />
            <Route path="/search" element={<ProtectedLayout><RecordSearch /></ProtectedLayout>} />
            <Route path="/records/:id" element={<ProtectedLayout><RecordDetails /></ProtectedLayout>} />
            <Route path="/audit" element={<ProtectedLayout><AuditLogsPage /></ProtectedLayout>} />
            <Route path="/demo-hub" element={<ProtectedLayout><DemoHub /></ProtectedLayout>} />
            <Route path="/demo" element={<Navigate to="/demo-hub" replace />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
