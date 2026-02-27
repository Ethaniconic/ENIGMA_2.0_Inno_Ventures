import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut, Calendar, Users, Activity, AlertTriangle, CheckCircle, Clock,
    ChevronDown, ChevronUp, ShieldCheck, Stethoscope, Phone, Droplet, Pill,
    FileText, UploadCloud, Info, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const API_URL = 'http://localhost:3000/api';

// ── Design Tokens ─────────────────────────────────────────────────────
const T = {
    bg: '#0a0c18',
    surface: '#111420',
    surface2: '#181d30',
    surface3: '#1e2438',
    border: 'rgba(255,255,255,0.08)',
    borderGlow: 'rgba(99,179,237,0.35)',
    text: '#e2e8f0',
    textMuted: '#64748b',
    textDim: '#94a3b8',
    blue: '#3b82f6',
    blueGlow: 'rgba(59,130,246,0.25)',
    teal: '#06b6d4',
    emerald: '#10b981',
    red: '#ef4444',
    amber: '#f59e0b',
    violet: '#8b5cf6',
};

const riskColors = {
    high: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.4)', text: '#fca5a5' },
    medium: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', text: '#fcd34d' },
    low: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)', text: '#6ee7b7' },
};

const statusColors = {
    pending: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#fcd34d' },
    confirmed: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', text: '#93c5fd' },
    completed: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#6ee7b7' },
    cancelled: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#fca5a5' },
};

// ── Reusable Badge ────────────────────────────────────────────────────
const Badge = ({ colors, children, style = {} }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 10px', borderRadius: 20,
        fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
        background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text,
        ...style
    }}>
        {children}
    </span>
);

