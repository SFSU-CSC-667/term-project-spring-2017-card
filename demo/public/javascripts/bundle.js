(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var thisBattleship = void 0;

var Battleship = function () {
    function Battleship() {
        _classCallCheck(this, Battleship);

        this.rows = 10;
        this.columns = 10;
        this.square_size = 40;

        this.player_gameboard = document.getElementById("player_board");
        this.opponent_gameboard = document.getElementById("opponent_board");
        // this.player_gameboard.addEventListener("drop", this.placeShip, false);
        // this.opponent_gameboard.addEventListener("click", this.fire, false);

        this.opponentBoard = this.initBoard(10);
        // this.opponentBoard = [
        //     [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        //     [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // ];

        this.playerBoard = this.initBoard(10);
        // this.playerBoard = [
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // ];


        this.placedShips = {};

        thisBattleship = this;
    }

    _createClass(Battleship, [{
        key: "initBoard",
        value: function initBoard(dim) {
            var matrix = [];
            for (var i = 0; i < dim; i++) {
                matrix.push(new Array(dim).fill(0));
            }
            return matrix;
        }
    }, {
        key: "drawBord",


        //initialize boards
        value: function drawBord() {
            var _this = this;

            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "p";
            var left_offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

            var i = void 0,
                j = void 0;
            for (i = 0; i < this.rows; i++) {
                var _loop = function _loop() {
                    var top_position = i * _this.square_size;
                    var left_position = j * _this.square_size;

                    var player_square = document.createElement("div");

                    player_square.id = id + i + j;
                    var thisObj = _this;
                    if (id == "p") {
                        _this.player_gameboard.appendChild(player_square);
                        player_square.addEventListener("dragover", function (event) {
                            thisObj.allowDrop(event);
                        });
                        player_square.addEventListener("drop", function (event) {
                            thisObj.onDrop(event);
                        });
                    } else {
                        _this.opponent_gameboard.appendChild(player_square);
                        player_square.addEventListener("click", function (event) {
                            thisObj.fire(event);
                        });
                    }

                    player_square.style.top = top_position + "px";
                    player_square.style.left = left_position + "px";
                };

                for (j = 0; j < this.columns; j++) {
                    _loop();
                }
            }
        }
    }, {
        key: "fire",
        value: function fire(event) {
            var square = event.target;
            var row = square.id.substring(1, 2);
            var column = square.id.substring(2, 3);
            console.log("(" + row + "," + column + ")");

            var fireEvent = { row: row, column: column };

            switch (this.opponentBoard[row][column]) {
                case 0:
                    //miss
                    square.style.backgroundImage = 'url("../assets/miss.png")';
                    this.opponentBoard[row][column] = 2;
                    fireEvent.hit = false;
                    break;
                case 1:
                    //hit
                    square.style.backgroundImage = 'url("../assets/hit.png")';
                    this.opponentBoard[row][column] = 3;
                    fireEvent.hit = true;
                    break;
                default:
                    break;
            }

            if (thisBattleship.fireListener) thisBattleship.fireListener(fireEvent);

            event.stopPropagation();
        }
    }, {
        key: "displayOpponentFire",
        value: function displayOpponentFire(fireEvent) {
            var row = fireEvent.row,
                column = fireEvent.column;
            var square = $('#p' + row + column);
            switch (this.playerBoard[row][column]) {
                case 0:
                    //miss
                    square.css("background-image", "url(../assets/miss.png)");
                    this.playerBoard[row][column] = 2;
                    // fireEvent.hit = false;
                    break;
                case 1:
                    //hit
                    square.css("background-image", "url(../assets/hit.png)");
                    this.playerBoard[row][column] = 3;
                    // fireEvent.hit = true;
                    break;
                default:
                    break;
            }
        }
    }, {
        key: "addFireListener",
        value: function addFireListener(listener) {
            thisBattleship.fireListener = listener;
        }
    }, {
        key: "allowDrop",
        value: function allowDrop(event) {
            event.preventDefault();
        }
    }, {
        key: "onDrop",
        value: function onDrop(event) {
            event.preventDefault();
            var ship = event.dataTransfer.getData("text");
            //const leftOffset = event.dataTransfer.getData("leftOffset");
            var leftOffset = 0;
            var previous_pos_id = document.getElementById(ship).parentNode.id;

            //const ship_height = parseInt(document.getElementById(ship).style.height) / this.square_size;
            var ship_height = $($('#' + ship)).height() / this.square_size;
            //this.ship_width = parseInt( document.getElementById(ship).style.width) / square_size;
            var ship_width = $($('#' + ship)).width() / this.square_size;

            var square = event.target;
            var row = parseInt(square.id.substring(1, 2));
            var column = parseInt(square.id.substring(2, 3)) - parseInt(leftOffset);

            console.log({ ship: ship, leftOffset: leftOffset, previous_pos_id: previous_pos_id, ship_height: ship_height, ship_width: ship_width, square: square, row: row, column: column });

            if (column >= 0 && this.canPlace(row, ship_height, column, ship_width, false)) {
                if (previous_pos_id != "pieces") this.removeShip(previous_pos_id, ship_height, ship_width);
                this.placeShip(square.id, leftOffset, ship_height, ship_width);
                square.appendChild(document.getElementById(ship));
            } else {
                alert("Ship cannot be placed");
            }

            //console.log( document.getElementById( ship));
            this.redrawBoard();
        }
    }, {
        key: "placeShip",
        value: function placeShip(pos_id, leftOffset, shipHeight, shipWidth) {
            pos_id = pos_id.toString();
            var row = parseInt(pos_id.substring(1, 2));
            var column = parseInt(pos_id.substring(2, 3)) - leftOffset;

            var ship = [];

            var i = void 0;
            if (shipHeight > shipWidth) {
                for (i = 0; i < shipHeight; i++) {
                    this.playerBoard[row + i][column] = 1;
                    ship.push({ row: row + i, column: column });
                }
            } else {
                for (i = 0; i < shipWidth; i++) {
                    this.playerBoard[row][column + i] = 1;
                    ship.push({ row: row, column: column + i });
                }
            }

            this.placedShips[this.currentShipId] = ship;
        }
    }, {
        key: "removeShip",
        value: function removeShip(previous_pos_id, ship_height, ship_width) {
            var row = parseInt(previous_pos_id.substring(1, 2));
            var column = parseInt(previous_pos_id.substring(2, 3));

            var i = void 0;
            if (ship_height > ship_width) {
                for (i = 0; i < ship_height; i++) {
                    this.playerBoard[row + i][column] = 0;
                }
            } else {
                for (i = 0; i < ship_width; i++) {
                    this.playerBoard[row][column + i] = 0;
                }
            }
        }
    }, {
        key: "redrawBoard",
        value: function redrawBoard() {
            var i = void 0,
                j = void 0;
            for (i = 0; i < this.rows; i++) {
                for (j = 0; j < this.columns; j++) {
                    switch (this.playerBoard[i][j]) {
                        case 0:
                            //document.getElementById("p" + i + j).style.background = "#f6f8f9";
                            break;
                        case 1:
                            //document.getElementById("p" + i + j).style.background = "#bbb";
                            break;
                    }
                }
            }
        }
    }, {
        key: "dragStart",
        value: function dragStart(event, domElement) {
            event.dataTransfer = event.originalEvent.dataTransfer;
            event.dataTransfer.setData("text", event.target.id);
            //const leftOffset = (event.pageX - event.target.offsetLeft) / thisBattleship.square_size;
            //event.dataTransfer.setData("leftOffset", parseInt(leftOffset));
            event.target.style.opacity = "0.4";

            thisBattleship.currentShipId = event.target.id;
        }
    }, {
        key: "dragStop",
        value: function dragStop(event) {
            event.target.style.opacity = "1";
        }
    }, {
        key: "flipShip",
        value: function flipShip(event) {
            //console.log( event);
            var parent_id = event.target.parentNode.id;
            var width = event.target.width;
            var height = event.target.height;
            var ship_height = parseInt(height) / thisBattleship.square_size;
            var ship_width = parseInt(width) / thisBattleship.square_size;

            //console.log( {width,height,ship_width,ship_height});

            if (parent_id == "pieces") {
                event.target.style.height = width + "px";
                event.target.style.width = height + "px";
                if (width > height) {
                    event.target.src = "../assets/" + event.target.id + "-90.png";
                } else {
                    event.target.src = "../assets/" + event.target.id + ".png";
                }
            } else if (thisBattleship.canPlace(parent_id.substring(1, 2), ship_height, parent_id.substring(2, 3), ship_width, true)) {
                event.target.style.width = height + "px";
                event.target.style.height = width + "px";

                if (width > height) {
                    event.target.src = "../assets/" + event.target.id + "-90.png";
                } else {
                    event.target.src = "../assets/" + event.target.id + ".png";
                }

                thisBattleship.removeShip(parent_id, ship_height, ship_width);
                thisBattleship.placeShip(parent_id, ship_width, ship_height);
                thisBattleship.redrawBoard();
            } else {
                alert("Cannot rotate ship");
            }
        }
    }, {
        key: "canPlace",
        value: function canPlace(row, ship_height, column, ship_width, rotated) {
            var skip_first = rotated;
            if (row + ship_height <= this.rows && column + ship_width <= this.columns) {
                var i = 0;
                for (i = row; i < row + ship_height; i++) {
                    if (skip_first) {
                        skip_first = false;
                    } else {
                        if (this.playerBoard[i][column] == 1) return false;
                    }
                }

                skip_first = rotated;

                for (i = column; i < column + ship_width; i++) {
                    if (skip_first) {
                        skip_first = false;
                    } else {
                        if (this.playerBoard[row][i] == 1) return false;
                    }
                }
            } else {
                return false;
            }
            return true;
        }
    }, {
        key: "bindDragEvents",
        value: function bindDragEvents($pieces) {
            $pieces.attr("draggable", "true");
            $pieces.on("click", thisBattleship.flipShip);
            $pieces.on("dragend", thisBattleship.dragStop);
            $pieces.on("dragstart", thisBattleship.dragStart);
        }
    }, {
        key: "setOpponentBoard",
        value: function setOpponentBoard(boardShipPositions) {
            console.log("setting opponent board!!");
            for (var ship in boardShipPositions) {
                boardShipPositions[ship].forEach(function (shipPosition) {
                    thisBattleship.opponentBoard[shipPosition.row][shipPosition.column] = 1;
                });
            }
            console.log("opponent board set!!");
        }
    }, {
        key: "initPieces",
        value: function initPieces() {
            $('#pieces').html(""); // clear pieces
            var pieces = ["carrier", "battleship", "destroyer", "submarine", "patrol"];
            pieces.forEach(function (val) {
                $('#pieces').append("<img class='ship' id=" + val + " src='assets/" + val + ".png'>");
            });
        }
    }, {
        key: "getBoard",
        get: function get() {
            return this.placedShips;
        }
    }]);

    return Battleship;
}();

module.exports = { Battleship: Battleship };

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by dusan_cvetkovic on 11/1/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _events = require("./constants/events");

var events = _interopRequireWildcard(_events);

var _game = require("./game");

var gameClass = _interopRequireWildcard(_game);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chat = void 0;
var me = '';

var Chat = function () {
    function Chat(user, socket) {
        _classCallCheck(this, Chat);

        chat = this;
        this.user = user.user;
        this.userObj = user;
        this.userSocket = socket;
        this.$usersList = $('#connections');
        this.$highScores = $('#highscore');

        this.bindEvents();
        this.bindSocketEvents();

        this.userSocket.emit(events.USER_JOINED, chat.user);
    }

    _createClass(Chat, [{
        key: "bindEvents",
        value: function bindEvents() {
            $('form#chat-form').submit(function (event) {
                event.preventDefault();
                chat.onMessageSubmit('#m', events.MESSAGE_SEND);
            });

            $('form#game-chat-form').submit(function (event) {
                event.preventDefault();
                chat.onMessageSubmit('#game-message', events.GAME_MESSAGE_SEND);
            });
        }
    }, {
        key: "onMessageReceived",
        value: function onMessageReceived(msg, selector) {
            var from = msg.user.username;
            var color = from == me ? 'green' : '#009afd';
            from = from == me ? 'Me' : msg.user.username;
            $(selector).append('<p style= "color:' + color + '"">' + from + ': ' + msg.message + "<p/>");
            console.log("message received ", msg);
        }
    }, {
        key: "onMessageSubmit",
        value: function onMessageSubmit(selector, socketEvent) {
            me = chat.user.username;
            this.userSocket.emit(socketEvent, { message: $(selector).val(), user: chat.user });
            $(selector).val('');
            console.log(me + " send a message.");
            return false;
        }
    }, {
        key: "bindSocketEvents",
        value: function bindSocketEvents() {
            this.userSocket.on(events.CREATE_GAME, chat.onGameCreated);
            this.userSocket.on(events.MESSAGE_SEND, function (messageData) {
                chat.onMessageReceived(messageData, '#messages');
            });
            this.userSocket.on(events.GAME_MESSAGE_SEND, function (messageData) {
                chat.onMessageReceived(messageData, '#game-messages');
            });
            this.userSocket.on(events.GET_USERS, chat.onGetUsers);
            this.userSocket.on(events.GET_HIGH_SCORES, chat.onGetHighScores);
            this.userSocket.on(events.UPDATE_USER_SOCKET, chat.onUpdateUserSocket);
        }
    }, {
        key: "onGameCreated",
        value: function onGameCreated(data) {
            var gameCreator = data.userCreatedGame;
            var joinButton = chat.buildJoinButton(gameCreator.id);

            var game = new gameClass.Game(data.gameId, chat.userSocket, gameCreator, true);

            if ($('#connections .btn-join #' + gameCreator.id).length == 0) {
                $('#connections li#' + gameCreator.id).append(joinButton);
                joinButton.on('click', function () {
                    game.onJoinGame(chat.user, chat.userSocket.id);
                });
            }

            if (this.id === data.mySocketId) {
                game.startGame();
            }
        }
    }, {
        key: "onUpdateUserSocket",
        value: function onUpdateUserSocket(data) {
            console.log(data);
            if (data.id == chat.user.id) {
                chat.userObj.user = data;
                chat.user = chat.userObj.user;
            }
        }
    }, {
        key: "onGetUsers",
        value: function onGetUsers(data) {
            // let $userNameItems = "";
            chat.$usersList.html("");
            var usersList = data.usersList;
            usersList.forEach(function (user) {
                var $userNameItem = $('<li/>').addClass("list-group-item").addClass("user").attr("id", user.id).html(user.username);
                data.games.some(function (game) {
                    if (user.socket_id == game.socket_created) {
                        console.log(game);
                        var joinButton = chat.buildJoinButton(user.id);
                        joinButton.on('click', function () {
                            var gameObj = new gameClass.Game(game.id, chat.userSocket, user);
                            gameObj.onJoinGame(chat.user, chat.userSocket.id);
                        });
                        $userNameItem.append(joinButton);
                        return true;
                    }
                });
                chat.$usersList.append($userNameItem);
            });
        }
    }, {
        key: "onGetHighScores",
        value: function onGetHighScores(data) {
            // let $userNameItems = "";
            chat.$highScores.html("");
            var usersList = data.usersList;
            usersList.forEach(function (score) {
                var highScoreItem = $('<li/>').addClass("score-list");
                var $name = $('<div/>').addClass("score-name").html(score.username);
                var $score = $('<div/>').addClass("score").html(score.score);
                highScoreItem.append($name);
                highScoreItem.append($score);

                chat.$highScores.append(highScoreItem);
            });
        }
    }, {
        key: "buildJoinButton",
        value: function buildJoinButton(userID) {
            return $('<button />').addClass('btn-join').addClass('btn-sm').addClass('btn-primary').addClass('pull-right').attr("id", userID).text('Join Game');
        }
    }]);

    return Chat;
}();

module.exports = { Chat: Chat };

},{"./constants/events":3,"./game":4}],3:[function(require,module,exports){
'use strict';

var LOBBY = 'lobby';
var USER_JOINED = 'user-joined';
var MESSAGE_SEND = 'message-send';
var GET_USERS = 'get-connections';
var UPDATE_USER_SOCKET = 'user-socket';

var GET_HIGH_SCORES = 'GET_HIGH_SCORES';

var FIND_LEADER = 'findLeader';

// Host Events
var CREATE_GAME = 'playerCreateNewGame';
var GAME_START = 'hostRoomFull';
var COUNTDOWN = 'hostCountdownFinished';
var NEXT_MOVE = 'hostNextRound';

// Player Events
var PLAYER_JOIN_GAME = 'playerJoinGame';
var PLAYER_MOVE = 'playerAnswer';
var PLAYER_RESTART = 'playerRestart';

// game events
var NEW_GAME_CREATED = 'newGameCreated';
var PLAYER_JOINED_GAME = 'playerJoinedGame';
var PLAYER_LEAVE_GAME = 'PLAYER_LEAVE_GAME';
var PLAYER_FORFEIT_GAME = 'PLAYER_FORFEIT_GAME';
var UPDATE_SCORE = 'UPDATE_SCORE';
var SUBMIT_BOARD = 'SUBMIT_BOARD';
var GET_OPPONENT_BOARD = 'GET_OPPONENT_BOARD';
var ON_NEXT_MOVE = 'ON_NEXT_MOVE';
var GET_GAME_HOST = 'GET_GAME_HOST';
var GAME_MESSAGE_SEND = 'GAME_MESSAGE_SEND';

// lobby
// const PLAYER_RESTART = 'playerRestart';

module.exports = {
    LOBBY: LOBBY, USER_JOINED: USER_JOINED, MESSAGE_SEND: MESSAGE_SEND, FIND_LEADER: FIND_LEADER,
    CREATE_GAME: CREATE_GAME, GAME_START: GAME_START, COUNTDOWN: COUNTDOWN, NEXT_MOVE: NEXT_MOVE, PLAYER_JOIN_GAME: PLAYER_JOIN_GAME, PLAYER_MOVE: PLAYER_MOVE, PLAYER_RESTART: PLAYER_RESTART,
    NEW_GAME_CREATED: NEW_GAME_CREATED, GET_USERS: GET_USERS, PLAYER_JOINED_GAME: PLAYER_JOINED_GAME, UPDATE_USER_SOCKET: UPDATE_USER_SOCKET, UPDATE_SCORE: UPDATE_SCORE, SUBMIT_BOARD: SUBMIT_BOARD,
    GET_OPPONENT_BOARD: GET_OPPONENT_BOARD, ON_NEXT_MOVE: ON_NEXT_MOVE, GET_GAME_HOST: GET_GAME_HOST, PLAYER_LEAVE_GAME: PLAYER_LEAVE_GAME, GAME_MESSAGE_SEND: GAME_MESSAGE_SEND,
    GET_HIGH_SCORES: GET_HIGH_SCORES, PLAYER_FORFEIT_GAME: PLAYER_FORFEIT_GAME

};

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by dusan_cvetkovic on 12/10/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _events = require('./constants/events');

var events = _interopRequireWildcard(_events);

var _user = require('./user');

var userClass = _interopRequireWildcard(_user);

var _battleship = require('./battleship');

var battleshipClass = _interopRequireWildcard(_battleship);

var _chat = require('./chat');

var chatClass = _interopRequireWildcard(_chat);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// let socket;
var thisGame = void 0;

var Game = function () {
    function Game(gameID, socketIO, user) {
        _classCallCheck(this, Game);

        thisGame = this;
        this.gameID = gameID;
        this.gameIsOn = false;
        this.battleship = new battleshipClass.Battleship();
        thisGame.battleship.initPieces();
        this.userSocket = socketIO;
        this.bindSocketEvents();

        this.hostUser = new userClass.User(user);
        this.isHostUser = this.hostUser.user.socket_id == socketIO.id;

        $('#submitBoard').on("click", this.onSubmitBoard);
        $('#leaveGame').on("click", this.onLeaveGame);

        this.$opponentScore = $('#header #opponent');
        this.$userScore = $('#header #user');
        this.$opponentPlacingDialog = $('#wait-opponent-placing');
        $('#submitBoard').show();
    }

    _createClass(Game, [{
        key: 'onSubmitBoard',
        value: function onSubmitBoard() {
            if ($('#pieces')[0].childNodes.length > 0) {
                alert("You have to place all your pieces!");
            } else {
                var $ships = $('.ship');
                $ships.unbind();
                $('#submitBoard').hide();
                thisGame.userSocket.emit(events.SUBMIT_BOARD, thisGame.getBoardData());
                thisGame.$opponentPlacingDialog.show();
            }
        }
    }, {
        key: 'bindSocketEvents',
        value: function bindSocketEvents() {

            this.userSocket.on(events.PLAYER_JOINED_GAME, thisGame.onPlayerJoinedGame);
            this.userSocket.on(events.UPDATE_SCORE, thisGame.onUpdateScore);
            this.userSocket.on(events.GET_OPPONENT_BOARD, thisGame.onOpponentBoardSubmit);
            this.userSocket.on(events.ON_NEXT_MOVE, thisGame.onOpponentMove);
            this.userSocket.on(events.PLAYER_FORFEIT_GAME, thisGame.onGameForfeited);

            // this.userSocket.on(events.GET_GAME_HOST, thisGame.onGetGameHost);
        }

        // onGetGameHost(data) {
        //     this.hostUser = new userClass.User(data);
        // }

    }, {
        key: 'getBoardData',
        value: function getBoardData() {
            return {
                board: thisGame.battleship.getBoard,
                user: thisGame.player.user,
                game_id: thisGame.gameID
            };
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            $('.page').hide();
            $('#game').show();

            var $pieces = $('.ship');
            this.battleship.bindDragEvents($pieces);
            this.battleship.drawBord("p", 0);
            this.battleship.drawBord("o", 10);
            this.battleship.addFireListener(thisGame.onFireEvent);

            this.battleship.drawBord();

            if (!thisGame.gameIsOn) $('#opponent_board').addClass('disabled-button');else $('#opponent_board').removeClass('disabled-button');
            this.$opponentPlacingDialog.hide();
            // if (gameId != undefined) {
            //     thisGame.userGameId = gameId;
            // }
        }
    }, {
        key: 'onFireEvent',
        value: function onFireEvent(fireEvent) {
            thisGame.userSocket.emit(events.ON_NEXT_MOVE, {
                game_id: thisGame.gameID,
                user: thisGame.player.user,
                opponent: thisGame.opponentPlayer.user,
                fire_event: fireEvent
            });
        }
    }, {
        key: 'onOpponentMove',
        value: function onOpponentMove(fireEventData) {
            if (fireEventData.opponent.id == thisGame.player.user.id) {
                thisGame.battleship.displayOpponentFire(fireEventData.fire_event);
            }
        }
    }, {
        key: 'onPlayerJoinedGame',
        value: function onPlayerJoinedGame(data) {
            if (thisGame.isHostUser) {
                thisGame.startGame();
                thisGame.$userScore.html("User: " + data.user.username);
                // this.isHostUser = true;
            } else {
                thisGame.startGame();
            }

            thisGame.opponentUser = new userClass.User(data.user);
            console.log("logged to game: ", data);
            $('#game-area').show();
            $('#wait-opponent').hide();
            thisGame.$opponentScore.show();
            // $('#wait-opponent').removeClass('loader');
        }
    }, {
        key: 'onUpdateScore',
        value: function onUpdateScore(gameDataResult) {
            console.log(gameDataResult);
            var gameData = gameDataResult.game;
            if (thisGame.isHostUser) {
                thisGame.displayScore(gameData.player1_username, gameData.player1_score, gameData.player2_username, gameData.player2_score);
            } else {
                thisGame.displayScore(gameData.player2_username, gameData.player2_score, gameData.player1_username, gameData.player1_score);
            }

            thisGame.checkForGameOver(gameDataResult);

            if (thisGame.gameIsOn && (thisGame.isHostUser && gameData.player1_turn || !thisGame.isHostUser && !gameData.player1_turn)) {
                $('#opponent_board').removeClass('disabled-button');
            } else {
                $('#opponent_board').addClass('disabled-button');
            }
        }
    }, {
        key: 'checkForGameOver',
        value: function checkForGameOver(gameDataResult) {
            console.log("ships left: ", gameDataResult.shipsLeft);
            switch (gameDataResult.shipsLeft.length) {
                case 2:
                    thisGame.gameIsOn = true;
                    thisGame.$opponentPlacingDialog.hide();
                    break;
                case 1:
                    var userShipsLeft = gameDataResult.shipsLeft[0];
                    if (thisGame.player.user.id == userShipsLeft.player_id) {
                        var winner = thisGame.getPlayerById(userShipsLeft.player_id);
                        console.log("You won: ", winner.user);
                        alertify.notify("You won: " + winner.user.username, 'success');
                        // var notification = alertify.notify('sample', 'success', 5, function(){
                        //     console.log('You won.'); });

                        thisGame.userSocket.emit(events.PLAYER_LEAVE_GAME, {
                            gameId: thisGame.gameID,
                            user: winner.user
                        });
                    } else {
                        var loser = thisGame.getOtherPlayerById(userShipsLeft.player_id);
                        console.log("You lost: ", loser.user);
                        alertify.notify("You lost: " + loser.user.username, 'error');
                        // alertify.notify('sample', 'success', 5, function(){
                        //     console.log('You lost.'); });
                        thisGame.userSocket.emit(events.PLAYER_LEAVE_GAME, {
                            gameId: thisGame.gameID,
                            user: loser.user
                        });
                    }

                    $('.page').hide();
                    $('#lobby').show();
                    thisGame.populateHeader(thisGame.player.user);
                    thisGame.restartGameState();
            }
        }
    }, {
        key: 'onLeaveGame',
        value: function onLeaveGame() {
            var usersList = [{ player_id: thisGame.opponentUser.user.id }];
            // thisGame.checkForGameOver({shipsLeft:usersList});
            thisGame.userSocket.emit(events.PLAYER_FORFEIT_GAME, { gameId: thisGame.gameID, shipsLeft: usersList });
            $('#submitBoard').show();
        }
    }, {
        key: 'onGameForfeited',
        value: function onGameForfeited(data) {
            thisGame.checkForGameOver(data);
        }
    }, {
        key: 'restartGameState',
        value: function restartGameState() {
            thisGame.battleship = new battleshipClass.Battleship();
            thisGame.battleship.initPieces();

            $('#game-area').hide();
            $('#wait-opponent').show();

            $('#player_board').html("");
            $('#opponent_board').html("");
            thisGame.$opponentScore.hide();
            $('#submitBoard').show();
        }
    }, {
        key: 'getPlayerById',
        value: function getPlayerById(id) {
            return thisGame.hostUser.user.id == id ? thisGame.hostUser : thisGame.opponentUser;
        }
    }, {
        key: 'getOtherPlayerById',
        value: function getOtherPlayerById(id) {
            return thisGame.hostUser.user.id != id ? thisGame.hostUser : thisGame.opponentUser;
        }
    }, {
        key: 'displayScore',
        value: function displayScore(userName, userScore, opponentName, opponentScore) {
            thisGame.$userScore.html("User: " + userName + ": " + userScore);
            thisGame.$opponentScore.html("Opponent: " + opponentName + ": " + opponentScore);
        }
    }, {
        key: 'onOpponentBoardSubmit',
        value: function onOpponentBoardSubmit(boardData) {
            if (boardData.user.id == thisGame.opponentPlayer.user.id) {
                console.log("setting opp board");
                thisGame.battleship.setOpponentBoard(boardData.board);
            }
        }
    }, {
        key: 'onJoinGame',
        value: function onJoinGame(user, socketID) {
            this.userSocket.emit(events.PLAYER_JOIN_GAME, {
                gameId: thisGame.gameID,
                user: user,
                mySocketId: socketID
            });
        }
    }, {
        key: 'populateHeader',
        value: function populateHeader(user) {
            $('#header').show();
            $('#header #user').html("Welcome " + user.username);
            thisGame.$opponentScore.show();
        }
    }, {
        key: 'opponentPlayer',
        get: function get() {
            if (!thisGame.isHostUser) return thisGame.hostUser;else return thisGame.opponentUser;
        }
    }, {
        key: 'player',
        get: function get() {
            if (thisGame.isHostUser) return thisGame.hostUser;else return thisGame.opponentUser;
        }
    }]);

    return Game;
}();

module.exports = { Game: Game };

},{"./battleship":1,"./chat":2,"./constants/events":3,"./user":6}],5:[function(require,module,exports){
'use strict';

var user = void 0;
var chat = void 0;
var clientIO = void 0;
var chatClass = require('./chat');
var userClass = require('./user');
var events = require('./constants/events');
var socket = io.connect();

function showErrorMessage(error) {
    $('#login-error').text(error.message);
    $('#login-error').show();
    console.log("error", error);
    alertify.notify(error.message, 'error');
}
$(document).ready(function () {

    //being called by login function
    function populateHeader(user) {
        $('#header').show();
        $('#header #user').html("Welcome " + user.username);
    }

    //call populateHeader function defined above
    function login(result) {
        if (!result.success) {
            showErrorMessage(result);
            return;
        }
        clientIO = io();
        user = new userClass.User(result.user);
        chat = new chatClass.Chat(user, clientIO);

        //user login successful, send the username to the socket IO
        socket.emit('new user', result.user.username);
        //brocast user is Online
        socket.on('user join', function (data) {
            console.log("NEW USER CLIENT SIDE: " + data);
            $('#messages').append('<p style= "color: red' + '"">' + "System: " + data + " is online.</p>");
        });

        $('.page').hide();
        $('#lobby').show();
        populateHeader(user.user);
    }

    //click login-tab to change register/login
    $('.login-tab').click(function (event) {
        $('#register-error').hide();
        $('#login-error').hide();
    });

    //click login-submit to call login function defined above
    $('input#login-submit').click(function (event) {
        event.preventDefault();
        $.post('/login', $('form#login-form').serialize(), function () {}, 'json').done(function (result) {
            login(result);
        }).fail(function (error) {
            showErrorMessage(JSON.parse(error.responseText));
        });
    });

    //clisk register form submit
    $('input#register-submit').click(function (event) {
        event.preventDefault();
        $.post('/register', $('form#register-form').serialize(), function () {}, 'json').done(function (result) {
            login(result);
        }).fail(function (error) {
            $('#register-error').text("Error registering");
            $('#register-error').show();
            console.log("error", error);
        });
    });

    //click create game
    $('button#createGame').click(function (event) {
        "use strict";

        clientIO.emit(events.CREATE_GAME, { user: user.user });
    });
});

},{"./chat":2,"./constants/events":3,"./user":6}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("./constants/events");

var events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var thisUser = void 0;
var socket = void 0;

var User = function () {
    function User(jsonUser) {
        _classCallCheck(this, User);

        this.user = jsonUser;
        // this.battleship = battleship;
        // socket = socketIO;
        thisUser = this;

        this.bindSocketEvents();
    }

    _createClass(User, [{
        key: "bindSocketEvents",
        value: function bindSocketEvents() {
            // this.clientIO.on(events.MESSAGE_SEND, thisChat.onMessageReceived);
            // this.clientIO.on(events.GET_USERS, thisChat.onGetUsers);
            // this.clientIO.on(events.CREATE_GAME, thisChat.onGameCreated);
            // this.clientIO.on(events.PLAYER_JOINED_GAME, thisChat.onPlayerJoinedGame);
        }
    }]);

    return User;
}();

module.exports = { User: User };

},{"./constants/events":3}]},{},[5]);
