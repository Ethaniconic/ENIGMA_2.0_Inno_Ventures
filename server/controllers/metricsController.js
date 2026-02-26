// @desc    Get model accuracy report metrics
// @route   GET /api/metrics
// @access  Public (for demo purposes)
exports.getMetrics = (req, res, next) => {
    try {
        const metricsData = {
            overallAccuracy: 92.4,
            sensitivity: 94.1,
            specificity: 89.8,
            aucRoc: 0.96,
            confusionMatrix: {
                trueNegative: 1245,
                falsePositive: 142,
                falseNegative: 48,
                truePositive: 894
            },
            rocCurve: [
                { fpr: 0, tpr: 0 },
                { fpr: 0.1, tpr: 0.65 },
                { fpr: 0.2, tpr: 0.82 },
                { fpr: 0.3, tpr: 0.91 },
                { fpr: 0.4, tpr: 0.94 },
                { fpr: 0.6, tpr: 0.97 },
                { fpr: 0.8, tpr: 0.99 },
                { fpr: 1, tpr: 1 }
            ]
        };

        res.status(200).json({ success: true, data: metricsData });
    } catch (err) {
        next(err);
    }
};
