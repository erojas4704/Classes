/** Reservation for Lunchly */

const moment = require("moment");
const ExpressError = require("../../35.2 Node-pg Relationships/Handlers");

const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({ id, customerId, numGuests, startAt, notes }) {
    this.id = id;
    this._customerId = customerId;
    this._numGuests = numGuests;
    this._startAt = startAt;
    this._notes = notes;
  }

  set customerId(val) {
      throw new ExpressError("Customer ID cannot be reassigned", 400);
  }

  get customerId(){
    return this._customerId
  }

  set startAt(val) {
    if (isNaN(new Date(val).getTime())){
      throw new ExpressError("Invalid date.", 400);
    }
    this._startAt = val;
  }

  get startAt() {
    return this._startAt;
  }
  get numGuests() {
    return this._numGuests;
  }

  set numGuests(val) {
    if (val < 1) {
      throw new ExpressError("Reservation can't have less than 1 guest!", 400);
    } else {
      this._numGuests = val;
    }
  }

  get notes() {
    return this._notes;
  }

  set notes(val) {
    if (val)
      this._notes = val;
    else {
      this._notes = "";
    }
  }

  /** formatter for startAt */

  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
      `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
      [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO reservations(customer_id, num_guests, start_at, notes)
          VALUES ($1, $2, $3, $4)
          RETURNING ID`,
        [this.customerId, this.numGuests, this.startAt, this.notes]
      );

      this.id = result.rows[0].id;
    } else {
      const result = await db.query(
        `UPDATE reservations SET customer_id=$1, num_guests=$2, start_at=$3, notes=$4
          WHERE id=$5`,
        [this.customerId, this.numGuests, this.startAt, this.notes, this.id]
      )
    }
  }
}


module.exports = Reservation;
