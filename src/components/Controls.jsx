import React from 'react';

export default function Controls({
  status,
  subStatus,
  timer,
  playerWins,
  aiWins,
  draws,
  winStreak,
  mode,
  difficulty,
  playerSymbol,
  onModeChange,
  onSymbolChange,
  onDifficultyChange,
  onStart,
  onUndo,
  onHint,
  onResetScores,
  soundEnabled,
  onToggleSound,
  moveHistory,
}) {
  const modes = [
    { label: '🤖 vs AI', value: 'pvc' },
    { label: '👥 vs Human', value: 'pvp' },
  ];
  const symbols = ['X', 'O'];
  const difficulties = [
    { label: '😊 Easy', value: 'easy' },
    { label: '😐 Medium', value: 'medium' },
    { label: '😈 Unbeatable', value: 'hard' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white/5 p-4 rounded-lg border border-white/5 transition hover:bg-white/10 hover:border-white/10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-white font-semibold text-lg">{status}</div>
            <div className="text-gray-400 text-sm">{subStatus}</div>
            {timer && <div className="timer mt-2 px-3 py-1 border border-cyan-400 rounded-md font-mono text-cyan-400 text-sm">{timer}</div>}
          </div>
          <div className="flex gap-2">
            <button
              title="Toggle Sound"
              className="btn-ghost rounded-full w-10 h-10 flex items-center justify-center text-xl"
              onClick={onToggleSound}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              className="btn-primary px-4 py-2 rounded-md font-semibold text-black bg-cyan-500 hover:bg-cyan-400 transition"
              onClick={onStart}
            >
              Start
            </button>
          </div>
        </div>

        <div className="flex justify-between mb-4 flex-wrap gap-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide font-medium block mb-2">Mode</label>
            <div className="flex gap-2">
              {modes.map(({ label, value }) => (
                <button
                  key={value}
                  data-mode={value}
                  onClick={() => onModeChange(value)}
                  className={`${mode === value ? 'bg-cyan-500 text-black' : 'bg-transparent border border-white/10 text-white'} rounded-md px-3 py-1 text-sm font-medium transition`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide font-medium block mb-2">Your Symbol</label>
            <div className="flex gap-2">
              {symbols.map((sym) => (
                <button
                  key={sym}
                  data-symbol={sym}
                  onClick={() => onSymbolChange(sym)}
                  className={`${playerSymbol === sym ? 'bg-cyan-500 text-black' : 'bg-transparent border border-white/10 text-white'} rounded-md px-3 py-1 text-sm font-medium transition`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-400 uppercase tracking-wide font-medium block mb-2">AI Difficulty</label>
          <div className="flex gap-2">
            {difficulties.map(({ label, value }) => (
              <button
                key={value}
                data-diff={value}
                onClick={() => onDifficultyChange(value)}
                className={`${difficulty === value ? 'bg-cyan-500 text-black' : 'bg-transparent border border-white/10 text-white'} rounded-md px-3 py-1 text-sm font-medium transition`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className="text-xs text-gray-400 uppercase tracking-wide font-medium block mb-2">Statistics</label>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-white/5 p-3 rounded-md border border-white/10 text-center hover:border-cyan-500 transition">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{playerWins}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">You</div>
          </div>
          <div className="bg-white/5 p-3 rounded-md border border-white/10 text-center hover:border-cyan-500 transition">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{aiWins}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">AI/P2</div>
          </div>
          <div className="bg-white/5 p-3 rounded-md border border-white/10 text-center hover:border-cyan-500 transition">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">{draws}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Draws</div>
          </div>
        </div>

        {winStreak ? (
          <div className="text-sm text-green-400 p-2 bg-green-900 rounded-md text-center">
            🔥 {winStreak} Win Streak!
          </div>
        ) : null}

        <div className="flex justify-end gap-3">
          <button onClick={onHint} className="btn-ghost rounded-md px-3 py-1 border border-white/10 text-white hover:bg-white/10 transition">
            💡 Hint
          </button>
          <button onClick={onUndo} className="btn-ghost rounded-md px-3 py-1 border border-white/10 text-white hover:bg-white/10 transition">
            ↶ Undo
          </button>
          <button onClick={onResetScores} className="btn-danger rounded-md px-3 py-1 bg-red-600 hover:bg-red-700 text-white transition">
            Reset Stats
          </button>
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-lg border border-white/5 max-h-36 overflow-y-auto text-xs font-mono">
        <label className="text-gray-400 uppercase tracking-wide font-medium block mb-2">Move History</label>
        {moveHistory.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No moves yet</div>
        ) : (
          moveHistory.map(({ idx, symbol, time }, i) => {
            const positions = [
              'Top-Left','Top-Center','Top-Right',
              'Mid-Left','Center','Mid-Right',
              'Bottom-Left','Bottom-Center','Bottom-Right'
            ];
            return (
              <div
                key={i}
                className="border-l-2 border-transparent hover:border-cyan-500 hover:bg-white/10 p-1 transition"
                style={{color: symbol === 'X' ? '#f59e0b' : '#8b5cf6'}}
              >
                Move {i + 1}: <strong>{symbol}</strong> → {positions[idx]} ({(time / 1000).toFixed(1)}s)
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
