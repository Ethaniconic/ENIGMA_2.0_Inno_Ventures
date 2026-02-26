import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

const AccuracyReport = () => {
    // Mock ROC Curve data
    const rocData = [
        { fpr: 0, tpr: 0 },
        { fpr: 0.1, tpr: 0.65 },
        { fpr: 0.2, tpr: 0.82 },
        { fpr: 0.3, tpr: 0.91 },
        { fpr: 0.4, tpr: 0.94 },
        { fpr: 0.6, tpr: 0.97 },
        { fpr: 0.8, tpr: 0.99 },
        { fpr: 1, tpr: 1 }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Model Accuracy Report</h2>
                    <p className="text-slate-500 mt-1">Live metrics from the production AI triage models.</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-md font-medium hover:bg-slate-200 transition">
                    <Download size={18} /> Download Full PDF
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Overall Accuracy</p>
                    <p className="text-4xl font-bold text-blue-600">92.4%</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Sensitivity (Recall)</p>
                    <p className="text-4xl font-bold text-green-600">94.1%</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Specificity</p>
                    <p className="text-4xl font-bold text-purple-600">89.8%</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">AUC-ROC</p>
                    <p className="text-4xl font-bold text-indigo-600">0.96</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ROC Curve Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">ROC Curve</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={rocData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="fpr" type="number" domain={[0, 1]} label={{ value: 'False Positive Rate', position: 'insideBottomRight', offset: -5 }} />
                                <YAxis dataKey="tpr" type="number" domain={[0, 1]} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }} />
                                <LineTooltip />
                                <Line type="monotone" dataKey="tpr" stroke="#2563eb" strokeWidth={3} dot={false} />
                                {/* Diagonal reference line */}
                                <Line type="linear" dataKey="fpr" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Confusion Matrix (Mock Visual) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Confusion Matrix</h3>
                    <div className="flex flex-col items-center justify-center h-72">
                        <div className="grid grid-cols-2 gap-2 w-full max-w-sm text-center">
                            <div className="bg-blue-100 p-4 rounded text-blue-900 border border-blue-200">
                                <p className="text-xs font-semibold mb-1">True Negative</p>
                                <p className="text-2xl font-bold">1,245</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded text-red-900 border border-red-200">
                                <p className="text-xs font-semibold mb-1">False Positive</p>
                                <p className="text-2xl font-bold">142</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded text-red-900 border border-red-200">
                                <p className="text-xs font-semibold mb-1">False Negative</p>
                                <p className="text-2xl font-bold">48</p>
                            </div>
                            <div className="bg-blue-100 p-4 rounded text-blue-900 border border-blue-200">
                                <p className="text-xs font-semibold mb-1">True Positive</p>
                                <p className="text-2xl font-bold">894</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-6">*Based on cumulative validation dataset tracking logs.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AccuracyReport;
