// SECURITY TESTING COMPONENT - FOR EDUCATIONAL/TESTING PURPOSES ONLY
// This component contains intentional auth bypass vulnerabilities for testing security tools
// DO NOT USE IN PRODUCTION

import React, { useState, useEffect } from 'react';

const MockAuthComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [adminToken, setAdminToken] = useState('');

  // Mock vulnerability 1: Client-side authentication bypass
  const handleLogin = () => {
    // Intentionally weak authentication logic for testing
    if (username && password) {
      setIsAuthenticated(true);
      
      // Mock vulnerability 2: Role assignment based on client-side logic
      if (username.includes('admin') || password === 'admin123') {
        setUserRole('admin');
        setAdminToken('mock-admin-token-12345');
      } else {
        setUserRole('user');
      }
      
      // Store auth state in localStorage (client-side)
      localStorage.setItem('mockAuth', JSON.stringify({
        authenticated: true,
        role: userRole,
        token: adminToken
      }));
    }
  };

  // Mock vulnerability 3: Client-side role checking
  const checkAdminAccess = () => {
    // This simulates checking admin access purely on client-side
    return userRole === 'admin' || localStorage.getItem('isAdmin') === 'true';
  };

  // Mock vulnerability 4: Predictable token generation
  const generateSessionToken = () => {
    // Intentionally weak token generation for testing
    const timestamp = Date.now();
    const simpleToken = `token_${timestamp}_${username}`;
    return btoa(simpleToken); // Just base64 encoding, not secure
  };

  useEffect(() => {
    // Check if already "authenticated" from localStorage
    const storedAuth = localStorage.getItem('mockAuth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      if (authData.authenticated) {
        setIsAuthenticated(true);
        setUserRole(authData.role);
        setAdminToken(authData.token);
      }
    }
  }, []);

  const AdminPanel = () => (
    <div style={{ backgroundColor: '#ffe6e6', padding: '15px', margin: '10px 0' }}>
      <h4>🔑 Admin Panel (Mock)</h4>
      <p>Secret admin data: {adminToken}</p>
      <button onClick={() => alert('Admin action executed!')}>
        Execute Admin Action
      </button>
      <div>
        <label>
          Force Admin Mode:
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                localStorage.setItem('isAdmin', 'true');
                setUserRole('admin');
              } else {
                localStorage.removeItem('isAdmin');
                setUserRole('user');
              }
            }}
          />
        </label>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px', border: '2px dashed orange', margin: '20px' }}>
      <h3>🔓 Mock Authentication Component</h3>
      <p style={{ color: 'orange', fontWeight: 'bold' }}>
        WARNING: Contains intentional auth bypass vulnerabilities for testing!
      </p>

      {!isAuthenticated ? (
        <div>
          <h4>Login (Mock)</h4>
          <div>
            <input
              type="text"
              placeholder="Username (try: admin)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password (try: admin123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h4>Welcome, {username}!</h4>
          <p>Role: {userRole}</p>
          <p>Session Token: {generateSessionToken()}</p>
          
          {checkAdminAccess() && <AdminPanel />}
          
          <button onClick={() => {
            setIsAuthenticated(false);
            setUserRole('');
            setAdminToken('');
            localStorage.removeItem('mockAuth');
            localStorage.removeItem('isAdmin');
          }}>
            Logout
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>This component demonstrates:</p>
        <ul>
          <li>Client-side authentication bypass</li>
          <li>Insecure role assignment logic</li>
          <li>Predictable token generation</li>
          <li>Client-side authorization checks</li>
          <li>Insecure local storage usage</li>
        </ul>
      </div>
    </div>
  );
};

export default MockAuthComponent;