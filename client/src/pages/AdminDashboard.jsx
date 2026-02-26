import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Users, Stethoscope, ShieldCheck, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const ROLE_ICON = {
    user: <Users size={14} />,
    doctor: <Stethoscope size={14} />,
    admin: <ShieldCheck size={14} />,
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users/recent');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };
        fetchUsers();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const counts = {
        total: users.length,
        patients: users.filter(u => u.role === 'user').length,
        doctors: users.filter(u => u.role === 'doctor').length,
    };

    const roleLabel = (role) => {
        const map = { user: 'Patient', doctor: 'Doctor', admin: 'Admin' };
        const color = { user: 'var(--primary)', doctor: '#6366f1', admin: 'var(--warning)' };
        return (
            <span style={{ fontSize: 11, fontWeight: 600, color: color[role], display: 'flex', alignItems: 'center', gap: 4 }}>
                {ROLE_ICON[role]} {map[role]}
            </span>
        );
    };

    return (
        <div className="dashboard-page">
            <nav className="dash-nav">
                <div className="dash-nav-brand"><span>🩺</span> CarePortal</div>
                <div className="dash-nav-right">
                    <span className="dash-role-badge">Admin</span>
                    <button className="btn-logout" onClick={handleLogout}>
                        <LogOut size={14} style={{ display: 'inline', marginRight: 4 }} /> Logout
                    </button>
                </div>
            </nav>

            <main className="dash-main">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="dash-welcome">
                        <h2>Admin Panel 🛡️</h2>
                        <p>Welcome, {user.name || 'Admin'}. Manage users and platform activity.</p>
                    </div>

                    {/* Stats */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-number">{counts.total}</div>
                            <div className="stat-label">Total Users</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number" style={{ color: '#6366f1' }}>{counts.doctors}</div>
                            <div className="stat-label">Doctors</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{counts.patients}</div>
                            <div className="stat-label">Patients</div>
                        </div>
                    </div>

                    {/* User List */}
                    <p className="dash-section-title">Registered Users</p>
                    <div className="dash-card">
                        {users.map(u => (
                            <div key={u._id} className="list-item">
                                <div className="list-avatar">{u.name.charAt(0).toUpperCase()}</div>
                                <div className="list-info">
                                    <div className="list-name">{u.name}</div>
                                    <div className="list-meta">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                                </div>
                                {roleLabel(u.role)}
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <p className="dash-section-title">Management</p>
                    <div className="quick-actions">
                        <button className="action-btn">
                            <div className="action-icon"><Users size={18} /></div>
                            Manage Users
                        </button>
                        <button className="action-btn">
                            <div className="action-icon"><BarChart2 size={18} /></div>
                            View Reports
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboard;
