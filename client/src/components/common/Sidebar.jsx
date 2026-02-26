import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, FileCheck, BookOpen } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/dashboard/doctor', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/dashboard/doctor/workflow', label: 'Screening Workflow', icon: Activity },
        { path: '/dashboard/doctor/accuracy-report', label: 'Accuracy Report', icon: FileCheck },
        { path: '/dashboard/doctor/validation-framework', label: 'Validation Framework', icon: BookOpen },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shrink-0">
            <div className="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-950">
                <span className="text-lg font-bold tracking-wider text-blue-400">Clinician Portal</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
            <div className="p-4 text-xs font-medium text-slate-500 text-center border-t border-slate-800 bg-slate-950 flex flex-col gap-1">
                <span>&copy; 2026 ECDS v1.0</span>
                <span>Deep Learning Triage</span>
            </div>
        </aside>
    );
};

export default Sidebar;
