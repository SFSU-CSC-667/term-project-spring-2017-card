const promise = require('bluebird');

let options = {
    promiseLib: promise
};

const pgp = require('pg-promise')(options);

const localDB = "postgres://chengjiu:password@localhost:5432/battleship";

const battleshipDB = pgp(process.env.DATABASE_URL || localDB);

module.exports = {battleshipDB};
