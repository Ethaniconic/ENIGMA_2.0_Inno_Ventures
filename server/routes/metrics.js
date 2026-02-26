const express = require('express');
const { getMetrics } = require('../controllers/metricsController');

const router = express.Router();

router.route('/').get(getMetrics);

module.exports = router;
