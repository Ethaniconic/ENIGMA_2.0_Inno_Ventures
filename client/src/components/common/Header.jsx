import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{"name": "Demo Clinician"}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="bg-white shadow border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
            <div className="text-xl font-bold text-blue-600 flex items-center gap-2">
                🩺 Early Cancer Detection System
            </div>
            <div className="flex items-center gap-6">
                <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                        <User size={16} />
                    </div>
                    {user.name}
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition-colors font-medium border border-red-200"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
