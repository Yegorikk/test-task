class GameBoard {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.board = this.generateBoard();
    this.initBoard();
  }

  initBoard() {
    this.board = this.generateBoard();
    this.renderBoard();
    this.updateFoundElements(0);
  }

  generateBoard() {
    const suits = ['♠', '♥', '♦', '♣'];
    let board = [];
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push(suits[Math.floor(Math.random() * suits.length)]);
      }
      board.push(row);
    }
    return board;
  }

  renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cellElement = document.createElement('div');
        cellElement.className = 'cell';
        cellElement.textContent = this.board[i][j] !== null ? this.board[i][j] : '';
        cellElement.dataset.row = i;
        cellElement.dataset.col = j;
        cellElement.addEventListener('click', () => this.handleCellClick(i, j));
        boardElement.appendChild(cellElement);
      }
    }
  }

  handleCellClick(x, y) {
    this.selectCell(x, y);
    this.renderBoard();
  }

  isValidCell(x, y) {
    return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
  }

  findConnectedGroup(x, y, element, visited) {
    let stack = [[x, y]];
    let connectedGroup = [];

    const directions = [
      [1, 0], [-1, 0],
      [0, 1], [0, -1]
    ];

    while (stack.length > 0) {
      const [currentX, currentY] = stack.pop();

      if (!this.isValidCell(currentX, currentY) || visited[currentX][currentY]) {
        continue;
      }

      if (this.board[currentX][currentY] !== element) {
        continue;
      }

      visited[currentX][currentY] = true;
      connectedGroup.push([currentX, currentY]);

      for (let [dx, dy] of directions) {
        stack.push([currentX + dx, currentY + dy]);
      }
    }

    return connectedGroup;
  }

  removeGroup(group) {
    group.forEach(([x, y]) => {
      this.board[x][y] = null;
    });
  }

  selectCell(x, y) {
    const element = this.board[x][y];

    if (!element) {
      return;
    }

    let visited = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));
    let connectedGroup = this.findConnectedGroup(x, y, element, visited);

    if (connectedGroup.length >= 1) {
      this.removeGroup(connectedGroup);
      this.updateFoundElements(connectedGroup.length);
    } 
  }

  updateFoundElements(count) {
    const foundElementsElement = document.getElementById('foundElements');
    foundElementsElement.textContent = `Elements Found: ${count}`;
  }
}

const game = new GameBoard(7, 6);
function handleRestart() {
  game.initBoard();
}