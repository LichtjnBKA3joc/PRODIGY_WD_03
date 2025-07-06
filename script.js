const board = document.getElementById('board');
const statusText = document.getElementById('status');
const canvas = document.getElementById('win-line');
const ctx = canvas.getContext('2d');
let currentPlayer = 'X';
let gameActive = true;
let cells = [];
let gameState = Array(9).fill("");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick, { once: true });
    cells[i] = cell;
    board.appendChild(cell);
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || gameState[index] !== "") return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (gameState.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const combo of winCombos) {
    const [a, b, c] = combo;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      highlightWinningCells(combo);
      drawWinLine(combo);
      return true;
    }
  }
  return false;
}

function highlightWinningCells(combo) {
  combo.forEach(index => {
    cells[index].classList.add('win');
  });
}

function drawWinLine(combo) {
  const positions = combo.map(index => cells[index].getBoundingClientRect());
  const start = positions[0];
  const end = positions[2];

  const x1 = start.left + start.width / 2;
  const y1 = start.top + start.height / 2;
  const x2 = end.left + end.width / 2;
  const y2 = end.top + end.height / 2;

  ctx.strokeStyle = "#0984e3";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function resetGame() {
  gameState = Array(9).fill("");
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
}

drawBoard();