// ── Verification Modal ────────────────────────────────────────────────
const VerificationModal = ({ onVerify }) => {
    const [specialization, setSpecialization] = useState('');
    const [degree, setDegree] = useState(null);
    const [cert, setCert] = useState(null);
    const [idDoc, setIdDoc] = useState(null);

    const dz1 = useDropzone({ onDrop: useCallback(f => setDegree(f[0]), []), maxFiles: 1 });
    const dz2 = useDropzone({ onDrop: useCallback(f => setCert(f[0]), []), maxFiles: 1 });
    const dz3 = useDropzone({ onDrop: useCallback(f => setIdDoc(f[0]), []), maxFiles: 1 });

    const canSubmit = specialization && degree && cert && idDoc;

    const inputStyle = {
        width: '100%', padding: '11px 14px', boxSizing: 'border-box',
        background: T.surface2, border: `1px solid ${T.border}`,
        borderRadius: 10, color: T.text, fontSize: 14, fontFamily: 'inherit',
        outline: 'none',
    };

    const dropzoneStyle = (dz) => ({
        border: `1.5px dashed ${dz.isDragActive ? T.blue : 'rgba(255,255,255,0.15)'}`,
        borderRadius: 10, padding: 18, textAlign: 'center',
        background: dz.isDragActive ? 'rgba(59,130,246,0.08)' : T.surface2,
        cursor: 'pointer', transition: 'all 0.2s', marginTop: 6,
    });

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)', zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
        >
            <motion.div
                initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }}
                style={{
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 20, padding: 32, width: '100%', maxWidth: 480,
                    maxHeight: '90vh', overflowY: 'auto',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <ShieldCheck size={26} color={T.blue} />
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>
                        Verify Your Profile
                    </h2>
                </div>
                <p style={{ color: T.textMuted, fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
                    Upload your credentials to activate your oncologist dashboard. One-time process.
                </p>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
                        Specialization
                    </label>
                    <input
                        style={inputStyle}
                        placeholder="e.g. Hematology Oncology"
                        value={specialization}
                        onChange={e => setSpecialization(e.target.value)}
                    />
                </div>

                {[
                    { label: 'Medical Degree', dz: dz1, file: degree },
                    { label: 'Medical Council Certificate', dz: dz2, file: cert },
                    { label: 'Government Photo ID', dz: dz3, file: idDoc },
                ].map(({ label, dz, file }) => (
                    <div key={label} style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
                            {label}
                        </label>
                        <div {...dz.getRootProps()} style={dropzoneStyle(dz)}>
                            <input {...dz.getInputProps()} />
                            {file ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: T.emerald, fontWeight: 600, fontSize: 13 }}>
                                    <CheckCircle size={15} /> {file.name}
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={22} color={T.textMuted} style={{ marginBottom: 6 }} />
                                    <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>Click or drag file here</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    disabled={!canSubmit}
                    onClick={() => onVerify(specialization)}
                    style={{
                        width: '100%', padding: '13px 0', marginTop: 20,
                        background: canSubmit ? T.blue : T.surface3,
                        color: canSubmit ? 'white' : T.textMuted,
                        fontSize: 15, fontWeight: 700, border: 'none',
                        borderRadius: 12, cursor: canSubmit ? 'pointer' : 'not-allowed',
                        transition: 'background 0.2s',
                        boxShadow: canSubmit ? `0 4px 16px ${T.blueGlow}` : 'none',
                        fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                >
                    <ShieldCheck size={16} /> Activate Dashboard
                </button>
            </motion.div>
        </motion.div>
    );
};

// ── Appointment Card ──────────────────────────────────────────────────
const AppointmentCard = ({ appt, index, updateStatus }) => {
    const [expanded, setExpanded] = useState(false);
    const patient = appt.patientId || {};
    const riskKey = (appt.risk_level || 'low').toLowerCase();
    const riskColor = riskColors[riskKey] || riskColors.low;
    const statusKey = appt.status || 'pending';
    const statusColor = statusColors[statusKey] || statusColors.pending;
    const initial = (patient.name || '?')[0].toUpperCase();
    const top3 = (appt.top_factors || []).slice(0, 3);

    const detailFields = [
        { icon: <Droplet size={13} />, label: 'Blood Group', val: patient.bloodGroup || '—' },
        { icon: <Pill size={13} />, label: 'Medications', val: patient.currentMedications || 'None' },
        { icon: <Info size={13} />, label: 'Allergies', val: patient.knownAllergies || 'None' },
        { icon: <FileText size={13} />, label: 'Past Surgeries', val: patient.pastSurgeries || 'None' },
        { icon: <Users size={13} />, label: 'Family History', val: patient.familyHistory || 'None' },
        { icon: <Activity size={13} />, label: 'Symptoms', val: patient.currentSymptoms || 'Not recorded' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            style={{
                background: T.surface, border: `1px solid ${expanded ? 'rgba(59,130,246,0.4)' : T.border}`,
                borderRadius: 16, overflow: 'hidden',
                boxShadow: expanded ? `0 0 0 1px rgba(59,130,246,0.15), 0 8px 32px rgba(0,0,0,0.4)` : 'none',
                transition: 'all 0.25s',
            }}
        >
            {/* Header */}
            <div
                onClick={() => setExpanded(p => !p)}
                style={{
                    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                    cursor: 'pointer',
                    background: expanded ? 'rgba(59,130,246,0.04)' : 'transparent',
                }}
            >
                {/* Avatar */}
                <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: `linear-gradient(135deg, ${T.blue}, ${T.violet})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 800, color: 'white',
                }}>
                    {initial}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>
                        {patient.name || 'Patient Record'}
                    </div>
                    <div style={{ display: 'flex', gap: 14, fontSize: 12, color: T.textMuted, flexWrap: 'wrap' }}>
                        {patient.age && <span>Age {patient.age}</span>}
                        {patient.mobile && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Phone size={11} /> {patient.mobile}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right side */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <Badge colors={riskColor}>{riskKey} risk</Badge>
                    <span style={{ fontSize: 11, color: T.textDim, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={11} /> {appt.date} &nbsp;
                        <Clock size={11} /> {appt.time}
                    </span>
                    <Badge colors={statusColor}>{statusKey}</Badge>
                </div>

                {/* Chevron */}
                <div style={{ color: T.textMuted, marginLeft: 6 }}>
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </div>

            {/* Expanded Detail */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: 20, borderTop: `1px solid ${T.border}`, background: T.surface2 }}>
                            {/* Patient Detail Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
                                {detailFields.map(({ icon, label, val }) => (
                                    <div key={label} style={{
                                        background: T.surface3, border: `1px solid ${T.border}`,
                                        borderRadius: 10, padding: 12,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>
                                            {icon} {label}
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{val}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Risk Score Bar */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: T.textDim, marginBottom: 8 }}>
                                    <span><TrendingUp size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />AI Risk Score</span>
                                    <span style={{ color: riskColor.text }}>
                                        {appt.risk_score ? Number(appt.risk_score).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div style={{ height: 8, background: T.surface3, borderRadius: 6, overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(appt.risk_score || 0, 100)}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        style={{
                                            height: '100%', borderRadius: 6,
                                            background: riskKey === 'high'
                                                ? 'linear-gradient(90deg,#ef4444,#dc2626)'
                                                : riskKey === 'medium'
                                                    ? 'linear-gradient(90deg,#f59e0b,#d97706)'
                                                    : 'linear-gradient(90deg,#10b981,#059669)',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Factor Chips */}
                            {top3.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                                    <span style={{ fontSize: 11, color: T.textMuted, alignSelf: 'center' }}>Key Factors:</span>
                                    {top3.map((f, i) => (
                                        <span key={i} style={{
                                            padding: '3px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                                            background: T.surface3, border: `1px solid ${f.type === 'positive' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                                            color: f.type === 'positive' ? '#fca5a5' : '#6ee7b7',
                                        }}>
                                            {f.type === 'positive' ? '↑' : '↓'} {f.label}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {[
                                    {
                                        label: 'Confirm', icon: <CheckCircle size={14} />, status: 'confirmed',
                                        s: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', color: '#6ee7b7' }
                                    },
                                    {
                                        label: 'Mark Completed', icon: <Stethoscope size={14} />, status: 'completed',
                                        s: { bg: T.blue, border: T.blue, color: 'white' }
                                    },
                                    {
                                        label: 'Cancel', icon: <AlertTriangle size={14} />, status: 'cancelled',
                                        s: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#fca5a5' }
                                    },
                                ].map(({ label, icon, status, s }) => (
                                    <button
                                        key={status}
                                        onClick={() => updateStatus(appt._id, status)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 7,
                                            padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                                            background: s.bg, border: `1px solid ${s.border}`, color: s.color,
                                            cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                                        }}
                                    >
                                        {icon} {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ── Main Dashboard ────────────────────────────────────────────────────
const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [isVerified, setIsVerified] = useState(user.isVerified || false);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (!user._id) { setLoading(false); return; }

        const token = localStorage.getItem('token');
        fetch(`${API_URL}/appointments/doctor/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => { if (d.success) setAppointments(d.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user._id]);

    const updateStatus = (id, status) =>
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));

    const handleVerify = async (spec) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/verify-doctor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ specialization: spec })
            });

            const data = await res.json();
            if (data.success) {
                const updatedUser = { ...user, isVerified: true, specialization: spec };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsVerified(true);
            }
        } catch (err) {
            console.error('Verification failed:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const total = appointments.length;
    const pending = appointments.filter(a => (a.status || 'pending') === 'pending').length;
    const highRisk = appointments.filter(a => (a.risk_level || '').toLowerCase() === 'high').length;

    const filtered = activeTab === 'all'
        ? appointments
        : appointments.filter(a => (a.status || 'pending') === activeTab);

    const initials = (user.name || 'DR').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const navItems = [
        { label: 'All Appointments', tab: 'all', icon: <Calendar size={16} />, count: total },
        { label: 'Pending', tab: 'pending', icon: <Clock size={16} />, count: pending },
        { label: 'Confirmed', tab: 'confirmed', icon: <CheckCircle size={16} /> },
        { label: 'Completed', tab: 'completed', icon: <Activity size={16} /> },
    ];

    const stats = [
        { label: 'Total Patients', value: total, icon: <Users size={20} />, grad: `${T.blue}, ${T.violet}` },
        { label: 'Awaiting Review', value: pending, icon: <Clock size={20} />, grad: `${T.teal}, ${T.emerald}` },
        { label: 'High Risk', value: highRisk, icon: <AlertTriangle size={20} />, grad: `${T.amber}, ${T.red}` },
    ];

    return (
        <div style={{ display: 'flex', background: T.bg, minHeight: '100vh', fontFamily: "'Inter', 'Inter', sans-serif", color: T.text }}>

            {/* ── Verification Modal ── */}
            <AnimatePresence>
                {!isVerified && <VerificationModal onVerify={handleVerify} />}
            </AnimatePresence>

            {/* ══════════════ SIDEBAR ══════════════ */}
            <aside style={{
                width: 256, flexShrink: 0, background: T.surface,
                borderRight: `1px solid ${T.border}`,
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50,
            }}>
                {/* Logo */}
                <div style={{ padding: '24px 20px 18px', borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `linear-gradient(135deg, ${T.blue}, ${T.violet})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Activity size={19} color="white" />
                        </div>
                        <span style={{
                            fontSize: 18, fontWeight: 800,
                            background: `linear-gradient(90deg, #60a5fa, #a78bfa)`,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>
                            CarePortal
                        </span>
                    </div>
                    {/* Doctor Avatar */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', background: T.surface2,
                        borderRadius: 12, border: `1px solid ${T.border}`,
                    }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                            background: `linear-gradient(135deg, ${T.blue}, ${T.teal})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, fontWeight: 800, color: 'white',
                            boxShadow: `0 0 0 3px rgba(59,130,246,0.3)`,
                        }}>
                            {initials}
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
                                Dr. {user.name || 'Specialist'}
                            </div>
                            <div style={{ fontSize: 11, color: T.teal, fontWeight: 500, letterSpacing: '0.4px' }}>
                                ● ONCOLOGIST
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '18px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {navItems.map(({ label, tab, icon, count }) => {
                        const active = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '11px 14px', borderRadius: 10,
                                    width: '100%', textAlign: 'left', cursor: 'pointer',
                                    background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                                    color: active ? T.blue : T.textMuted,
                                    border: active ? `1px solid rgba(59,130,246,0.3)` : '1px solid transparent',
                                    fontWeight: active ? 700 : 500, fontSize: 14,
                                    transition: 'all 0.18s', fontFamily: 'inherit',
                                }}
                            >
                                {icon}
                                <span style={{ flex: 1 }}>{label}</span>
                                {count > 0 && tab !== 'all' && (
                                    <span style={{
                                        background: tab === 'pending' ? T.red : T.blue,
                                        color: 'white', fontSize: 11, fontWeight: 800,
                                        borderRadius: 10, padding: '2px 8px',
                                    }}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{ padding: '14px 12px', borderTop: `1px solid ${T.border}` }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                            padding: '11px 14px', borderRadius: 10,
                            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                            color: '#f87171', fontSize: 14, fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                        }}
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ══════════════ MAIN CONTENT ══════════════ */}
            <main style={{ marginLeft: 256, flex: 1, padding: 32, minHeight: '100vh' }}>
                {/* Topbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: 0, lineHeight: 1.2 }}>
                            {activeTab === 'all' ? 'All Appointments' :
                                activeTab === 'pending' ? 'Pending Review' :
                                    activeTab === 'confirmed' ? 'Confirmed Sessions' : 'Completed Cases'}
                        </h1>
                        <p style={{ fontSize: 14, color: T.textMuted, margin: '5px 0 0' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '8px 16px', background: 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20,
                        fontSize: 13, fontWeight: 600, color: T.emerald,
                    }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.emerald, boxShadow: `0 0 6px ${T.emerald}`, display: 'inline-block' }} />
                        On Duty
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
                    {stats.map(({ label, value, icon, grad }) => (
                        <div key={label} style={{
                            background: T.surface, border: `1px solid ${T.border}`,
                            borderRadius: 16, padding: 22, position: 'relative', overflow: 'hidden',
                            transition: 'transform 0.2s',
                        }}>
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                                background: `linear-gradient(90deg, ${grad})`,
                            }} />
                            <div style={{
                                width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                                background: `linear-gradient(135deg, ${grad})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', opacity: 0.9,
                            }}>
                                {icon}
                            </div>
                            <div style={{ fontSize: 34, fontWeight: 800, color: T.text, lineHeight: 1 }}>{value}</div>
                            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 6, fontWeight: 500 }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Section Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.blue,
                    }}>
                        <Calendar size={18} />
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Patient Queue</span>
                    <span style={{
                        fontSize: 12, color: T.textMuted, padding: '3px 12px',
                        background: 'rgba(255,255,255,0.04)', borderRadius: 10,
                        border: `1px solid ${T.border}`, fontWeight: 500,
                    }}>
                        {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* List */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: 40, height: 40,
                            border: `3px solid ${T.border}`, borderTopColor: T.blue,
                            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{
                        padding: '60px 20px', textAlign: 'center',
                        background: T.surface, border: `1px dashed rgba(255,255,255,0.1)`,
                        borderRadius: 16,
                    }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: 20,
                            background: T.surface2, border: `1px solid ${T.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <Calendar size={32} color={T.textMuted} />
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>
                            No appointments yet
                        </div>
                        <div style={{ fontSize: 14, color: T.textMuted }}>
                            {activeTab === 'all'
                                ? 'When patients book a consultation with you, they will appear here.'
                                : `No ${activeTab} appointments at this time.`}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {filtered.map((appt, idx) => (
                            <AppointmentCard
                                key={appt._id}
                                appt={appt}
                                index={idx}
                                updateStatus={updateStatus}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorDashboard;
