const express = require("express");
const router = new express.Router();
const {items, addItem, getItem, updateItem, deleteItem} = require('./fakedb.js');

router.get('/', (req, res) => {
    return res.status(200).json(items);
});

router.post('/', (req, res) => {
    let item = req.body;
    addItem(item);
    return res.status(200).json({
        added: item
    });
});

router.get('/:name', (req, res) => {
    let name = req.params['name'];
    let item = getItem(name);

    return res.status(200).json(item);
});

router.patch('/:name', (req, res) => {
    let name = req.params['name'];
    let item = updateItem(name, req.body);

    return res.status(200).json({
        updated: item
    });
});

router.delete('/:name', (req, res) => {
    let name = req.params['name'];
    let isDeleted = deleteItem(name);

    return res.status(200).json({
        message: isDeleted? "deleted": "not deleted"
    });
});

module.exports = router;