import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signup({ 
                name: formData.name, 
                email: formData.email, 
                password: formData.password 
            });
            
            if (res.success) {
                navigate('/profile');
            } else {
                setError(res.message || 'Signup failed');
            }
        } catch (err) {
            setError(err.message || 'Signup error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center relative overflow-hidden"
        >
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />

            <div className="container max-w-lg">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="glass p-10 md:p-12 rounded-[3rem] border border-foreground/10"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Create Account</h1>
                        <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Join the StepUp community</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100/50 border border-red-200 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2 ml-1">
                                <User size={12} /> Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full bg-secondary/30 border border-foreground/5 px-6 py-4 rounded-2xl focus:outline-none focus:border-accent transition-colors font-bold text-sm"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2 ml-1">
                                <Mail size={12} /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full bg-secondary/30 border border-foreground/5 px-6 py-4 rounded-2xl focus:outline-none focus:border-accent transition-colors font-bold text-sm"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2 ml-1">
                                    <Lock size={12} /> Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-secondary/30 border border-foreground/5 px-6 py-4 rounded-2xl focus:outline-none focus:border-accent transition-colors font-bold text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2 ml-1">
                                    <ShieldCheck size={12} /> Confirm
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-secondary/30 border border-foreground/5 px-6 py-4 rounded-2xl focus:outline-none focus:border-accent transition-colors font-bold text-sm"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-1 mb-4">
                            <input type="checkbox" required className="w-4 h-4 rounded accent-accent" />
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-none"> I agree to the <span className="text-accent underline">Terms & Conditions</span></p>
                        </div>

                        <motion.button
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            type="submit"
                            className={`w-full bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-foreground transition-all shadow-xl shadow-accent/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : 'CREATE ACCOUNT'} <ArrowRight size={20} />
                        </motion.button>
                    </form>

                    <p className="mt-10 text-center text-xs font-bold text-foreground/40 uppercase tracking-widest">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent underline underline-offset-4 hover:text-foreground transition-colors">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Signup;
