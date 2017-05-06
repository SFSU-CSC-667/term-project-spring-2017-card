import * as events from "./constants/events"

let thisUser;
let socket;

class User {

    constructor(jsonUser) {
        this.user = jsonUser;
        // this.battleship = battleship;
        // socket = socketIO;
        thisUser = this;

        this.bindSocketEvents()
    }

    bindSocketEvents() {
        // this.clientIO.on(events.MESSAGE_SEND, thisChat.onMessageReceived);
        // this.clientIO.on(events.GET_USERS, thisChat.onGetUsers);
        // this.clientIO.on(events.CREATE_GAME, thisChat.onGameCreated);
        // this.clientIO.on(events.PLAYER_JOINED_GAME, thisChat.onPlayerJoinedGame);
    }
}

module.exports = {User};
