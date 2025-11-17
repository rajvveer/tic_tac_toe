export function minimax(board, player, aiPlayer) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  function getWinner(board) {
    for (const idxs of wins) {
      const [a, b, c] = idxs;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return { player: board[a], indices: idxs };
      }
    }
    if (board.every(Boolean)) return { player: 'draw', indices: [] };
    return null;
  }

  const winner = getWinner(board);
  if (winner) {
    if (winner.player === 'draw') return { score: 0 };
    if (winner.player === aiPlayer) return { score: 10 };
    return { score: -10 };
  }

  const avail = board.map((v, i) => (v ? null : i)).filter(v => v !== null);
  const moves = [];

  for (const idx of avail) {
    const copy = board.slice();
    copy[idx] = player;
    const nextPlayer = player === 'X' ? 'O' : 'X';
    const result = minimax(copy, nextPlayer, aiPlayer);
    moves.push({ idx, score: result.score });
  }

  let bestMove = null;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    for (const m of moves) {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  } else {
    let bestScore = Infinity;
    for (const m of moves) {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  }
  return bestMove || { score: 0 };
}
