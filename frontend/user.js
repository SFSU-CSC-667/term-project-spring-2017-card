const events = require('../constants/events')

let thisUser;
let socket;

class User {

    constructor(jsonUser) {
        this.user = jsonUser;
        thisUser = this;
    }
}

module.exports = {User};
