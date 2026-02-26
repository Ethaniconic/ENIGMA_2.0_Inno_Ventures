const express = require('express');
const {
    createAssessment,
    getAssessmentById,
    getPatientAssessments
} = require('../controllers/assessmentController');
const upload = require('../middleware/upload');

const router = express.Router();

router
    .route('/')
    .post(upload.single('image'), createAssessment);

router
    .route('/:id')
    .get(getAssessmentById);

router
    .route('/patient/:patientId')
    .get(getPatientAssessments);

module.exports = router;
