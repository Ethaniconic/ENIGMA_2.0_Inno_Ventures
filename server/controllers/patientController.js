const Patient = require('../models/Patient');
const logger = require('../utils/logger');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Clinician)
exports.getPatients = async (req, res, next) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: patients.length, data: patients });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ success: false, error: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: patient });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res, next) => {
    try {
        const patient = await Patient.create(req.body);
        logger.info(`New patient created: ${patient._id}`);
        res.status(201).json({ success: true, data: patient });
    } catch (err) {
        next(err);
    }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res, next) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!patient) {
            return res.status(404).json({ success: false, error: 'Patient not found' });
        }
        res.status(200).json({ success: true, data: patient });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res, next) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ success: false, error: 'Patient not found' });
        }
        logger.info(`Patient deleted: ${req.params.id}`);
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
