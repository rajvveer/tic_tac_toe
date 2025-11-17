// src/components/Cell.jsx
import React from 'react';

export default function Cell({ value, onClick, disabled, isWinning, top, bottom, left, right }) {
  // Tailwind borders for matrix lines, plus conditional highlight
  let borderClasses = '';
  if (!top) borderClasses += ' border-t-0';
  if (!bottom) borderClasses += ' border-b-0';
  if (!left) borderClasses += ' border-l-0';
  if (!right) borderClasses += ' border-r-0';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={disabled ? null : onClick}
      className={
        `cell-base
         ${isWinning ? 'win-highlight' : ''}
         ${disabled ? 'cell-disabled' : ''}
         ${value === 'X' ? 'text-[var(--x-color)] animate-pop' : value === 'O' ? 'text-[var(--o-color)] animate-pop' : ''}
         border border-[#21294a] bg-gradient-to-br from-[#071029] to-[#101f34]
         ${borderClasses}`
      }
      style={{ minHeight: 0, minWidth: 0, aspectRatio: '1/1' }}
    >
      {value}
    </div>
  );
}
