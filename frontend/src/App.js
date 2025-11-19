import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import AppointmentManagement from './components/AppointmentManagement';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏥 Baseline Healthcare System</h1>
        <div className="user-info">
          <span>Welcome, <strong>{user.username}</strong> ({user.role})</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'patients' ? 'active' : ''} 
          onClick={() => setActiveTab('patients')}
        >
          Patients
        </button>
        <button 
          className={activeTab === 'appointments' ? 'active' : ''} 
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'patients' && <PatientManagement user={user} />}
        {activeTab === 'appointments' && <AppointmentManagement user={user} />}
      </main>
    </div>
  );
}

export default App;