import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Zap, User, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const from = location.state?.from?.pathname || '/admin';

    // Redirect if already logged in as admin
    React.useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Force admin login logic
        if (formData.email === 'admin' && formData.password === 'admin123') {
            login({ email: 'admin', password: 'admin123', name: 'Super Admin' });
            navigate(from, { replace: true });
        } else {
            setError('ACCESS DENIED: Invalid Administrative Credentials');
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D11919]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-black/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white border-2 border-black/5 p-10 md:p-14 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)]">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-[#D11919] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#D11919]/20 rotate-6 hover:rotate-0 transition-transform duration-500">
                            <ShieldCheck size={40} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase text-black mb-3">Admin Terminal</h1>
                        <div className="flex items-center justify-center gap-3">
                            <p className="text-[10px] font-black tracking-[0.5em] text-[#D11919] uppercase">SYSTEM ACCESS // 2026</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#D11919] ml-1">Identity_String</label>
                            <div className="relative group">
                                <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#D11919] transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="ADMIN_ID"
                                    className="w-full bg-black/[0.03] border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-6 text-[13px] font-black uppercase tracking-widest text-black focus:outline-none focus:border-[#D11919]/20 focus:bg-white transition-all placeholder:text-black/10 shadow-inner"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#D11919] ml-1">Security_Key</label>
                            <div className="relative group">
                                <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#D11919] transition-colors" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-black/[0.03] border-2 border-transparent rounded-[1.5rem] pl-16 pr-6 py-6 text-sm font-black text-black focus:outline-none focus:border-[#D11919]/20 focus:bg-white transition-all placeholder:text-black/10 shadow-inner"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-50 border-2 border-red-100 p-5 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-[0.2em] text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-black text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 shadow-2xl hover:bg-[#D11919] transition-all duration-300"
                        >
                            Establish Link <ArrowRight size={20} />
                        </motion.button>
                    </form>

                    <div className="mt-14 pt-10 border-t border-black/5">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                                    <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">SECURE_LINK: OK</span>
                                </div>
                                <Link 
                                    to="/login"
                                    className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em] hover:text-[#D11919] transition-all flex items-center gap-3 group"
                                >
                                    <User size={14} className="group-hover:scale-110 transition-transform text-[#D11919]" /> Customer Login
                                </Link>
                            </div>
                            <Link to="/" className="flex items-center justify-center gap-3 text-[10px] font-black text-black/10 uppercase tracking-[0.5em] hover:text-black transition-all py-4 border-t border-black/5 group">
                                <Globe size={14} className="group-hover:rotate-12 transition-transform" /> BACK TO STORE
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-center flex items-center justify-center gap-6 text-black/10 font-black text-[11px] uppercase tracking-[0.6em]">
                    <div className="h-px w-10 bg-black/10" />
                    Encrypted Session
                    <div className="h-px w-10 bg-black/10" />
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
