import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Activity, CheckCircle, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Workflow = () => {
    const steps = [
        {
            title: "Input Patient Data",
            desc: "Upload DICOM images, enter blood biomarker values, and complete the clinical history questionnaire.",
            icon: <UploadCloud size={32} className="text-blue-500" />
        },
        {
            title: "AI Analysis",
            desc: "Our multi-modal Deep Learning engine cross-references the data against thousands of oncology profiles.",
            icon: <BrainCircuit size={32} className="text-purple-500" />
        },
        {
            title: "Review Insights",
            desc: "Examine the generated risk score, imaging heatmaps, and biomarker SHAP values on the dashboard.",
            icon: <Activity size={32} className="text-indigo-500" />
        },
        {
            title: "Clinical Decision Support",
            desc: "Use the explainable AI factors to recommend further screening or clearance for the patient.",
            icon: <CheckCircle size={32} className="text-green-500" />
        }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-8">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-3">Screening Workflow</h1>
                <p className="text-lg text-slate-500">Standard operating procedure for the Early Cancer Detection triage system.</p>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-200 before:to-indigo-200">
                {steps.map((step, index) => (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            {step.icon}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl bg-white shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-lg text-slate-800">Step {index + 1}: {step.title}</h3>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link to="/dashboard/doctor" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg">
                    Go to Dashboard
                </Link>
            </div>
        </motion.div>
    );
};

export default Workflow;
