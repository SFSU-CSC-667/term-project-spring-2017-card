/**
 * Created by dusan_cvetkovic on 11/28/16.
 */

const promise = require('bluebird');

let options = {
    // Initialization Options
    promiseLib: promise
};

const pgp = require('pg-promise')(options);

const dbConnectionString = "postgres://chengjiu:password@localhost:5432/battleship";
// if (process.env.DATABASE_URL){
//     dbConnectionString = process.env.DATABASE_URL;
//     pgp.pg.defaults.ssl = true;
// }
// else{
//     dbConnectionString = "postgres://chengjiu:password@localhost:5432/battleship";
// }


const battleshipDB = pgp(dbConnectionString);

module.exports = {battleshipDB};
