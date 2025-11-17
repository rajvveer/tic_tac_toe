// src/components/Board.jsx
import React from 'react';
import Cell from './Cell';

export default function Board({ cells, onCellClick, disabled, winningIndices = [] }) {
  // For 3x3 grid, pass which borders to omit (no border on right/last col, no bottom on last row, etc)
  return (
    <div className="w-[min(440px,90vmin)] h-[min(440px,90vmin)] grid grid-cols-3 grid-rows-3 gap-0 p-0 bg-[#071029] rounded-xl shadow-lg overflow-hidden">
      {cells.map((val, i) => (
        <Cell
          key={i}
          value={val}
          disabled={disabled || val !== null}
          onClick={() => onCellClick(i)}
          isWinning={winningIndices.includes(i)}
          top={i >= 3}
          bottom={i < 6}
          left={i % 3 !== 0}
          right={i % 3 !== 2}
        />
      ))}
    </div>
  );
}
