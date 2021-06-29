/** User class for message.ly */
const db = require('../db');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config');


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hash = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(`
      INSERT INTO users(username, password, first_name, last_name, phone, join_at, last_login_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING username, password, first_name, last_name, phone`,
      [username, hash, first_name, last_name, phone, new Date(), new Date()]);
    return result.rows[0];
  }


  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    let result = await db.query(`
      SELECT password FROM users
      WHERE username=$1`,
      [username]);

    let hash = result.rows[0].password;
    let success = await bcrypt.compare(password, hash);
    if (success) {
      User.updateLoginTimestamp(username);
    }
    return success;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    let result = await db.query(`
    UPDATE users SET last_login_at=$1
    WHERE username=$2`,
      [new Date(), username]);
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const result = await db.query(`
    SELECT username, first_name, last_name, phone
    FROM users;
    `);

    return result.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(`
    SELECT username, first_name, last_name, phone, join_at, last_login_at
    FROM users WHERE username=$1`,
      [username]);
    if (result.rowCount < 1) {
      throw new ExpressError(`User ${username} could not be found.`, 404);
    }
    return result.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   * 
   * Might not need the second join if you use another conditional after WHERE
   */

  static async messagesFrom(username) {
    const result = await db.query(`
    SELECT id, f.username, body, t.username, t.first_name, t.last_name, t.phone, sent_at, read_at
    FROM users as f
    LEFT JOIN messages ON from_username = f.username
    LEFT JOIN users as t ON to_username = t.username
    WHERE f.username=$1`,
      [username]);
    let test = result.rows.map(r => {
      return {
        id: r.id,
        body: r.body,
        sent_at: r.sent_at,
        read_at: r.read_at,
        to_user: {
          username: r.username,
          first_name: r.first_name,
          last_name: r.last_name,
          phone: r.phone,
          id: r.to_id
        }
      }
    });
    return test;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const result = await db.query(`
    SELECT id, body, f.username, f.first_name, f.last_name, f.phone, sent_at, read_at
    FROM users as t
    LEFT JOIN messages ON to_username = t.username
    LEFT JOIN users as f ON from_username = f.username
    WHERE t.username=$1`,
      [username]);

    return result.rows.map(r => {
      return {
        id: r.id,
        body: r.body,
        sent_at: r.sent_at,
        read_at: r.read_at,
        from_user: {
          username: r.username,
          first_name: r.first_name,
          last_name: r.last_name,
          phone: r.phone,
          id: r.to_id
        }
      }
    });
  }
}


module.exports = User;