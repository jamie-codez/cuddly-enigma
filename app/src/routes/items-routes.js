const express = require('express');
const itemController = require('../controllers/items-controller');

const router = express.Router();

router
    .route('/')
    .get(itemController.getAllItems)
    .post(itemController.createItem);

router
    .route('/:id')
    .get(itemController.getItemById)
    .put(itemController.updateItem)
    .delete(itemController.deleteItem);

module.exports = router;