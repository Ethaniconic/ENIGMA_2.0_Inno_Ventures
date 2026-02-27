const express = require('express');
const router = express.Router();
const { bookAppointment, getDoctorAppointments } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/book', protect, bookAppointment);
router.get('/doctor/:doctorId', protect, getDoctorAppointments);

module.exports = router;
