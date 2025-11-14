
const express = require('express');
const router = express.Router();
const { exampleHandler } = require('../controllers/exampleController');

router.get('/', exampleHandler);

module.exports = router;
