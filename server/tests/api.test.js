const request = require('supertest');
const express = require('express');
const metricsRoutes = require('../routes/metrics');
const validationRoutes = require('../routes/validation');

const app = express();
app.use(express.json());
app.use('/api/model-metrics', metricsRoutes);
app.use('/api/validation-framework', validationRoutes);

describe('Backend API Status Tests', () => {

    it('should return 200 OK for /api/model-metrics', async () => {
        const res = await request(app).get('/api/model-metrics');
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.overallAccuracy).toBe(92.4);
    });

    it('should return 200 OK for /api/validation-framework', async () => {
        const res = await request(app).get('/api/validation-framework');
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe("Clinical Validation Framework");
    });

});
