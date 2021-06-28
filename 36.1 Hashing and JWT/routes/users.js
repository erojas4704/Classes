const express = require('express');
const ExpressError = require('../expressError');
const { ensureLoggedIn } = require('../middleware/auth');
const router = new express.Router();
const User = require('../models/user');

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        let users = await User.all();
        res.json(users);
    } catch (err) {
        return next(err);
    }
});



/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureLoggedIn, async (req, res, next) => {
    try {
        let { username } = req.params;
        if(req.query.username != username){
            throw new ExpressError("You are not allowed to view this page.", 401);
        }

        let user = await User.get(username);
        res.json({ user });
    } catch (err) {
        return next(err);
    }
});



/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username', ensureLoggedIn, async (req, res, next) => {
    try {
        let { username } = req.params;
        if(req.query.username != username){
            throw new ExpressError("You are not allowed to view this page.", 401);
        }
        
        let messages = await User.messagesTo(username);
        res.json({ messages });
    } catch (err) {
        return next(err);
    }
});



/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

 router.get('/:username', ensureLoggedIn, async (req, res, next) => {
    try {
        let { username } = req.params;
        if(req.query.username != username){
            throw new ExpressError("You are not allowed to view this page.", 401);
        }
        
        let messages = await User.messagesFrom(username);
        res.json({ messages });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;