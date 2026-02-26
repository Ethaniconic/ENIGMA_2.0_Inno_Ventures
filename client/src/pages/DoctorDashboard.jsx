import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Database } from 'lucide-react';
import InputSections from '../components/dashboard/InputSections';
import ResultsDisplay from '../components/dashboard/ResultsDisplay';

const DoctorDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [assessmentMode, setAssessmentMode] = useState(false);
    const [results, setResults] = useState(null);

    const handleGenerateMockRisk = (e) => {
        e.preventDefault();
        // MOCK AI PROCESSING
        setTimeout(() => {
            setResults({
                riskScore: 0.78,
                riskLevel: "High",
                biomarkerContributions: [
                    { name: "WBC", value: 0.3 },
                    { name: "Platelets", value: -0.1 },
                    { name: "Glucose", value: 0.15 },
                    { name: "Insulin", value: 0.4 },
                ],
                historyContributions: [
                    { factor: "Smoking", impact: "positive" },
                    { factor: "Family History", impact: "positive" }
                ]
            });
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome, Dr. {user.name || 'Doctor'} 👨‍⚕️</h2>
                    <p className="text-slate-500 mt-1">Select a patient or start a new clinical assessment.</p>
                </div>
                <div className="flex gap-4">
                    <select className="border border-slate-300 rounded-md px-4 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="">-- Select Patient --</option>
                        <option value="1">Riya Desai</option>
                        <option value="2">Arjun Mehta</option>
                    </select>
                    <button
                        onClick={() => { setAssessmentMode(true); setResults(null); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                    >
                        + New Assessment
                    </button>
                </div>
            </div>

            {assessmentMode && !results && (
                <form onSubmit={handleGenerateMockRisk} className="space-y-6">
                    <InputSections />
                    <div className="flex justify-end">
                        <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-slate-800 transition shadow-lg flex items-center gap-2">
                            <Database size={20} /> Generate Risk Assessment
                        </button>
                    </div>
                </form>
            )}

            {results && (
                <ResultsDisplay results={results} onReset={() => { setResults(null); setAssessmentMode(false); }} />
            )}

        </motion.div>
    );
};

export default DoctorDashboard;
