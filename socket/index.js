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
        console.log('Socket ID ' + socket.id + ' connected.');

        // create user object for additional data
        users[socket.id] = {
          inGame: null,
          player: null
        };

        // join waiting-room until there are enough players to start a new game
        socket.join('waiting-room');

        /**
         * client.js emit('chat',#(message).val())
         * Handle chat messages
         */
        socket.on('chat', function(msg) {
          if(users[socket.id].inGame !== null && msg) {
            console.log((new Date().toISOString()) + ' Chat message from ' + socket.id + ': ' + msg);

            // Send message to opponent
            socket.broadcast.to('game' + users[socket.id].inGame.id).emit('chat', {
              name: 'Opponent',
              message: entities.encode(msg),
            });

            // Send message to self
            io.to(socket.id).emit('chat', {
              name: 'Me',
              message: entities.encode(msg),
            });
          }
        });

        /**
         * client.js emit('shot', square)
         * Handle shot from client
         */
        socket.on('shot', function(position) {

          var game = users[socket.id].inGame, opponent;

          if(game !== null) {
            // Is it this users turn?
            if(game.currentPlayer === users[socket.id].player) {
              opponent = game.currentPlayer === 0 ? 1 : 0;

              if(game.shoot(position)) {
                // Valid shot
                checkGameOver(game);

                // Update game state on both clients.
                io.to(socket.id).emit('update', game.getGameState(users[socket.id].player, opponent));
                io.to(game.getPlayerId(opponent)).emit('update', game.getGameState(opponent, opponent));
              }
            }
          }
        });

        /**
         * client.js emit('leave')
         * Handle leave game request
         */
        socket.on('leave', function() {
          if(users[socket.id].inGame !== null) {
            leaveGame(socket);

            socket.join('waiting-room');
            // joinWaitingPlayers();
          }
        });

        /**
         * Handle client disconnect
        */
        socket.on('disconnect', data => {
          db.none('update player set is_logged_in=$1, socket_id=$3 where id=$2 returning *',
              [false, data.id, socket.id]);
          console.log( 'Socket ID ' + socket.id + ' disconnected.');

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
            console.log("Success: Retrive " + data.length + " from high_score db");
            const res = {usersList: data};
            io.emit(events.GET_HIGH_SCORES, res);
        })
        .catch(function (error) {
            console.log("Error: Unable to retriev from high_scores db", error);
        });
}

/**
 * Create games for players in waiting-room
 */
function joinWaitingPlayers(socketID) {
      var players = getClientsInRoom('waiting-room');
      if(players.length >= 2) {
        // 2 player waiting. Create new game!
        var game = new BattleshipGame(gameIdCounter++, players[0].id, players[1].id);

        // create new room for this game
        players[0].leave('waiting-room');
        players[1].leave('waiting-room');
        players[0].join('game' + game.id);
        players[1].join('game' + game.id);

        users[players[0].id].player = 0;
        users[players[1].id].player = 1;
        users[players[0].id].inGame = game;
        users[players[1].id].inGame = game;

        io.to('game' + game.id).emit('join', game.id);

        // send initial ship placements(Set turn)
        io.to(players[1].id).emit('update', game.getGameState(1, 1)); //second palyer play first
        io.to(players[0].id).emit('update', game.getGameState(0, 0));

        console.log(players[0].id + " and " + players[1].id + " have joined game ID " + game.id);
    }
}

/**
 * Leave user's game
 * @param {type} socket
 */
function leaveGame(socket) {
  if(users[socket.id].inGame !== null) {
    console.log((new Date().toISOString()) + ' ID ' + socket.id + ' left game ID ' + users[socket.id].inGame.id);

    // Notifty opponent
    socket.broadcast.to('game' + users[socket.id].inGame.id).emit('notification', {
      message: 'Opponent has left the game'
    });

    if(users[socket.id].inGame.gameStatus !== GameStatus.gameOver) {
      // Game is unfinished, abort it.
      users[socket.id].inGame.abortGame(users[socket.id].player);
      checkGameOver(users[socket.id].inGame);
    }

    socket.leave('game' + users[socket.id].inGame.id);

    users[socket.id].inGame = null;
    users[socket.id].player = null;

    io.to(socket.id).emit('leave');
  }
}

/**
 * Notify players if game over.
 * @param {type} game
 */
function checkGameOver(game) {
  if(game.gameStatus === GameStatus.gameOver) {
    console.log((new Date().toISOString()) + ' Game ID ' + game.id + ' ended.');
    io.to(game.getWinnerId()).emit('gameover', true);
    io.to(game.getLoserId()).emit('gameover', false);
  }
}

/**
 * Find all sockets in a room
 * @param {type} room
 * @returns {Array}
 */
function getClientsInRoom(room) {
  var clients = [];
  for (var id in io.sockets.adapter.rooms[room]) {
    clients.push(io.sockets.adapter.nsp.connected[id]);
  }
  return clients;
}
module.exports = {init};
