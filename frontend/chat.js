const events = require('../constants/events');

let chat;
var me ='';
class Chat {
    constructor(user, socket) {
        chat = this;
        this.user = user.user;
        this.userObj = user;
        this.userSocket = socket;
        this.$highScores = $('#highscore');

        this.bindEvents();
        this.bindSocketEvents();

        this.userSocket.emit(events.USER_JOINED, chat.user);
    }

    bindEvents() {
        $('form#chat-form').submit(function (event) {
            event.preventDefault();
            chat.onMessageSubmit('#message', events.MESSAGE_SEND);
        });
    }

    onMessageReceived(msg, selector) {
        var from = msg.user.username;
        var color = (from == me) ? 'green' : '#009afd';
        from = (from == me) ? 'Me' : msg.user.username;
        $(selector).append('<p style= "color:' + color + '"">'+ from  + ': ' + msg.message + "<p/>")
        console.log("message received ", msg)
        $(selector).animate({scrollTop: $(selector).prop("scrollHeight")}, 500);
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
        this.userSocket.on(events.MESSAGE_SEND, function (messageData) {
            chat.onMessageReceived(messageData, '#messages')
        });
        this.userSocket.on(events.GET_HIGH_SCORES, chat.onGetHighScores);
        this.userSocket.on(events.UPDATE_USER_SOCKET, chat.onUpdateUserSocket);
    }


    onUpdateUserSocket(data) {
        console.log(data);
        if (data.id == chat.user.id) {
            chat.userObj.user = data;
            chat.user = chat.userObj.user;
        }
    }

    onGetHighScores(data) {
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
}

module.exports = {Chat};
