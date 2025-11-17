import React, { useState, useEffect, useRef } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import { minimax } from './utils/minimax';

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function getWinner(board) {
  for(const idxs of wins){
    const [a,b,c] = idxs;
    if(board[a] && board[a] === board[b] && board[b] === board[c]){
      return {player: board[a], indices: idxs};
    }
  }
  if(board.every(Boolean)) return {player:'draw', indices:[]};
  return null;
}

export default function App(){
  const [mode, setMode] = useState('pvc');
  const [playerSymbol, setPlayerSymbol] = useState('X');
  const [difficulty, setDifficulty] = useState('hard');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [cells, setCells] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState('X');
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const moveCount = useRef(0);

  const [scores, setScores] = useState({player: 0, ai: 0, draws: 0, winStreak: 0, currentStreak: 0});
  const [status, setStatus] = useState('Status: Ready');
  const [subStatus, setSubStatus] = useState('Choose mode and symbol, then Start');
  const [timer, setTimer] = useState('');
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  // Sound utilities
  const playBeep = (frequency, duration, type='sine') => {
    if(!soundEnabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const sounds = {
    move: () => playBeep(200, 0.1, 'sine'),
    win: () => playBeep(400, 0.2, 'square'),
    lose: () => playBeep(100, 0.3, 'sawtooth'),
    draw: () => playBeep(250, 0.15, 'triangle'),
    click: () => playBeep(300, 0.05, 'sine'),
  };

  // Game timer
  useEffect(() => {
    if(!running) {
      clearInterval(timerRef.current);
      setTimer('');
      return;
    }
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      setTimer(`⏱️ ${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [running]);

  const updateScoresDisplay = (newScores) => {
    setScores(newScores);
  };

  const updateWinStreakText = (currentStreak) => {
    if(currentStreak >= 2){
      setSubStatus(`🔥 ${currentStreak} Win Streak!`);
    } else {
      setSubStatus('');
    }
  };

  const checkAndUpdateState = (board, turn, hist) => {
    const winner = getWinner(board);
    if(winner){
      setRunning(false);
      clearInterval(timerRef.current);

      if(winner.player === 'draw'){
        setStatus('🤝 Result: Draw');
        setScores((prev) => {
          return {...prev, draws: prev.draws + 1, currentStreak: 0};
        });
        sounds.draw();
      } else {
        setStatus(`🎉 Winner: ${winner.player}`);
        if(mode === 'pvc'){
          if(winner.player === playerSymbol){
            setScores((prev) => {
              const currentStreak = prev.currentStreak + 1;
              const winStreak = Math.max(prev.winStreak, currentStreak);
              return {...prev, player: prev.player + 1, currentStreak, winStreak};
            });
            sounds.win();
            createConfetti();
          } else {
            setScores((prev) => ({...prev, ai: prev.ai + 1, currentStreak: 0}));
            sounds.lose();
          }
        } else {
          sounds.win();
          createConfetti();
        }
      }
      setSubStatus('Press Start to play again');
      return true;
    }
    setStatus(`Turn: ${turn}`);
    setSubStatus(mode === 'pvc' ? `Mode: Player vs AI (${difficulty})` : 'Mode: Player vs Player');
    return false;
  };

  const createConfetti = () => {
    const colors = ['#06b6d4','#8b5cf6','#f59e0b','#10b981','#ef4444'];
    for(let i=0; i<30; i++){
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti fixed w-2.5 h-2.5 top-[-10px] z-[100] pointer-events-none rounded-sm';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `confetti ${2 + Math.random()}s linear forwards`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
      }, i * 30);
    }
  };

  const makeMove = (idx, symbol) => {
    setCells(prev => {
      const copy = prev.slice();
      copy[idx] = symbol;
      return copy;
    });
    moveCount.current++;
    setHistory(prev => [...prev, { idx, symbol, time: Date.now() - startTimeRef.current }]);
    setCurrentTurn(symbol === 'X' ? 'O' : 'X');
    sounds.move();
  };

  const aiMoveEasy = () => {
    const empties = cells.map((v, i) => v ? null : i).filter(v => v !== null);
    if(empties.length === 0) return;
    const pick = empties[Math.floor(Math.random() * empties.length)];
    makeMove(pick, currentTurn);
  };

  const aiMoveMedium = () => {
    if(Math.random() < 0.5) aiMoveMinimax();
    else aiMoveEasy();
  };

  const aiMoveMinimax = () => {
    const best = minimax(cells.slice(), currentTurn, currentTurn);
    if(best && typeof best.idx === 'number'){
      makeMove(best.idx, currentTurn);
    }
  };

  // Handle user clicking a cell
  const onCellClick = (idx) => {
    if(!running) return;
    if(cells[idx]) return;
    if(mode === 'pvc' && currentTurn !== playerSymbol) return;

    makeMove(idx, currentTurn);
  };

  // Watch for changes in cells or currentTurn to check game state
  useEffect(() => {
    if(history.length === 0) return;

    const gameEnded = checkAndUpdateState(cells, currentTurn, history);
    if(gameEnded) return;

    // If mode pvc and AI's turn, let AI play with delay
    if(mode === 'pvc' && running && currentTurn !== playerSymbol){
      setStatus(`Turn: AI `);
      setTimeout(() => {
        if(difficulty === 'easy') aiMoveEasy();
        else if(difficulty === 'medium') aiMoveMedium();
        else aiMoveMinimax();
      }, 400);
    }
  }, [cells, currentTurn]);

  // Undo function
  const onUndo = () => {
    if(!running || history.length === 0) return;

    setHistory(prev => {
      const newHistory = prev.slice(0, -1);
      setCells(() => {
        const newCells = Array(9).fill(null);
        for(let move of newHistory){
          newCells[move.idx] = move.symbol;
        }
        moveCount.current = newHistory.length;
        return newCells;
      });
      if(newHistory.length > 0 && mode === 'pvc'){
        const last2 = newHistory.slice(0, -1);
        setCells(() => {
          const newCells2 = Array(9).fill(null);
          for(let move of last2){
            newCells2[move.idx] = move.symbol;
          }
          moveCount.current = last2.length;
          return newCells2;
        });
        setHistory(last2);
        setCurrentTurn(last2.length === 0 ? 'X' : (last2[last2.length-1].symbol === 'X' ? 'O' : 'X'));
      } else {
        setCurrentTurn(newHistory.length === 0 ? 'X' : (newHistory[newHistory.length-1].symbol === 'X' ? 'O' : 'X'));
      }

      sounds.click();
      return newHistory;
    });
  };

  // Get hint for player
  const onHint = () => {
    if(!running || mode === 'pvp' || currentTurn !== playerSymbol) return;
    const best = minimax(cells.slice(), playerSymbol, playerSymbol);
    if(best && typeof best.idx === 'number'){
      const cellEls = document.querySelectorAll('.cell');
      if(cellEls[best.idx]){
        const originalBg = cellEls[best.idx].style.background;
        cellEls[best.idx].style.background = 'rgba(16,185,129,0.2)';
        setTimeout(() => {
          cellEls[best.idx].style.background = originalBg;
        }, 1000);
        sounds.click();
      }
    }
  };

  const onResetScores = () => {
    setScores({player: 0, ai: 0, draws: 0, winStreak: 0, currentStreak: 0});
    sounds.click();
  };

  const onStart = () => {
    setCells(Array(9).fill(null));
    setCurrentTurn('X');
    setRunning(true);
    setHistory([]);
    moveCount.current = 0;
    setStatus('Turn: X');
    setSubStatus(mode === 'pvc' ? `Mode: Player vs AI (${difficulty})` : 'Mode: Player vs Player');
  };

  // Keyboard shortcuts for R (restart), U (undo), H (hint)
  useEffect(() => {
    const handler = (e) => {
      if(e.key === 'r' || e.key === 'R') onStart();
      else if(e.key === 'u' || e.key === 'U') onUndo();
      else if(e.key === 'h' || e.key === 'H') onHint();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onUndo, onHint, onStart]);

  // Sound toggle
  const onToggleSound = () => {
    setSoundEnabled(prev => !prev);
    sounds.click();
  };

  // Build move history entries formatted
  const formattedMoves = history.map(move => ({
    ...move,
    pos: [
      'Top-Left','Top-Center','Top-Right',
      'Mid-Left','Center','Mid-Right',
      'Bottom-Left','Bottom-Center','Bottom-Right'
    ][move.idx]
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#041021] to-[#071225] p-5 text-white font-sans select-none relative overflow-x-hidden">

      <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-[1fr_380px] gap-6 rounded-xl p-6 bg-gradient-to-tr from-cyan-900/10 to-purple-900/10 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-2xl bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent font-extrabold select-none flex items-center gap-2">
              ⚡ Tic Tac Toe
            </h1>
            <span className="text-xs text-gray-400">Unbeatable AI (Minimax) — Play vs Computer or vs Human</span>
          </div>

          <Board
            cells={cells}
            onCellClick={onCellClick}
            disabled={!running}
          />

          <div className="flex items-center gap-3 text-xs text-gray-400 select-none">
            <span>💡 Shortcuts:</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 font-mono">R</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 font-mono">U</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 font-mono">H</span>
            <span>Restart / Undo / Hint</span>
          </div>
        </div>

        <Controls
          status={status}
          subStatus={subStatus}
          timer={timer}
          playerWins={scores.player}
          aiWins={scores.ai}
          draws={scores.draws}
          winStreak={scores.currentStreak >= 2 ? scores.currentStreak : 0}
          mode={mode}
          difficulty={difficulty}
          playerSymbol={playerSymbol}
          onModeChange={setMode}
          onSymbolChange={setPlayerSymbol}
          onDifficultyChange={setDifficulty}
          onStart={onStart}
          onUndo={onUndo}
          onHint={onHint}
          onResetScores={onResetScores}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
          moveHistory={formattedMoves}
        />
      </div>

      {/* Background particles */}
      {/* Background particles */}
      <Particles />
      {/* Confetti animation styles in global CSS */}
      {/* Confetti animation styles in global CSS */}
    </div>
  );
}

// Particles background component for subtle animated particles
function Particles(){
  const [particles, setParticles] = React.useState([]);

  React.useEffect(() => {
    const generated = [];
    for(let i=0; i<15; i++){
      generated.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        dur: 15 + Math.random() * 10,
      });
    }
    setParticles(generated);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
      {particles.map(p => (
        <div
          key={p.id}
          className="rounded-full bg-cyan-500 opacity-30 w-1 h-1 absolute animate-float"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            bottom: 0,
          }}
        />
      ))}
    </div>
  );
}

