const socketIo = require('socket.io');
const events = require('../constants/events');
var io;
const db = require('../db/db.js').battleshipDB;
var BattleshipGame = require('../db/game.js');
var GameStatus = require('../db/gameStatus.js');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var users = {};
var gameIdCounter = 1;

const init = (app, server) => {
  io = socketIo(server);
  app.set('io', io);

  io.on('connection', socket => {

    users[socket.id] = {
      inGame: null,
      player: null
    };

    socket.join('waiting-room');

    socket.on('chat', function(msg) {
      if(users[socket.id].inGame !== null && msg) {
        socket.broadcast.to('game' + users[socket.id].inGame.id).emit('chat', {
          name: 'Opponent',
          message: entities.encode(msg),
        });

        io.to(socket.id).emit('chat', {
          name: 'Me',
          message: entities.encode(msg),
        });
      }
    });

    socket.on('shot', function(position) {
      var game = users[socket.id].inGame, opponent;

      if(game !== null) {
        if(game.currentPlayer === users[socket.id].player) {
          opponent = game.currentPlayer === 0 ? 1 : 0;

          if(game.shoot(position)) {
            checkGameOver(game);

            io.to(socket.id).emit('update', game.getGameState(users[socket.id].player, opponent));
            io.to(game.getPlayerId(opponent)).emit('update', game.getGameState(opponent, opponent));
          }
        }
      }
    });

    socket.on('leave', function() {
      if(users[socket.id].inGame !== null) {
        leaveGame(socket);
        socket.join('waiting-room');
      }
    });

    socket.on('disconnect', data => {
      db.none('update player set is_logged_in=$1, socket_id=$3 where id=$2 returning *',
          [false, data.id, socket.id]);
      leaveGame(socket);
      delete users[socket.id];
    });

    socket.on(events.USER_JOINED, data => {
      db.one('update player set is_logged_in=$1, socket_id=$3 where id=$2 returning *',
          [true, data.id, socket.id])
          .then(function (user) {
              io.emit(events.UPDATE_USER_SOCKET, user);
              sendHighScoreTable();
          });
    });

    socket.on(events.USER_LOGIN, data => {
      io.emit(events.USER_LOGIN_MESSAGE, data);
    })

    socket.on(events.MESSAGE_SEND, data => {
      io.emit(events.MESSAGE_SEND, data)
    });
     joinWaitingPlayers(socket.id);
  })
};

function sendHighScoreTable() {
  db.any('SELECT * FROM player, high_score WHERE high_score.user_id=player.id ' +
      'ORDER BY score DESC LIMIT 10')
      .then(function (data) {
        const res = {usersList: data};
        io.emit(events.GET_HIGH_SCORES, res);
      })
      .catch(function (error) {
        console.log("Error: Unable to retriev from high_scores db", error);
      });
}

function joinWaitingPlayers(socketID) {
  var players = getClientsInRoom('waiting-room');
  if(players.length >= 2) {
    var game = new BattleshipGame(gameIdCounter++, players[0].id, players[1].id);

    players[0].leave('waiting-room');
    players[1].leave('waiting-room');
    players[0].join('game' + game.id);
    players[1].join('game' + game.id);

    users[players[0].id].player = 0;
    users[players[1].id].player = 1;
    users[players[0].id].inGame = game;
    users[players[1].id].inGame = game;

    io.to('game' + game.id).emit('join', game.id);

    io.to(players[1].id).emit('update', game.getGameState(1, 1)); //second palyer play first
    io.to(players[0].id).emit('update', game.getGameState(0, 0));
  }
}

function leaveGame(socket) {
  if(users[socket.id].inGame !== null) {
    socket.broadcast.to('game' + users[socket.id].inGame.id).emit('notification', {
      message: 'Opponent has left the game'
    });

    if(users[socket.id].inGame.gameStatus !== GameStatus.gameOver) {
      users[socket.id].inGame.abortGame(users[socket.id].player);
      checkGameOver(users[socket.id].inGame);
    }

    socket.leave('game' + users[socket.id].inGame.id);

    users[socket.id].inGame = null;
    users[socket.id].player = null;

    io.to(socket.id).emit('leave');
  }
}

function checkGameOver(game) {
  if(game.gameStatus === GameStatus.gameOver) {
    io.to(game.getWinnerId()).emit('gameover', true);
    io.to(game.getLoserId()).emit('gameover', false);
  }
}

function getClientsInRoom(room) {
  var clients = [];
  for (var id in io.sockets.adapter.rooms[room]) {
    clients.push(io.sockets.adapter.nsp.connected[id]);
  }
  return clients;
}
module.exports = {init};
