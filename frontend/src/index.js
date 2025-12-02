import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress noisy ResizeObserver dev error in Chrome
const resizeObserverErr = 'ResizeObserver loop completed with undelivered notifications.';
const originalOnError = window.onerror;
window.onerror = function (msg, source, lineno, colno, error) {
  if (typeof msg === 'string' && msg.includes(resizeObserverErr)) {
    return true;
  }
  if (originalOnError) {
    return originalOnError(msg, source, lineno, colno, error);
  }
  return false;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

