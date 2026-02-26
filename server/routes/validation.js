const express = require('express');
const { getValidationContent } = require('../controllers/validationController');

const router = express.Router();

router.route('/').get(getValidationContent);

module.exports = router;
