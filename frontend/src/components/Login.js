import React, { useState } from 'react';
import { login } from '../services/auth';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLoginResponse(null);

    const requestStartTime = performance.now();

    try {
      const data = await login(username, password);
      const requestEndTime = performance.now();
      const clientResponseTime = requestEndTime - requestStartTime;

      // Store response details for display
      setLoginResponse({
        token: data.token,
        serverResponseTime: data.responseTime,
        clientResponseTime: clientResponseTime.toFixed(2),
        totalResponseTime: clientResponseTime.toFixed(2),
        timestamp: data.timestamp,
        user: data.user
      });

      // Store token in localStorage for future requests
      localStorage.setItem('authToken', data.token);

      // Proceed with login after showing response details
      setTimeout(() => {
        onLogin(data.user);
      }, 3000); // Show details for 3 seconds before redirecting

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏥 Baseline Healthcare</h1>
          <p>No Security - Baseline System</p>
        </div>
        
        {loginResponse ? (
          <div className="response-details">
            <div className="alert alert-success">
              <h3>✓ Login Successful!</h3>
              <p>Redirecting to dashboard...</p>
            </div>

            <div className="response-info">
              <h4>Response Time Metrics:</h4>
              <div className="metric-row">
                <span className="metric-label">Server Response Time:</span>
                <span className="metric-value">{loginResponse.serverResponseTime} ms</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Client Response Time:</span>
                <span className="metric-value">{loginResponse.clientResponseTime} ms</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Total Response Time:</span>
                <span className="metric-value highlighted">{loginResponse.totalResponseTime} ms</span>
              </div>
            </div>

            <div className="token-display">
              <h4>JWT Token Generated:</h4>
              <div className="token-box">
                <code>{loginResponse.token}</code>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => navigator.clipboard.writeText(loginResponse.token)}
              >
                📋 Copy Token
              </button>
            </div>

            <div className="user-info-display">
              <h4>User Details:</h4>
              <div className="user-detail-item">
                <strong>Username:</strong> {loginResponse.user.username}
              </div>
              <div className="user-detail-item">
                <strong>Role:</strong> {loginResponse.user.role}
              </div>
              <div className="user-detail-item">
                <strong>Department:</strong> {loginResponse.user.department}
              </div>
              <div className="user-detail-item">
                <strong>Timestamp:</strong> {loginResponse.timestamp}
              </div>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="alert alert-error">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
              </div>

              <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="login-info">
              <h3>Demo Credentials:</h3>
              <ul>
                <li><strong>Admin:</strong> admin / admin123</li>
                <li><strong>Doctor:</strong> doctor1 / doctor123</li>
                <li><strong>Nurse:</strong> nurse1 / nurse123</li>
              </ul>
            </div>

            <div className="warning-info">
              <h4>⚠️ Warning:</h4>
              <p>This is a baseline system with NO security features. All data is accessible to everyone.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;