// @desc    Get validation framework documentation
// @route   GET /api/validation
// @access  Public (for demo purposes)
exports.getValidationContent = (req, res, next) => {
    try {
        const validationData = {
            title: "Clinical Validation Framework",
            content: `
# Clinical Validation Framework

A comprehensive overview of our clinical validation methodology, ensuring AI systems operate ethically, fairly, and accurately across diverse demographics.

## Retrospective & Prospective Studies
Our models were initially trained using heavily curated retrospective data gathered from leading global repositories including the Kaggle Cervical Cancer dataset and the Coimbra Breast Cancer dataset. We utilized specific oversampling techniques (SMOTE) to mathematically balance class distributions. Currently, we are designing a multi-center non-diagnostic prospective study to compare the AI-generated triage scores actively against live clinician diagnoses.

## Key Performance Indicators (KPIs)
* **Sensitivity (Recall):** Prioritized over specificity to minimize False Negatives in a primary triage screening setting.
* **Area Under Curve (AUC-ROC):** The primary threshold requirement for deployment is >=0.85 across all demographic subsets.
* **Inference Latency:** Required to return prediction matrices and SHAP/Grad-CAM overlays in under 3.5 seconds.

## Bias Mitigation & Ethical AI
AI explainability is strictly enforced via SHAP (for tabular data) and Grad-CAM (for medical imaging). This "human-in-the-loop" approach ensures the machine learning subsystem cannot make black-box rulings. Model fairness parity is tracked across age bands and gender, with active guardrails penalizing disproportionate variance during the retraining pipeline.
            `
        };

        res.status(200).json({ success: true, data: validationData });
    } catch (err) {
        next(err);
    }
};
