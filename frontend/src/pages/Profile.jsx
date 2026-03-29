import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Package, Settings, LogOut, ChevronRight,
    MapPin, CreditCard, Clock, Star, Bell, ArrowLeft,
    Plus, ExternalLink, Shield, Save, Activity
} from 'lucide-react';

const Profile = () => {
    const { user, logout, updateAuthUser } = useAuth();
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddr, setNewAddr] = useState({ type: 'Home', address: '' });
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchMyOrders = async () => {
            if (!user) return;
            try {
                const res = await fetch('http://localhost:5001/api/orders/myorders', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) setOrders(await res.json());
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchMyOrders();
    }, [user]);

    // Redirect admins directly to the command panel
    React.useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin', { replace: true });
        }
    }, [user, navigate]);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const sections = [
        { id: 'orders', icon: Package, title: 'My Orders', desc: 'Track, return or buy things again', color: 'bg-blue-500' },
        { id: 'addresses', icon: MapPin, title: 'Shipping Addresses', desc: 'Edit or add new addresses', color: 'bg-orange-500' },
        { id: 'payments', icon: CreditCard, title: 'Payment Methods', desc: 'Manage your cards and accounts', color: 'bg-purple-500' },
        { id: 'settings', icon: Settings, title: 'Account Settings', desc: 'Privacy, security and notifications', color: 'bg-gray-500' },
    ];

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

    const renderView = () => {
        switch (activeView) {
            case 'orders':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <button onClick={() => setActiveView('overview')} className="flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors mb-6 text-xs font-black uppercase tracking-widest">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </button>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Purchase History</h2>
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="glass p-12 rounded-[2.5rem] text-center">
                                    <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">No orders found.</p>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order._id} className="glass p-6 rounded-[2rem] flex items-center justify-between group hover:border-accent/40 transition-colors">
                                        <div className="flex gap-6 items-center">
                                            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm uppercase">#{order._id.slice(-6)}</p>
                                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-8">
                                            <div className="hidden md:block">
                                                <p className="text-xs font-black uppercase tracking-widest">{order.status}</p>
                                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-tight">{order.items?.length || 0} Items</p>
                                            </div>
                                            <p className="text-lg font-black">₹{order.totalAmount}</p>
                                            <ChevronRight size={18} className="text-foreground/20 group-hover:text-accent" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                );
            case 'addresses':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <button onClick={() => setActiveView('overview')} className="flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors mb-6 text-xs font-black uppercase tracking-widest">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </button>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black uppercase tracking-tighter">Your Addresses</h2>
                            <button onClick={() => setIsAddingAddress(!isAddingAddress)} className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors">
                                <Plus size={14} /> {isAddingAddress ? 'Cancel' : 'Add New'}
                            </button>
                        </div>

                        {isAddingAddress && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="glass p-8 rounded-[2rem] mb-8 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Type (Home/Work)</label>
                                        <input value={newAddr.type} onChange={e => setNewAddr({...newAddr, type: e.target.value})} className="w-full bg-secondary/30 border border-foreground/5 px-4 py-3 rounded-xl focus:outline-none focus:border-accent font-bold text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Address</label>
                                        <input value={newAddr.address} onChange={e => setNewAddr({...newAddr, address: e.target.value})} className="w-full bg-secondary/30 border border-foreground/5 px-4 py-3 rounded-xl focus:outline-none focus:border-accent font-bold text-xs" />
                                    </div>
                                </div>
                                <button onClick={async () => {
                                    const updated = [...addresses, newAddr];
                                    const res = await fetch('http://localhost:5001/api/auth/profile', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                                        body: JSON.stringify({ addresses: updated })
                                    });
                                    if(res.ok) {
                                        const data = await res.json();
                                        setAddresses(data.addresses);
                                        updateAuthUser({ addresses: data.addresses });
                                        setIsAddingAddress(false);
                                        setNewAddr({ type: 'Home', address: '' });
                                    }
                                }} className="bg-accent text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Save Address</button>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {addresses.length === 0 ? (
                                <p className="col-span-2 text-center py-10 opacity-40 font-bold uppercase text-xs">No addresses saved yet.</p>
                            ) : (
                                addresses.map((addr, i) => (
                                    <div key={i} className={`glass p-8 rounded-[2rem] space-y-4 border ${addr.isDefault ? 'border-accent' : 'border-foreground/5'}`}>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-black uppercase tracking-widest text-sm">{addr.type}</h3>
                                            {addr.isDefault && <span className="bg-accent text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest">Default</span>}
                                        </div>
                                        <p className="text-sm font-medium text-foreground/60 leading-relaxed">{addr.address}</p>
                                        <div className="pt-4 flex gap-4">
                                            <button onClick={async () => {
                                                const updated = addresses.filter((_, idx) => idx !== i);
                                                const res = await fetch('http://localhost:5001/api/auth/profile', {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                                                    body: JSON.stringify({ addresses: updated })
                                                });
                                                if(res.ok) {
                                                    const data = await res.json();
                                                    setAddresses(data.addresses);
                                                    updateAuthUser({ addresses: data.addresses });
                                                }
                                            }} className="text-[10px] font-black uppercase tracking-widest text-foreground/20 hover:text-red-500 transition-all">Delete</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                );
            case 'settings':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <button onClick={() => setActiveView('overview')} className="flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors mb-6 text-xs font-black uppercase tracking-widest">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </button>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Profile Settings</h2>
                        <div className="glass p-10 rounded-[3rem] space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Display Name</label>
                                    <input type="text" className="w-full bg-secondary/30 border border-foreground/5 px-6 py-4 rounded-2xl focus:outline-none focus:border-accent transition-colors font-bold text-sm" defaultValue={user.name} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Email Address</label>
                                    <input type="email" className="w-full bg-secondary/30 border border-foreground/5 px-6 py-4 rounded-2xl focus:outline-none focus:border-accent transition-colors font-bold text-sm" defaultValue={user.email} />
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-foreground/5">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em]">Security</h4>
                                <div className="flex items-center justify-between glass p-4 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <Shield size={20} className="text-accent" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Two-Factor Authentication</p>
                                    </div>
                                    <button className="text-[10px] font-black text-accent uppercase tracking-widest underline">Enable</button>
                                </div>
                            </div>
                            <button className="w-full bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-3">
                                <Save size={18} /> SAVE CHANGES
                            </button>
                        </div>
                    </motion.div>
                );
            default:
                return (
                    <div className="grid gap-4">
                        {sections.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ x: 10 }}
                                onClick={() => setActiveView(item.id)}
                                className="glass p-8 rounded-[2rem] flex items-center justify-between cursor-pointer hover:border-accent transition-colors group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-full bg-accent/5 -skew-x-12 translate-x-16 group-hover:translate-x-8 transition-transform" />
                                <div className="flex items-center gap-6 relative">
                                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors shadow-inner">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black uppercase tracking-widest text-base">{item.title}</h3>
                                        <p className="text-xs text-foreground/40 font-bold mt-1 uppercase tracking-tight">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 relative">
                                    {item.id === 'orders' && (
                                        <span className="bg-accent/10 text-accent text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Recent</span>
                                    )}
                                    <ChevronRight size={20} className="text-foreground/20 group-hover:text-accent transition-colors" />
                                </div>
                            </motion.div>
                        ))}

                        {/* Recent Activity Feed */}
                        <div className="mt-8 space-y-6">
                            <h3 className="text-xl font-black tracking-tighter uppercase px-2">Recent Activity</h3>
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <div className="flex items-center gap-4 px-4 opacity-40">
                                        <Activity size={14} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No recent activity detected.</p>
                                    </div>
                                ) : (
                                    orders.slice(0, 3).map((order) => (
                                        <div key={order._id} className="flex items-center gap-4 px-4">
                                            <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-foreground/40">
                                                <Package size={14} />
                                            </div>
                                            <div className="flex-grow border-b border-foreground/5 pb-4 flex justify-between items-center">
                                                <p className="text-xs font-bold uppercase tracking-tight">Order #{order._id.slice(-6)} {order.status}</p>
                                                <span className="text-[10px] text-foreground/20 font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24 px-6 min-h-screen"
        >
            <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="glass p-8 rounded-[2.5rem] text-center space-y-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-24 bg-accent/10 -z-10" />
                            <div className="relative w-24 h-24 mx-auto mt-4">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-accent/20 border-4 border-background">
                                    {initials}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-background" />
                            </div>

                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter truncate">{user.name}</h2>
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest flex items-center justify-center gap-2 mt-1">
                                    <Mail size={10} /> {user.email}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-foreground/5 space-y-2">
                                <button
                                    onClick={() => setActiveView('overview')}
                                    className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'overview' ? 'bg-foreground text-background shadow-lg' : 'hover:bg-foreground/5 text-foreground/40'}`}
                                >
                                    <User size={14} /> Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveView('orders')}
                                    className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'orders' ? 'bg-foreground text-background shadow-lg' : 'hover:bg-foreground/5 text-foreground/40'}`}
                                >
                                    <Package size={14} /> My Orders
                                </button>
                                {user.role === 'admin' && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all bg-accent/10 text-accent hover:bg-accent hover:text-white"
                                    >
                                        <Activity size={14} /> Admin Panel
                                    </button>
                                )}
                                {user.role === 'delivery' && (
                                    <button
                                        onClick={() => navigate('/delivery')}
                                        className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white"
                                    >
                                        <Package size={14} /> Delivery Panel
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 px-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all text-red-500 hover:bg-red-500/10"
                                >
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        </motion.div>

                        <div className="glass p-6 rounded-[2rem] grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-black text-accent">{orders.length}</p>
                                <p className="text-[8px] font-black uppercase text-foreground/30 tracking-widest">Orders</p>
                            </div>
                            <div className="text-center border-l border-foreground/5">
                                <p className="text-2xl font-black text-accent">0</p>
                                <p className="text-[8px] font-black uppercase text-foreground/30 tracking-widest">Reviews</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Dashboard */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
                                    {activeView === 'overview' ? 'Settings' : activeView}
                                </h1>
                                <p className="text-foreground/40 font-bold uppercase tracking-[0.2em] text-xs mt-2">Manage your personalized shoe experience</p>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <div key={activeView}>
                                {renderView()}
                            </div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
