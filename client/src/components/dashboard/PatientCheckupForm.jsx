import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, AlertTriangle, UploadCloud } from 'lucide-react';
import Papa from 'papaparse';

const PatientCheckupForm = () => {
    const [formData, setFormData] = useState({
        name: '', age: '', sex: 'Male', height: '', weight: '', bmi: '',
        smokingStatus: 'Never', packYears: '', alcoholUse: 'None', unitsPerWeek: '',
        occupationalExposure: [], familyHistory: false, relative: [], cancerType: '', priorCancer: false,
        chronicConditions: [], weightLoss: false, fatigue: 1, persistentCough: false,
        bleeding: false, bowelChanges: false,
        wbc: '', rbc: '', hemoglobin: '', hematocrit: '', platelets: '', neutPct: '',
        lymphPct: '', cea: '', ca125: '', crp: '', mcv: '', mch: ''
    });

    const [uploadMode, setUploadMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    // Auto-calculate BMI
    useEffect(() => {
        if (formData.height && formData.weight) {
            const h = parseFloat(formData.height) / 100;
            const w = parseFloat(formData.weight);
            if (h > 0) {
                setFormData(prev => ({ ...prev, bmi: (w / (h * h)).toFixed(1) }));
            }
        }
    }, [formData.height, formData.weight]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMultiCheckbox = (field, value) => {
        setFormData(prev => {
            const current = [...prev[field]];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) };
            } else {
                if (value === 'None') return { ...prev, [field]: ['None'] };
                const filtered = current.filter(item => item !== 'None');
                return { ...prev, [field]: [...filtered, value] };
            }
        });
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const data = results.data[0];
                    if (data) {
                        setFormData(prev => ({
                            ...prev,
                            wbc: data.wbc_count || '',
                            rbc: data.rbc_count || '',
                            hemoglobin: data.hemoglobin || '',
                            hematocrit: data.hematocrit || '',
                            platelets: data.platelet_count || '',
                            neutPct: data.neutrophil_pct || '',
                            lymphPct: data.lymphocyte_pct || '',
                            cea: data.cea_level || '',
                            ca125: data.ca125_level || '',
                            crp: data.crp_level || '',
                            mcv: data.mcv || '',
                            mch: data.mch || ''
                        }));
                    }
                }
            });
        }
    };

    const calculateRatios = () => {
        const wbc = parseFloat(formData.wbc) || 0;
        const neut = parseFloat(formData.neutPct) || 0;
        const lymph = parseFloat(formData.lymphPct) || 0;
        const plat = parseFloat(formData.platelets) || 0;

        let nlr = 0;
        let plr = 0;

        if (wbc > 0 && lymph > 0) {
            const neutCount = (neut / 100) * wbc;
            const lymphCount = (lymph / 100) * wbc;
            nlr = neutCount / lymphCount;
            plr = plat / lymphCount;
        }
        return { nlr: nlr.toFixed(2), plr: plr.toFixed(2) };
    };

    const { nlr, plr } = calculateRatios();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            age: parseInt(formData.age),
            sex: formData.sex,
            bmi: parseFloat(formData.bmi) || 0,
            smoking_status: formData.smokingStatus === 'Never' ? 0 : (formData.smokingStatus === 'Former' ? 1 : 2),
            pack_years: parseFloat(formData.packYears) || 0,
            alcohol_use: formData.alcoholUse === 'None' ? 0 : 1,
            family_history_cancer: formData.familyHistory ? 1 : 0,
            occupational_exposure: formData.occupationalExposure.includes('None') ? 0 : 1,
            wbc_count: parseFloat(formData.wbc) || 0,
            rbc_count: parseFloat(formData.rbc) || 0,
            hemoglobin: parseFloat(formData.hemoglobin) || 0,
            platelet_count: parseFloat(formData.platelets) || 0,
            neutrophil_pct: parseFloat(formData.neutPct) || 0,
            lymphocyte_pct: parseFloat(formData.lymphPct) || 0,
            cea_level: parseFloat(formData.cea) || 0,
            ca125_level: parseFloat(formData.ca125) || 0,
            crp_level: parseFloat(formData.crp) || 0,
            mcv: parseFloat(formData.mcv) || 0,
            mch: parseFloat(formData.mch) || 0,
            prior_cancer_diagnosis: formData.priorCancer ? 1 : 0,
            unexplained_weight_loss: formData.weightLoss ? 1 : 0,
            fatigue_score: parseInt(formData.fatigue) || 1,
            hematocrit: parseFloat(formData.hematocrit) || 0
        };

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to generate prediction from ML service.');
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">New Patient Assessment</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* SECTION 1 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-blue-600 border-b pb-2 mb-4">Section 1: Personal Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="name" placeholder="Full Name" required className="border p-2 rounded w-full" onChange={handleInputChange} />
                        <input name="age" type="number" min="1" max="120" placeholder="Age (Yrs)" required className="border p-2 rounded w-full" onChange={handleInputChange} />
                        <select name="sex" className="border p-2 rounded w-full" onChange={handleInputChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <input name="height" type="number" placeholder="Height (cm)" required className="border p-2 rounded w-full" onChange={handleInputChange} />
                        <input name="weight" type="number" placeholder="Weight (kg)" required className="border p-2 rounded w-full" onChange={handleInputChange} />
                        <input name="bmi" placeholder="BMI (auto)" readOnly value={formData.bmi} className="border p-2 rounded w-full bg-slate-50 text-slate-500 font-bold" />
                    </div>
                </div>

                {/* SECTION 2 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold text-blue-600 border-b pb-2 mb-4">Section 2: Lifestyle & Exposures</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Smoking Status</label>
                            <select name="smokingStatus" className="border p-2 rounded w-full" onChange={handleInputChange}>
                                <option>Never</option>
                                <option>Former</option>
                                <option>Current</option>
                            </select>
                        </div>
                        {formData.smokingStatus !== 'Never' && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Pack Years <span className="text-xs text-slate-400">(packs/day × yrs)</span></label>
                                <input name="packYears" type="number" className="border p-2 rounded w-full" onChange={handleInputChange} />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium mb-1">Alcohol Use</label>
                            <select name="alcoholUse" className="border p-2 rounded w-full" onChange={handleInputChange}>
                                <option>None</option>
                                <option>Occasional</option>
                                <option>Moderate</option>
                                <option>Heavy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Occupational Exposure</label>
                            <div className="flex flex-wrap gap-2 text-sm mt-1">
                                {['Asbestos', 'Benzene', 'Radiation', 'Pesticides', 'None'].map(exp => (
                                    <label key={exp} className="flex items-center gap-1">
                                        <input type="checkbox" checked={formData.occupationalExposure.includes(exp)} onChange={() => handleMultiCheckbox('occupationalExposure', exp)} /> {exp}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 3 & 4 Compressed for brevity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-xl font-bold text-blue-600 border-b pb-2 mb-4">Medical History</h3>
                        <label className="flex items-center gap-2 mb-2">
                            <input name="familyHistory" type="checkbox" onChange={handleInputChange} /> Family History of Cancer?
                        </label>
                        <label className="flex items-center gap-2 mb-2">
                            <input name="priorCancer" type="checkbox" onChange={handleInputChange} /> Prior Cancer Diagnosis?
                        </label>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-xl font-bold text-blue-600 border-b pb-2 mb-4">Recent Symptoms</h3>
                        <label className="flex items-center gap-2 mb-2"><input name="weightLoss" type="checkbox" onChange={handleInputChange} /> Unexplained Weight Loss (3m)</label>
                        <label className="flex items-center gap-2 mb-2"><input name="persistentCough" type="checkbox" onChange={handleInputChange} /> Persistent Cough &gt; 3wks</label>
                        <div className="mt-2">
                            <label className="block text-sm font-medium">Fatigue (1-10)</label>
                            <input name="fatigue" type="range" min="1" max="10" className="w-full" value={formData.fatigue} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>

                {/* SECTION 5 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h3 className="text-xl font-bold text-blue-600">Blood Biomarkers</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-sm">Entry Mode:</span>
                            <button type="button" onClick={() => setUploadMode(false)} className={`px-3 py-1 rounded text-sm ${!uploadMode ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>Manual</button>
                            <button type="button" onClick={() => setUploadMode(true)} className={`px-3 py-1 rounded text-sm ${uploadMode ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>CSV Upload</button>
                        </div>
                    </div>

                    {uploadMode ? (
                        <div className="p-8 border-2 border-dashed border-blue-200 rounded-lg text-center bg-blue-50">
                            <UploadCloud size={48} className="mx-auto text-blue-400 mb-4" />
                            <p className="text-slate-600 font-medium mb-2">Drag & Drop blood test CSV</p>
                            <input type="file" accept=".csv" onChange={handleCSVUpload} className="mx-auto text-sm" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div><label>WBC (4.5-11.0)</label><input name="wbc" type="number" step="0.1" value={formData.wbc} onChange={handleInputChange} className="w-full border p-2 rounded" /></div>
                            <div><label>Platelets (150-400)</label><input name="platelets" type="number" step="0.1" value={formData.platelets} onChange={handleInputChange} className="w-full border p-2 rounded" /></div>
                            <div><label>Hemoglobin (12-17.5)</label><input name="hemoglobin" type="number" step="0.1" value={formData.hemoglobin} onChange={handleInputChange} className="w-full border p-2 rounded" /></div>
                            <div><label>Hematocrit (41-53%)</label><input name="hematocrit" type="number" step="0.1" value={formData.hematocrit} onChange={handleInputChange} className="w-full border p-2 rounded" /></div>
                            <div><label>Neutrophil % (50-70)</label><input name="neutPct" type="number" step="0.1" value={formData.neutPct} onChange={handleInputChange} className="w-full border p-2 rounded" /></div>
                            <div><label>Lymphocyte % (20-40)</label><input name="lymphPct" type="number" step="0.1" value={formData.lymphPct} onChange={handleInputChange} className="w-full border p-2 rounded" /></div>
                            <div><label>CRP (&lt;10)</label><input name="crp" type="number" step="0.1" value={formData.crp} onChange={handleInputChange} className="w-full border p-2 rounded" /></div>
                            <div><label>MCV (80-100)</label><input name="mcv" type="number" step="0.1" value={formData.mcv} onChange={handleInputChange} className="w-full border p-2 rounded" /></div>
                        </div>
                    )}

                    <div className="mt-6 p-4 bg-slate-50 rounded-lg flex items-center gap-6 border border-slate-200">
                        <h4 className="font-bold text-slate-700">Calculated Bio-Markers:</h4>
                        <div className={`font-semibold ${nlr > 3.0 ? 'text-red-500' : 'text-green-600'}`}>NLR Ratio: {nlr} <span className="text-xs text-slate-400">(Risk &gt;3.0)</span></div>
                        <div className={`font-semibold ${plr > 150 ? 'text-red-500' : 'text-green-600'}`}>PLR Ratio: {plr} <span className="text-xs text-slate-400">(Risk &gt;150)</span></div>
                    </div>
                </div>

                {/* SECTION 6 */}
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg font-medium">{error}</div>}

                <div className="text-center pt-4">
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition w-full md:w-auto shadow-lg disabled:opacity-50 flex items-center gap-2 justify-center">
                        <Activity size={20} /> {loading ? "Evaluating Metrics..." : "Calculate ML Risk Score"}
                    </button>
                </div>
            </form>

            {/* RESULTS VISUALIZATION */}
            {results && results.success && (
                <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl shadow-2xl mt-12 text-white">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><ShieldAlert className="text-blue-400" /> Triage Results Generated</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-center bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-sm font-bold tracking-wider mb-2">OVERALL CONFIDENCE RISK</p>
                            <div className={`text-6xl font-black mb-2 ${results.risk_level === 'High' ? 'text-red-500' : results.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {results.risk_score}%
                            </div>
                            <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${results.risk_level === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                                {results.risk_level.toUpperCase()} PROTOCOL
                            </div>
                        </div>

                        <div>
                            <p className="text-slate-400 text-sm font-bold tracking-wider mb-4">EXPLAINABLE AI FACTORS (SHAP)</p>
                            <div className="space-y-3">
                                {results.top_factors && results.top_factors.map((factor, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border-l-4" style={{ borderLeftColor: factor.shap_value > 0 ? '#ef4444' : '#10b981' }}>
                                        <div>
                                            <div className="font-bold text-slate-200">{factor.feature}</div>
                                            <div className="text-xs text-slate-400">Value Recorded: <span className="font-mono text-blue-300">{factor.value}</span></div>
                                        </div>
                                        <div className={`text-sm font-bold ${factor.shap_value > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {factor.impact.toUpperCase()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientCheckupForm;
