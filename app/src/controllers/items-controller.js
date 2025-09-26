const Item = require('../models/item-model');


exports.createItem = async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                item: newItem,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json({
            status: 'success',
            results: items.length,
            data: {
                items,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch items',
        });
    }
};


exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({
                status: 'fail',
                message: 'No item found with that ID',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                item,
            },
        });
    } catch (err) {
        res.status(500).json({status: 'error', message: err.message});
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the modified document
            runValidators: true, // Run schema validators on update
        });
        if (!item) {
            return res.status(404).json({
                status: 'fail',
                message: 'No item found with that ID',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                item,
            },
        });
    } catch (err) {
        res.status(400).json({status: 'fail', message: err.message});
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({
                status: 'fail',
                message: 'No item found with that ID',
            });
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(500).json({status: 'error', message: err.message});
    }
};