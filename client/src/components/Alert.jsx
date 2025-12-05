import React, { useEffect, useState } from 'react';

export function Alert({ type, message, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!visible || !message) return null;

  const bgColor = {
    success: 'bg-green-100 border-l-4 border-green-500 text-green-700',
    error: 'bg-red-100 border-l-4 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
  }[type] || 'bg-gray-100 border-l-4 border-gray-500 text-gray-700';

  const icon = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }[type] || 'ℹ';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${bgColor} max-w-md animate-pulse-in`}>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">{icon}</span>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}

export function RateLimitWarning({ secondsLeft }) {
  if (secondsLeft <= 0) return null;
  return (
    <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
      ⏱️ Можете да публикувате след {secondsLeft} секунди
    </div>
  );
}
