import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Scale, DatabaseZap } from 'lucide-react';

const ValidationFramework = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <h1 className="text-3xl font-bold text-slate-800 mb-3">Clinical Validation Framework</h1>
                <p className="text-lg text-slate-600 border-b border-slate-200 pb-6">
                    A comprehensive overview of our clinical validation methodology, ensuring AI systems operate ethically, fairly, and accurately across diverse demographics.
                </p>

                <div className="mt-8 space-y-8">

                    <section className="flex gap-4">
                        <div className="mt-1 shrink-0"><DatabaseZap size={24} className="text-blue-600" /></div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Retrospective & Prospective Studies</h2>
                            <p className="text-slate-600 leading-relaxed mb-3">
                                Our models were initially trained using heavily curated retrospective data gathered from leading global repositories including the Kaggle Cervical Cancer dataset and the Coimbra Breast Cancer dataset. We utilized specific oversampling techniques (SMOTE) to mathematically balance class distributions.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Currently, we are designing a multi-center non-diagnostic prospective study to compare the AI-generated triage scores actively against live clinician diagnoses.
                            </p>
                        </div>
                    </section>

                    <section className="flex gap-4">
                        <div className="mt-1 shrink-0"><ShieldCheck size={24} className="text-emerald-600" /></div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Key Performance Indicators (KPIs)</h2>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2">
                                <li><strong>Sensitivity (Recall):</strong> Prioritized over specificity to minimize False Negatives in a primary triage screening setting.</li>
                                <li><strong>Area Under Curve (AUC-ROC):</strong> The primary threshold requirement for deployment is ≥0.85 across all demographic subsets.</li>
                                <li><strong>Inference Latency:</strong> Required to return prediction matrices and SHAP/Grad-CAM overlays in under 3.5 seconds.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="flex gap-4">
                        <div className="mt-1 shrink-0"><Scale size={24} className="text-purple-600" /></div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Bias Mitigation & Ethical AI</h2>
                            <p className="text-slate-600 leading-relaxed">
                                AI explainability is strictly enforced via SHAP (for tabular data) and Grad-CAM (for medical imaging). This "human-in-the-loop" approach ensures the machine learning subsystem cannot make black-box rulings. Model fairness parity is tracked across age bands and gender, with active guardrails penalizing disproportionate variance during the retraining pipeline.
                            </p>
                        </div>
                    </section>

                </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-xl flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><CheckCircle2 size={20} className="text-emerald-400" /> Compliance Status</h3>
                    <p className="text-slate-400 text-sm">HIPAA & GDPR Technical Safeguards active.</p>
                </div>
                <button className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 transition">View Certificates</button>
            </div>
        </motion.div>
    );
};

export default ValidationFramework;
