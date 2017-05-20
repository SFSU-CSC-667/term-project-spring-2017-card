var GameStatus = {
  inProgress: 1,
  gameOver: 2
}

var Game = (function() {
  var canvas = [], context = [], grid = [],
      gridHeight = 361, gridWidth = 361, gridBorder = 1,
      gridRows = 10, gridCols = 10, markPadding = 10, shipPadding = 3,
      squareHeight = (gridHeight - gridBorder * gridRows - gridBorder) / gridRows,
      squareWidth = (gridWidth - gridBorder * gridCols - gridBorder) / gridCols,
      turn = false, gameStatus, squareHover = { x: -1, y: -1 };

  canvas[0] = document.getElementById('canvas-grid1');
  canvas[1] = document.getElementById('canvas-grid2');
  context[0] = canvas[0].getContext('2d');
  context[1] = canvas[1].getContext('2d');

  canvas[1].addEventListener('mousemove', function(e) {
    var pos = getCanvasCoordinates(e, canvas[1]);
    squareHover = getSquare(pos.x, pos.y);
    drawGrid(1);
  });

  canvas[1].addEventListener('mouseout', function(e) {
    squareHover = { x: -1, y: -1 };
    drawGrid(1);
  });

  canvas[1].addEventListener('click', function(e) {
    if(turn) {
      var pos = getCanvasCoordinates(e, canvas[1]);
      var square = getSquare(pos.x, pos.y);
      sendShot(square);
    }
  });

  function getSquare(x, y) {
    return {
      x: Math.floor(x / (gridWidth / gridCols)),
      y: Math.floor(y / (gridHeight / gridRows))
    };
  };

  function getCanvasCoordinates(event, canvas) {
    rect = canvas.getBoundingClientRect();
    return {
      x: Math.round((event.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
      y: Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
    };
  };

  function initGame() {
    var i;

    gameStatus = GameStatus.inProgress;

    grid[0] = { shots: Array(gridRows * gridCols), ships: [] };
    grid[1] = { shots: Array(gridRows * gridCols), ships: [] };

    for(i = 0; i < gridRows * gridCols; i++) {
      grid[0].shots[i] = 0;
      grid[1].shots[i] = 0;
    }

    $('#turn-status').removeClass('alert-your-turn').removeClass('alert-opponent-turn')
            .removeClass('alert-winner').removeClass('alert-loser');

    drawGrid(0);
    drawGrid(1);
  };

  function updateGrid(player, gridState) {
    grid[player] = gridState;
    drawGrid(player);
  };

  function setTurn(turnState) {
    if(gameStatus !== GameStatus.gameOver) {
      turn = turnState;

      if(turn) {
        $('#turn-status').removeClass('alert-opponent-turn').addClass('alert-your-turn').html('It\'s your turn!');
      } else {
        $('#turn-status').removeClass('alert-your-turn').addClass('alert-opponent-turn').html('Waiting for opponent.');
      }
    }
  };

  function setGameOver(isWinner) {
    gameStatus = GameStatus.gameOver;
    turn = false;

    if(isWinner) {
      $('#turn-status').removeClass('alert-opponent-turn').removeClass('alert-your-turn')
              .addClass('alert-winner').html('You won! <a href="#" class="btn-leave-game">Play again</a>.');
    } else {
      $('#turn-status').removeClass('alert-opponent-turn').removeClass('alert-your-turn')
              .addClass('alert-loser').html('You lost. <a href="#" class="btn-leave-game">Play again</a>.');
    }
    $('.btn-leave-game').click(sendLeaveRequest);
  }

  function drawGrid(gridIndex) {
    drawSquares(gridIndex);
    drawShips(gridIndex);
    drawMarks(gridIndex);
  };

  function drawSquares(gridIndex) {
    var i, j, squareX, squareY;

    context[gridIndex].fillStyle = '#222222'
    context[gridIndex].fillRect(0, 0, gridWidth, gridHeight);

    for(i = 0; i < gridRows; i++) {
      for(j = 0; j < gridCols; j++) {
        squareX = j * (squareWidth + gridBorder) + gridBorder;
        squareY = i * (squareHeight + gridBorder) + gridBorder;

        context[gridIndex].fillStyle = '#FFFFFF';

        if(j === squareHover.x && i === squareHover.y &&
                gridIndex === 1 && grid[gridIndex].shots[i * gridCols + j] === 0 && turn) {
          context[gridIndex].fillStyle = '#808080';
        }

        context[gridIndex].fillRect(squareX, squareY, squareWidth, squareHeight);
      }
    }
  };

  function drawShips(gridIndex) {
    var ship, i, x, y,
        shipWidth, shipLength;

    context[gridIndex].fillStyle = '#444444';

    for(i = 0; i < grid[gridIndex].ships.length; i++) {
      ship = grid[gridIndex].ships[i];

      x = ship.x * (squareWidth + gridBorder) + gridBorder + shipPadding;
      y = ship.y * (squareHeight + gridBorder) + gridBorder + shipPadding;
      shipWidth = squareWidth - shipPadding * 2;
      shipLength = squareWidth * ship.size + (gridBorder * (ship.size - 1)) - shipPadding * 2;

      if(ship.horizontal) {
        context[gridIndex].fillRect(x, y, shipLength, shipWidth);
      } else {
        context[gridIndex].fillRect(x, y, shipWidth, shipLength);
      }
    }
  };

  function drawMarks(gridIndex) {
    var i, j, squareX, squareY;

    for(i = 0; i < gridRows; i++) {
      for(j = 0; j < gridCols; j++) {
        squareX = j * (squareWidth + gridBorder) + gridBorder;
        squareY = i * (squareHeight + gridBorder) + gridBorder;

        if(grid[gridIndex].shots[i * gridCols + j] === 1) {
          context[gridIndex].beginPath();
          context[gridIndex].moveTo(squareX + markPadding, squareY + markPadding);
          context[gridIndex].lineTo(squareX + squareWidth - markPadding, squareY + squareHeight - markPadding);
          context[gridIndex].moveTo(squareX + squareWidth - markPadding, squareY + markPadding);
          context[gridIndex].lineTo(squareX + markPadding, squareY + squareHeight - markPadding);
          context[gridIndex].strokeStyle = '#000000';
          context[gridIndex].stroke();
        }
        else if(grid[gridIndex].shots[i * gridCols + j] === 2) {
          context[gridIndex].beginPath();
          context[gridIndex].arc(squareX + squareWidth / 2, squareY + squareWidth / 2,
                                 squareWidth / 2 - markPadding, 0, 2 * Math.PI, false);
          context[gridIndex].fillStyle = '#E62E2E';
          context[gridIndex].fill();
        }
      }
    }
  };

  return {
    'initGame': initGame,
    'updateGrid': updateGrid,
    'setTurn': setTurn,
    'setGameOver': setGameOver
  };
})();
