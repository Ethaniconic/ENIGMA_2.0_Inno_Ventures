const axios = require('axios');
const logger = require('../utils/logger');

// URL of the Python ML Service (Flask/FastAPI)
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000/api/predict';

/**
 * Calls the external Python ML service for inference.
 * @param {Object} payload 
 * @returns {Object} Prediction results
 */
exports.runInference = async (payload) => {
    try {
        // Uncomment and use this block when Python service is LIVE
        /*
        const response = await axios.post(ML_SERVICE_URL, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
        */

        // For now, simulate a network request to the ML service and return dummy data
        logger.info(`Simulating call to ML service for patient ${payload.patientId}`);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    riskScore: 0.82,
                    riskLevel: "High",
                    heatmapPath: "/uploads/mock-heatmap.jpg",
                    biomarkerContributions: [
                        { name: "WBC", value: 0.28 },
                        { name: "Platelets", value: -0.15 },
                        { name: "Hemoglobin", value: 0.1 },
                        { name: "CRP", value: 0.35 }
                    ],
                    historyContributions: [
                        { factor: "Smoking", impact: "positive" },
                        { factor: "Family History", impact: "positive" }
                    ]
                });
            }, 1200); // simulate 1.2s inference delay
        });

    } catch (error) {
        logger.error(`Error contacting ML Service: ${error.message}`);
        throw new Error('Machine Learning service is currently unavailable.');
    }
};
