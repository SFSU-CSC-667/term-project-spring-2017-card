/**
 * Created by dusan_cvetkovic on 11/1/16.
 */
import * as events from "./constants/events"
import * as gameClass from "./game"

let chat;
var me ='';
class Chat {
    constructor(user, socket) {
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

    bindEvents() {
        $('form#chat-form').submit(function (event) {
            event.preventDefault();
            chat.onMessageSubmit('#m', events.MESSAGE_SEND);
        });

        $('form#game-chat-form').submit(function (event) {
            event.preventDefault();
            chat.onMessageSubmit('#game-message', events.GAME_MESSAGE_SEND);
        });
    }

    onMessageReceived(msg, selector) {
        var from = msg.user.username;
        var color = (from == me) ? 'green' : '#009afd';
        from = (from == me) ? 'Me' : msg.user.username;
        $(selector).append('<p style= "color:' + color + '"">'+ from  + ': ' + msg.message + "<p/>")
        console.log("message received ", msg)
    }

    onMessageSubmit(selector, socketEvent) {
        me = chat.user.username;
        this.userSocket.emit(socketEvent,
            {message:$(selector).val(), user:chat.user});
        $(selector).val('');
        console.log(me + " send a message.");
        return false;
    }

    bindSocketEvents() {
        this.userSocket.on(events.CREATE_GAME, chat.onGameCreated);
        this.userSocket.on(events.MESSAGE_SEND, function (messageData) {
            chat.onMessageReceived(messageData, '#messages')
        });
        this.userSocket.on(events.GAME_MESSAGE_SEND, function (messageData) {
            chat.onMessageReceived(messageData, '#game-messages')
        });
        this.userSocket.on(events.GET_USERS, chat.onGetUsers);
        this.userSocket.on(events.GET_HIGH_SCORES, chat.onGetHighScores);
        this.userSocket.on(events.UPDATE_USER_SOCKET, chat.onUpdateUserSocket);
    }


    onGameCreated(data) {
        const gameCreator = data.userCreatedGame;
        const joinButton = chat.buildJoinButton(gameCreator.id);

        const game = new gameClass.Game(data.gameId, chat.userSocket,
            gameCreator, true);

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

    onUpdateUserSocket(data) {
        console.log(data);
        if (data.id == chat.user.id) {
            chat.userObj.user = data;
            chat.user = chat.userObj.user;
        }
    }

    onGetUsers(data) {
        // let $userNameItems = "";
        chat.$usersList.html("");
        const usersList = data.usersList;
        usersList.forEach(function (user) {
            const $userNameItem = $('<li/>')
                .addClass("list-group-item")
                .addClass("user")
                .attr("id", user.id)
                .html(user.username);
            data.games.some(function (game) {
                if (user.socket_id == game.socket_created) {
                    console.log(game);
                    const joinButton = chat.buildJoinButton(user.id);
                    joinButton.on('click', function () {
                        const gameObj = new gameClass.Game(game.id, chat.userSocket,
                            user);
                        gameObj.onJoinGame(chat.user, chat.userSocket.id);
                    });
                    $userNameItem.append(joinButton);
                    return true;
                }
            });
            chat.$usersList.append($userNameItem);
        });
    }

    onGetHighScores(data) {
        // let $userNameItems = "";
        chat.$highScores.html("");
        const usersList = data.usersList;
        usersList.forEach(function (score) {
            const highScoreItem = $('<li/>')
                .addClass("score-list");
            const $name = $('<div/>')
                .addClass("score-name")
                .html(score.username);
            const $score = $('<div/>')
                .addClass("score")
                .html(score.score);
            highScoreItem.append($name);
            highScoreItem.append($score);

            chat.$highScores.append(highScoreItem)
        });
    }


    buildJoinButton(userID) {
        return $('<button />')
            .addClass('btn-join')
            .addClass('btn-sm')
            .addClass('btn-primary')
            .addClass('pull-right')
            .attr("id", userID)
            .text('Join Game');
    }


}

module.exports = {Chat};
