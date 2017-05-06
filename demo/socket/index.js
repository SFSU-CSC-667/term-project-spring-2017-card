const socketIo = require('socket.io');
const events = require('../constants/events');
var io;
const db = require('../db/db.js').battleshipDB;

const init = (app, server) => {
    io = socketIo(server);
    app.set('io', io);

    io.on('connection', socket => {

        socket.on('disconnect', data => {
            console.log("user log out");
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


module.exports = {init};
