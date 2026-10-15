import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { MonthProvider } from './context/MonthContext.jsx';
import { ToastProvider } from './components/common/Toast.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MonthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </MonthProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
