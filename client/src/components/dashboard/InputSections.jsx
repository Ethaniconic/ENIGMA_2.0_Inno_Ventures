import React from 'react';
import { UploadCloud } from 'lucide-react';

const InputSections = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Medical Imaging */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">🩺 Medical Imaging</h3>
                <div className="flex-1 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-slate-500 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer min-h-[200px]">
                    <UploadCloud size={48} className="text-slate-400 mb-3" />
                    <p className="font-medium text-slate-700">Drag & drop DICOM/JPEG files</p>
                    <p className="text-sm mt-1">or click to browse</p>
                </div>
            </div>

            {/* Blood Biomarkers */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">🩸 Blood Biomarkers</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">WBC Count (x10^9/L)</label>
                        <input type="number" step="0.1" className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 7.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Platelets (x10^9/L)</label>
                        <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 250" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hemoglobin (g/dL)</label>
                        <input type="number" step="0.1" className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 13.5" />
                    </div>
                </div>
            </div>

            {/* Patient History */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">📋 Patient History</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                            <input type="number" className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 45" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sex</label>
                            <select className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Smoking Status</label>
                        <select className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Never</option>
                            <option>Former</option>
                            <option>Current</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Family History of Cancer</label>
                        <select className="w-full border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                            <option>No</option>
                            <option>Yes</option>
                        </select>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default InputSections;
