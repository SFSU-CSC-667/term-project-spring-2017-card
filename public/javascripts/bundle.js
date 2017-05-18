(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var USER_JOINED = 'USER_JOINED';
var MESSAGE_SEND = 'MESSAGE_SEND';
var UPDATE_USER_SOCKET = 'UPDATE_USER_SOCKET';
var GET_HIGH_SCORES = 'GET_HIGH_SCORES';
var USER_LOGIN = 'USER_LOGIN';
var USER_LOGIN_MESSAGE = 'USER_LOGIN_MESSAGE';

module.exports = {
  USER_JOINED: USER_JOINED, MESSAGE_SEND: MESSAGE_SEND, UPDATE_USER_SOCKET: UPDATE_USER_SOCKET, GET_HIGH_SCORES: GET_HIGH_SCORES, USER_LOGIN_MESSAGE: USER_LOGIN_MESSAGE, USER_LOGIN: USER_LOGIN
};

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var events = require('../constants/events');

var chat = void 0;
var me = '';

var Chat = function () {
    function Chat(user, socket) {
        _classCallCheck(this, Chat);

        chat = this;
        this.user = user.user;
        this.userObj = user;
        this.userSocket = socket;
        this.$highScores = $('#highscore');

        this.bindEvents();
        this.bindSocketEvents();

        this.userSocket.emit(events.USER_JOINED, chat.user);
    }

    _createClass(Chat, [{
        key: 'bindEvents',
        value: function bindEvents() {
            $('form#chat-form').submit(function (event) {
                event.preventDefault();
                chat.onMessageSubmit('#message', events.MESSAGE_SEND);
            });
        }
    }, {
        key: 'onMessageReceived',
        value: function onMessageReceived(msg, selector) {
            var from = msg.user.username;
            var color = from == me ? 'green' : '#009afd';
            from = from == me ? 'Me' : msg.user.username;
            $(selector).append('<p style= "color:' + color + '"">' + from + ': ' + msg.message + "<p/>");
            console.log("message received ", msg);
            $(selector).animate({ scrollTop: $(selector).prop("scrollHeight") }, 500);
        }
    }, {
        key: 'onMessageSubmit',
        value: function onMessageSubmit(selector, socketEvent) {
            me = chat.user.username;
            this.userSocket.emit(socketEvent, { message: $(selector).val(), user: chat.user });
            $(selector).val('');
            console.log(me + " send a message.");
            return false;
        }
    }, {
        key: 'bindSocketEvents',
        value: function bindSocketEvents() {
            this.userSocket.on(events.MESSAGE_SEND, function (messageData) {
                chat.onMessageReceived(messageData, '#messages');
            });
            this.userSocket.on(events.GET_HIGH_SCORES, chat.onGetHighScores);
            this.userSocket.on(events.UPDATE_USER_SOCKET, chat.onUpdateUserSocket);
        }
    }, {
        key: 'onUpdateUserSocket',
        value: function onUpdateUserSocket(data) {
            console.log(data);
            if (data.id == chat.user.id) {
                chat.userObj.user = data;
                chat.user = chat.userObj.user;
            }
        }
    }, {
        key: 'onGetHighScores',
        value: function onGetHighScores(data) {
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
    }]);

    return Chat;
}();

module.exports = { Chat: Chat };

},{"../constants/events":1}],3:[function(require,module,exports){
'use strict';

var chatClass = require('./chat');
var userClass = require('./user');
var events = require('../constants/events');
var socket = io.connect();

var user;
var chat;
var clientIO;

function showErrorMessage(error) {
    $('#login-error').text(error.message);
    $('#login-error').show();
    console.log("error", error);
}
$(document).ready(function () {

    //being called by login function
    function populateHeader(user) {
        $('#header').show();
        $('#header #user').append('<a href=.>Log out as ' + user.username + '</a>');
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
        socket.emit(events.USER_LOGIN, result.user.username);
        //brocast user is Online
        socket.on(events.USER_LOGIN_MESSAGE, function (data) {
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

},{"../constants/events":1,"./chat":2,"./user":4}],4:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var events = require('../constants/events');

var thisUser = void 0;
var socket = void 0;

var User = function User(jsonUser) {
    _classCallCheck(this, User);

    this.user = jsonUser;
    thisUser = this;
};

module.exports = { User: User };

},{"../constants/events":1}]},{},[3]);
