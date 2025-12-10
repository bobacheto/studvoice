import React from 'react';

interface CreateFloatingButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  show?: boolean;
}

// Reusable floating action button fixed to bottom-right
export function CreateFloatingButton({ onClick, label = 'Нов запис', disabled, show = true }: CreateFloatingButtonProps) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 shadow-lg transition-colors disabled:opacity-60"
    >
      <span className="text-lg leading-none">+</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
