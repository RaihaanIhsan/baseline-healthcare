import React, { useState, useEffect } from 'react';
import { getPatients } from '../services/api';
import { getAppointments } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    scheduledAppointments: 0,
    departments: []
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [patientsData, appointmentsData] = await Promise.all([
        getPatients(),
        getAppointments()
      ]);

      const patients = patientsData.patients || [];
      const appointments = appointmentsData.appointments || [];

      // Calculate stats
      const scheduledCount = appointments.filter(a => a.status === 'Scheduled').length;
      const departmentSet = new Set(patients.map(p => p.department));

      setStats({
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        scheduledAppointments: scheduledCount,
        departments: Array.from(departmentSet)
      });

      // Get recent appointments
      const recent = appointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentActivity(recent);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, {user.username}! Here's your healthcare system overview.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.scheduledAppointments}</h3>
            <p>Scheduled Appointments</p>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{stats.departments.length}</h3>
            <p>Active Departments</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h3>Recent Appointments</h3>
          {recentActivity.length === 0 ? (
            <p className="no-data">No recent appointments</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.doctorName}</td>
                    <td>{appointment.department}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3>User Information</h3>
          <div className="user-details">
            <div className="detail-row">
              <span className="detail-label">Username:</span>
              <span className="detail-value">{user.username}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{user.role}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Department:</span>
              <span className="detail-value">{user.department}</span>
            </div>
          </div>
        </div>

        <div className="card alert-info">
          <h3>⚠️ Security Notice</h3>
          <p>This is a baseline system with no security features:</p>
          <ul>
            <li>No authentication required for API access</li>
            <li>All patient data is accessible to everyone</li>
            <li>No encryption or data protection</li>
            <li>No audit logging or access control</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;