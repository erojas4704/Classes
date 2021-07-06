"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when an user must be an admin.
 */

function ensureIsAdmin(req, res, next){
  try{
    if(!res.locals.user || !res.locals.user.isAdmin) throw new UnauthorizedError("You must be an admin to do that.");
    return next();
  } catch(err){
    return next(err);
  }
}

/** Middleware to use when an user must access their own information or is an admin
 */

 function ensureHasAccess(req, res, next){
  try{
    if(!res.locals.user || (!res.locals.user.isAdmin && res.locals.user.username != req.params.username )) throw new UnauthorizedError("You do not have the right privilege to access this.");
    return next();
  } catch(err){
    return next(err);
  }
}





module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureIsAdmin,
  ensureHasAccess
};