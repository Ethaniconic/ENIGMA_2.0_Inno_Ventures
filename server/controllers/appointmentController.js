const Appointment = require('../models/Appointment');
const User = require('../models/userModel');

const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, risk_level, risk_score, top_factors } = req.body;
        const patientId = req.user?.id || req.body.patientId; // Assuming jwt auth sets req.user

        if (!doctorId || !date || !time) {
            return res.status(400).json({ success: false, message: 'Doctor, date, and time are required.' });
        }

        const newAppointment = await Appointment.create({
            patientId,
            doctorId,
            date,
            time,
            risk_level,
            risk_score,
            top_factors
        });

        res.status(201).json({ success: true, data: newAppointment });
    } catch (error) {
        console.error('Book Appointment Error:', error);
        res.status(500).json({ success: false, message: 'Failed to book appointment' });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const appointments = await Appointment.find({ doctorId })
            .populate('patientId', 'name age mobile bloodGroup currentMedications pastSurgeries knownAllergies familyHistory currentSymptoms')
            .sort({ date: 1, time: 1 });

        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error('Fetch Appointments Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
    }
};

module.exports = { bookAppointment, getDoctorAppointments };
