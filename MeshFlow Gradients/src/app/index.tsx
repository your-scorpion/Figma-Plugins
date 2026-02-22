import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

// Suppress specific React warnings from libraries
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && msg.includes('Support for defaultProps will be removed')) {
    return;
  }
  originalWarn(...args);
};

console.error = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && msg.includes("React does not recognize the 'onPressStart' prop")) {
    return;
  }
  originalError(...args);
};

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('react-page');
  const root = createRoot(container);
  root.render(<App />); 
});
