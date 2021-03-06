var canvas = document.getElementById('board'),
  context = canvas.getContext('2d'),
  displayCanvas = document.getElementById('player'),
  ctx = displayCanvas.getContext('2d');

var board = {

  status: [],

  player1: 'rgb(255, 12, 0)',

  player2: 'rgb(255, 233, 0)',

  currentPlayer: 'rgb(255, 12, 0)',

  // Create a rectangle and fill in with an empty circle.
  drawEachRectangle: function(row, col) {
    'use strict';
    var length = 50, xpos = 50, ypos = 50, radius = 25;
    context.fillStyle = 'rgb(61, 158, 255)';
    context.fillRect(col * length + xpos, length * row + ypos, length, length);
    context.fillStyle = 'rgb(255,255,255)';
    context.beginPath();
    context.arc(radius + col * length + xpos, radius + (row * length) + ypos, radius - 5, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
  },

  getPositiveSlopeSum: function(x, y) {
    'use strict';
    var counter = '', i, j, xstart, ystart;
    if (x > y) {
      xstart = x - y;
      ystart = 0;
    } else {
      xstart = 0;
      ystart = y - x;
    }

    for (i = xstart, j = ystart; i < 6 && j < 7; i += 1, j += 1) {
      counter += this.status[j][i];
    }
    
    return counter;
  },

  getNegativeSlopeSum: function(x, y) {
    'use strict';
    var counter = '', i, j, xstart, ystart;
    if (x + y < 6) {
      xstart = x + y;
      ystart = 0;
    } else {
      xstart = 6;
      ystart = x + y - 6;
    }

    for (i = xstart, j = ystart; i >= 0 && j < 6; i -= 1, j += 1) {
      counter += this.status[i][j];
    }

    return counter;
  },

  checkWin: function(y, x) {
    'use strict';
    var i, j;
    // Check Rows - Can be optimized to just check on the row that the move was made
    var counter = '';
    for (i = 0; i < 6; i += 1) {
      for (j = 0; j < 7; j += 1) {
        counter += this.status[j][i];
      }
      if (counter.indexOf('RRRR') !== -1 || counter.indexOf('YYYY') !== -1) {
        if (counter.indexOf('RRRR') !== -1) {
            alert("Player Red won with 4 in a row. Please refresh the page to start a new game");
        } else {
            alert("Player Yellow won with 4 in a row. Please refresh the page to start a new game");
        }
        return;
      }
      counter = '';
    }

    // Check columns - Can be optimized to just check on the column that the move was made
    for (j = 0; j < 7; j += 1) {
      for (i = 0; i < 6; i += 1) {
        counter += this.status[j][i];
      }
      if (counter.indexOf('RRRR') !== -1 || counter.indexOf('YYYY') !== -1) {
          if (counter.indexOf('RRRR') !== -1) {
              alert("Player Red won with 4 in a column. Please refresh the page to start a new game");
          } else {
              alert("Player Yellow won with 4 in a column. Please refresh the page to start a new game");
          }
        return;
      }
      counter = '';
    }

    // Check diagonals - positive slope values
    counter = this.getPositiveSlopeSum(x, y);
    if (counter.indexOf('RRRR') !== -1 || counter.indexOf('YYYY') !== -1) {
        if (counter.indexOf('RRRR') !== -1) {
            alert("Player Red won with 4 in a diagonal. Please refresh the page to start a new game");
        } else {
            alert("Player Yellow won with 4 in a diagonal. Please refresh the page to start a new game");
        }
        return;
    }

    // Check diagonals - negative slope values
    counter = this.getNegativeSlopeSum(x, y);
    if (counter.indexOf('RRRR') !== -1 || counter.indexOf('YYYY') !== -1) {
        if (counter.indexOf('RRRR') !== -1) {
            alert("Player Red won with 4 in a diagonal. Please refresh the page to start a new game");
        } else {
            alert("Player Yellow won with 4 in a diagonal. Please refresh the page to start a new game");
        }
    }

  },

  clearAll: function () {
    'use strict';
    context.fillStyle = 'rgb(255, 255, 255)';
    context.fillRect(0, 0, 500, 50);
  },

  // Create an arrow on top of the column where the user is hovering.
  createArrow: function(event) {
    'use strict';

    var xpos = event.offsetX,
      length = 50, column;

    column = parseInt(xpos/50);
    column = (column <= 7 && column > 0) ? column : ((column === 0) ? 1 : 7);

    this.clearAll();

    context.fillStyle = this.currentPlayer;
    context.beginPath();
    context.moveTo(75 + (column - 1) * length, 50);
    context.lineTo(100 + (column - 1) * length, 25);
    context.lineTo(50 + (column - 1) * length, 25);
    context.closePath();
    context.fill();

  },

  getNextAvailableCell: function(column) {
    'use strict';
    for (var i = 5; i >= 0; i -= 1) {
      if (this.status[column-1][i] === 0) {
        return i;
      }
    }
  },

  thisPlay: function() {
    'use strict';
      ctx.fillStyle = this.currentPlayer;
      ctx.beginPath();
      ctx.arc(100, 100, 45, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
  },

  // Drop the disc into the column if the user clicks on the column.
  dropDisc: function(event) {
    'use strict';
    var xpos = event.offsetX,
      column, availableCell, radius = 25, length = 50, color;

    if (this.currentPlayer === this.player1) {
      color = 'R';
    } else {
      color = 'Y';
    }

    column = parseInt(xpos/50);
    availableCell = this.getNextAvailableCell(column);

    this.status[column-1][availableCell] = color;

    if (typeof availableCell !== 'undefined') {
      context.fillStyle = this.currentPlayer;
      context.beginPath();
      context.arc(radius + (column - 1) * length + 50, radius + (availableCell * length) + 50, radius - 5, 0, Math.PI * 2, false);
      context.closePath();
      context.fill();

      this.clearAll();
      this.currentPlayer = (this.currentPlayer === this.player1) ? this.player2 : this.player1;
      this.thisPlay();
      this.createArrow(event);
    } else {
      alert('Please choose another column');
    }

    this.checkWin(column-1, availableCell);
  },

  initGrid: function() {
    'use strict';
    var row, col;

    this.status = [];

    for (col = 0; col < 7; col += 1) {
      this.status[col] = [0, 0, 0, 0, 0, 0];
    }

    this.thisPlay();

    canvas.addEventListener('mousemove', function(event) {
      board.createArrow(event);
    });

    canvas.addEventListener('click', function(event) {
      board.dropDisc(event);
    });

    for (row = 0; row < 6; row += 1) {
      for (col = 0; col < 7; col += 1) {
        this.drawEachRectangle(row, col);
      }
    }
  }

};

board.initGrid();