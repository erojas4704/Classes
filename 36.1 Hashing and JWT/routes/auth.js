const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const ExpressError = require('../ExpressError');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../config');

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const success = await User.authenticate(username, password);
        if (!success) throw "Invalid password";
        User.updateLoginTimestamp(username);

        const token = jwt.sign({ username }, SECRET_KEY);

        return res.json({ token });
    } catch (e) {
        return next(new ExpressError("Invalid username or password.", 400));
    }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async (req, res, next) => {
    try {
        const user = await User.register(req.body);
        User.updateLoginTimestamp(user.username);
        const token = jwt.sign({ username: user.username }, SECRET_KEY);
        return res.json({ token });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;