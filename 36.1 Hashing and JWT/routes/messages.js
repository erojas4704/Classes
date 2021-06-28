const express = require('express');
const ExpressError = require('../expressError');
const { ensureLoggedIn } = require('../middleware/auth');
const router = new express.Router();
const Message = require('../models/Message');

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await Message.get(id);
        return res.json({message});
    } catch (err) {
        return next(err);
    }
})



/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const { to_username, body } = req.body;
        const message = await Message.create(req.user, to_username, body);
        return res.json({message});
    } catch (err) {
        return next(err);
    }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params
        let message = await Message.get(id);
        if (message.to_user == req.user.username) {
            message = await Message.markRead(id);
        }else{
            throw new ExpressError("Not the rightful recipient of this message", 401);
        }
        return res.json({message});
    }catch(err){
        return next(err);
    }
});

module.exports = router;
