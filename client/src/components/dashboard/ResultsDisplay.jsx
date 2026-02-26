import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

const ResultsDisplay = ({ results, onReset }) => {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">

            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 text-center">
                <div className="flex justify-center mb-4">
                    <ShieldAlert size={64} className="text-red-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800">Risk Assessment: <span className="text-red-600">{results.riskLevel}</span></h3>
                <p className="text-slate-500 mt-2 text-lg">AI Confidence Score: {(results.riskScore * 100).toFixed(1)}%</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Biomarker Contributions (SHAP)</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={results.biomarkerContributions} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Imaging & History Insights</h4>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-center mb-4 flex flex-col items-center justify-center min-h-[120px]">
                        <p className="font-medium">Imaging Heatmap</p>
                        <p className="text-sm">(Grad-CAM visual overlay will appear here)</p>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-700 mb-2">Key Historical Factors:</p>
                        <ul className="space-y-2">
                            {results.historyContributions.map((hc, i) => (
                                <li key={i} className="flex justify-between items-center text-sm p-2 bg-red-50 text-red-800 rounded">
                                    <span>{hc.factor}</span>
                                    <span className="font-bold">{hc.impact.toUpperCase()} IMPACT</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button onClick={onReset} className="flex items-center gap-2 px-6 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition font-medium">
                    <RefreshCcw size={16} /> Start New Assessment
                </button>
            </div>
        </motion.div>
    );
};

export default ResultsDisplay;
