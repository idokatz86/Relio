import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { PhasesPage } from './pages/PhasesPage';
import { PipelinePage } from './pages/PipelinePage';
import { FeedbackPage } from './pages/FeedbackPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { SafetyPage } from './pages/SafetyPage';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/users', label: 'Users', icon: '👤' },
  { path: '/phases', label: 'Phases', icon: '🔄' },
  { path: '/subscriptions', label: 'Subscriptions', icon: '💳' },
  { path: '/pipeline', label: 'Pipeline', icon: '⚡' },
  { path: '/safety', label: 'Safety', icon: '🛡️' },
  { path: '/feedback', label: 'Feedback', icon: '💬' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold" style={{ color: '#6B705C' }}>Relio Admin</h1>
            <p className="text-xs text-gray-400 mt-1">Backoffice Dashboard</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Tier 3 Data Only
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/phases" element={<PhasesPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/pipeline" element={<PipelinePage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
