/** Database connection for messagely. */


const pg = require("pg");
const { DB_URI } = require("./config");

const db = new pg.Client(DB_URI);

db.connect();


module.exports = db;