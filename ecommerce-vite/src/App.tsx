// src/App.tsx
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1rem' }}>
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}


export default App;