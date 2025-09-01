// SECURITY TESTING COMPONENT - FOR EDUCATIONAL/TESTING PURPOSES ONLY
// This component contains intentional security anti-patterns for testing security tools
// DO NOT USE IN PRODUCTION

import React, { useState, useEffect } from 'react';

const MockVulnerableComponent = () => {
  const [userInput, setUserInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [debugMode, setDebugMode] = useState(false);

  // Hard kill-switch: only render when explicitly enabled
  const sandboxEnabled =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENABLE_SECURITY_SANDBOX) ||
    process.env.REACT_APP_ENABLE_SECURITY_SANDBOX ||
    process.env.NEXT_PUBLIC_ENABLE_SECURITY_SANDBOX;
  if (process.env.NODE_ENV === 'production' && sandboxEnabled !== 'true') {
    console.warn('Security sandbox disabled. Not rendering.'); // eslint-disable-line no-console
    return null;
  }

  // …rest of component logic…
};
  // Mock vulnerability 1: XSS via dangerouslySetInnerHTML
  // This simulates a common XSS vulnerability where user input is rendered without sanitization
  const renderUserContent = (content) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  // Mock vulnerability 2: Unsafe URL construction for testing
  const handleSearch = (query) => {
    // This simulates unsafe URL construction that could lead to injection
    const searchUrl = `https://api.example.com/search?q=${query}&debug=${debugMode}`;
    
    // Mock API call (not actually executed)
    console.log('Mock API call to:', searchUrl);
    
    // Simulate search results
    setSearchResults([
      { id: 1, title: `Results for: ${query}`, content: query },
      { id: 2, title: 'Sample Result', content: 'Test content' }
    ]);
  };

  // Mock vulnerability 3: Sensitive information in debug mode
  useEffect(() => {
    if (debugMode && process.env.NODE_ENV !== 'production') {
      // This simulates exposing sensitive information in debug mode
      // eslint-disable-next-line no-console
      console.log('DEBUG MODE: Mock API Key: TEST-API-KEY-EXAMPLE-12345'); // gitleaks:allow
      // eslint-disable-next-line no-console
      console.log('DEBUG MODE: Mock User Session:', { userId: 'test-user', role: 'admin' });
    }
  }, [debugMode]);

  return (
    <div style={{ padding: '20px', border: '2px dashed red', margin: '20px' }}>
      <h3>🔒 Security Testing Component</h3>
      <p style={{ color: 'red', fontWeight: 'bold' }}>
        WARNING: This component contains intentional vulnerabilities for security testing only!
      </p>
      
      <div>
        <label>
          Debug Mode:
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
          />
        </label>
      </div>

      <div>
        <h4>Search Feature (Mock XSS Test)</h4>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter search query (try: &lt;img src=x onerror=alert('XSS')&gt;)"
        />
        <button onClick={() => handleSearch(userInput)}>
          Search
        </button>
      </div>

      <div>
        <h4>Search Results:</h4>
        {searchResults.map(result => (
          <div key={result.id} style={{ border: '1px solid #ccc', margin: '5px', padding: '10px' }}>
            <h5>{result.title}</h5>
            {/* Intentional XSS vulnerability for testing */}
            {renderUserContent(result.content)}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>This component demonstrates:</p>
        <ul>
          <li>XSS via dangerouslySetInnerHTML without sanitization</li>
          <li>Information disclosure in debug mode</li>
          <li>Unsafe URL construction patterns</li>
        </ul>
      </div>
    </div>
  );
};

export default MockVulnerableComponent;