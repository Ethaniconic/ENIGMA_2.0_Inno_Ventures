import React from 'react';
import Signup from './pages/Signup';

// Global styles for the App (you can also move this to App.css)
const appStyles = {
  appWrapper: {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0d9488',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  mainContent: {
    flex: 1, // Pushes footer to bottom
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '12px',
    color: '#94a3b8',
    backgroundColor: '#f0fdfa'
  }
};

function App() {
  return (
    <div style={appStyles.appWrapper}>
      {/* Simple Header */}
      <nav style={appStyles.nav}>
        <div style={appStyles.logo}>
          <span role="img" aria-label="health-icon">🛡️</span> 
          CarePortal
        </div>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Support: 1-800-CARE
        </div>
      </nav>

      {/* Main Signup Component */}
      <main style={appStyles.mainContent}>
        <Signup />
      </main>

      {/* Trust & Compliance Footer */}
      <footer style={appStyles.footerText}>
        <p>Your data is encrypted and HIPAA compliant. © 2026 CarePortal Oncology Network.</p>
      </footer>
    </div>
  );
}

export default App;