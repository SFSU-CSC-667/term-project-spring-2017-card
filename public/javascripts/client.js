var socket = io();

$(function() {
  socket.on('connect', function() {
    $('#disconnected').hide();
    $('#waiting-room').show();
  });

  socket.on('disconnect', function() {
    $('#waiting-room').hide();
    $('#game').hide();
    $('#disconnected').show();
  });

  socket.on('join', function(gameId) {
    Game.initGame();
    $('#messages').empty();
    $('#disconnected').hide();
    $('#waiting-room').hide();
    $('#game').show();
    $('#game-number').html(gameId);

  })

  socket.on('update', function(gameState) {
    Game.setTurn(gameState.turn);
    Game.updateGrid(gameState.playerGridSide, gameState.grid);
  });

  socket.on('chat', function(msg) {
    if(msg.name === 'Me'){
      $('#messages').append(' <li style= "color:green"><strong> ' + msg.name + ':</strong> ' + msg.message + '</li>');
    }else{
      $('#messages').append('<li style = "color:#009afd"><strong>' + msg.name + ':</strong> ' + msg.message + '</li>');
    }
    $('#messages-list').scrollTop($('#messages-list')[0].scrollHeight);
  });

  socket.on('notification', function(msg) {
    $('#messages').append('<li style= "color:red">' + msg.message + '</li>');
    $('#messages-list').scrollTop($('#messages-list')[0].scrollHeight);
  });

  socket.on('gameover', function(isWinner) {
    Game.setGameOver(isWinner);
  });

  socket.on('leave', function() {
    $('#game').hide();
    $('#waiting-room').show();
  });

  $('#message-form').submit(function() {
    socket.emit('chat', $('#message').val());
    $('#message').val('');
    return false;
  });

});

function sendLeaveRequest(e) {
  e.preventDefault();
  socket.emit('leave');
}

function sendShot(square) {
  socket.emit('shot', square);
}
