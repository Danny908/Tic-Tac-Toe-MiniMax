import React, { useState, useEffect } from "react";
import "./App.scss";
import { minimax, checkWinner } from "./minimax.js";

function App() {
  // Create board
  const [board, setBoard] = useState(
    new Array(3).fill().map(() => new Array(3).fill(null))
  );
  const [winner, setWinner] = useState(null);
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [tile, setTile] = useState(null);
  let canvasRef;

  // Draw board on canvas
  const draw = () => {
    const ctx = canvasRef.getContext("2d");
    const { width: size } = canvasRef;
    const tile = size / 3;
    let centerX;
    let centerY;

    // Clean board on every draw update
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i <= 2; i++) {
      // Draw horizontal lines
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(0, tile * i + 1);
      ctx.lineTo(size, tile * i + 1);
      ctx.stroke();
      // Draw vertical lines
      ctx.moveTo(tile * i + 1, 0);
      ctx.lineTo(tile * i + 1, size);
      ctx.stroke();
      // Draw board state
      for (let j = 0; j <= 2; j++) {
        centerX = tile * (j + 1) - tile / 2;
        centerY = tile * (i + 1) - tile / 2;
        if (board[i][j] === "X") {
          cross(ctx, centerX, centerY, 50);
        } else if (board[i][j] === "O") {
          circle(ctx, centerX, centerY, 50);
        }
      }
    }
    setTile(size / 3);
  };

  const circle = (ctx, x, y, r) => {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const cross = (ctx, x, y, offset) => {
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(x - offset, y - offset);
    ctx.lineTo(x + offset, y + offset);
    ctx.stroke();
    ctx.moveTo(x + offset, y - offset);
    ctx.lineTo(x - offset, y + offset);
    ctx.stroke();
  };

  const playerTurn = (e) => {
    // Deep array copy - New array instance
    const _board = board.map((bx) => bx.map((by) => by));
    const position = canvasRef.getBoundingClientRect();
    const i = Math.floor((e.clientX - position.x) / tile);
    const j = Math.floor((e.clientY - position.y) / tile);

    if (!_board[j][i]) {
      _board[j][i] = "O";
      setPlayerTurn(!isPlayerTurn);
      setBoard(_board);
      setWinner(checkWinner(_board));
    }
  };

  const aiTurn = () => {
    // Deep array copy - New array instance
    const _board = board.map((bx) => bx.map((by) => by));
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!_board[i][j]) {
          _board[i][j] = "X";
          const score = minimax(_board, 0, false);
          _board[i][j] = null;
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    // Set AI move
    if (move) {
      _board[move.i][move.j] = "X";
      setPlayerTurn(!isPlayerTurn);
      setBoard(_board);
      setWinner(checkWinner(_board));
    }
  };

  // Make AI Movement && Update Canvas Every Time Board Change
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      aiTurn();
    }
    draw();
  });

  return (
    <div className="App">
      <h1>
        {winner === null
          ? "Game on Course!"
          : winner === 0
          ? "Game Tie!"
          : winner === 10
          ? "AI Win!"
          : "Player Win!"}
      </h1>
      <canvas
        ref={(ref) => (canvasRef = ref)}
        onMouseUp={(e) => isPlayerTurn && winner === null && playerTurn(e)}
        width="500px"
        height="500px"
      ></canvas>
      <a
        href="https://github.com/Danny908/Tic-Tac-Toe-MiniMax"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg height="60" viewBox="0 0 16 16" width="60">
          <path
            fill="#ffffff"
            d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
          ></path>
        </svg>
      </a>
    </div>
  );
}

export default App;
