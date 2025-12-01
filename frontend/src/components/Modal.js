import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Modal = ({ isOpen, onClose, title, children }) => {
  const { darkMode } = useTheme();
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', maxWidth: '672px', width: '100%', margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb') }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#fff' : '#111' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ color: darkMode ? '#9ca3af' : '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

