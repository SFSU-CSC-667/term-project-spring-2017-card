const promise = require('bluebird');

let options = {
    promiseLib: promise
};

const pgp = require('pg-promise')(options);

const dbConnectionString = "postgres://chengjiu:password@localhost:5432/battleship";

const battleshipDB = pgp(dbConnectionString);

module.exports = {battleshipDB};
