// Minimax values
const scores = {
  X: 10,
  O: -10,
  tie: 0,
};
export function minimax(board, depth, isMaximizing) {
  let result = checkWinner(board);
  let bestScore = isMaximizing ? -Infinity : Infinity;

  // Stop recursive calls if winner or game end
  if (Number.isInteger(result)) {
    // Return game status
    return result;
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Check if tile is empty
      if (board[i][j] === null) {
        board[i][j] = isMaximizing ? "O" : "X";
        // Recursive call, see all posible combinations
        const score = minimax(board, depth + 1, !isMaximizing);
        // Clear last board conbination
        board[i][j] = null;
        // Update best score, depending if is maximizing or minimizing
        bestScore = isMaximizing
          ? Math.max(score, bestScore)
          : Math.min(score, bestScore);
      }
    }
  }
  // Return best score
  return bestScore;
}

export function checkWinner(board) {
  let result = null;
  let emptyTile;

  for (let i = 0; i < 3; i++) {
    // Check horizontal
    if (
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2] &&
      board[i][0] !== null
    ) {
      result = scores[board[i][0]];
      break;
      // Check vertical
    } else if (
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i] &&
      board[0][i] !== null
    ) {
      result = scores[board[0][i]];
      break;
    }
    // Check if game is tie
    if (board[i].some((b) => b === null)) {
      emptyTile = true;
    }
  }
  // Check diagonal
  if (
    ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
      (board[2][0] === board[1][1] && board[1][1] === board[0][2])) &&
    board[1][1] !== null
  ) {
    result = scores[board[1][1]];
  }

  if (!emptyTile && !result) {
    result = scores.tie;
  }

  return Number.isInteger(result) ? result : null;
}
