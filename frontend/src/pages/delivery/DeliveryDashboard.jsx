import React from 'react';
import { motion } from 'framer-motion';
import {
    Package, MapPin, Phone, CheckCircle2,
    Navigation, IndianRupee, Clock, History, LogOut
} from 'lucide-react';

const DeliveryDashboard = () => {
    const assignedOrders = [
        {
            id: '#STP-102',
            customer: 'Priya Singh',
            address: 'H-502, Sky High Apartments, Whitefield, Bangalore - 560066',
            phone: '+91 98765 43210',
            amount: '₹1,899',
            status: 'On the Way'
        },
        {
            id: '#STP-105',
            customer: 'Karan Mehra',
            address: 'No. 24, 4th Cross, Indiranagar, Bangalore - 560038',
            phone: '+91 91234 56789',
            amount: '₹3,250',
            status: 'Picked Up'
        }
    ];

    const stats = [
        { label: 'Total Deliveries', value: '142', icon: CheckCircle2, color: 'text-green-500' },
        { label: 'Today Earnings', value: '₹1,240', icon: IndianRupee, color: 'text-accent' },
        { label: 'Pending Stops', value: '08', icon: Clock, color: 'text-orange-500' }
    ];

    return (
        <div className="pt-32 pb-24 px-6 min-h-screen bg-secondary/10">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Delivery Partner Panel</h1>
                        <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">Active Session: Vikram Singh (ID: D-402)</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="glass px-6 py-3 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all">
                            <History size={16} /> My History
                        </button>
                        <button className="bg-red-500/10 text-red-500 px-6 py-3 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>

                {/* Mobile Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass p-6 rounded-[2rem] flex items-center gap-6">
                            <div className={`w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">{stat.value}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                        <Package className="text-accent" /> Assigned Orders
                    </h2>

                    {assignedOrders.length > 0 ? (
                        <div className="grid gap-6">
                            {assignedOrders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="glass p-8 rounded-[3rem] space-y-6 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 px-8 py-3 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                                        {order.status}
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-accent font-black text-sm">{order.id}</p>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter">{order.customer}</h3>
                                        </div>
                                        <p className="text-2xl font-black">{order.amount}</p>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-foreground/5">
                                        <div className="flex gap-4 items-start">
                                            <MapPin size={18} className="text-foreground/20 shrink-0 mt-1" />
                                            <p className="text-sm font-bold text-foreground/60 leading-relaxed uppercase tracking-tight">
                                                {order.address}
                                            </p>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <Phone size={18} className="text-foreground/20 shrink-0" />
                                            <p className="text-sm font-black tracking-widest text-accent underline cursor-pointer">
                                                {order.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <button className="bg-secondary/50 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
                                            <Navigation size={18} /> Navigate
                                        </button>
                                        <button className="bg-foreground text-background py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-green-500 transition-all">
                                            <CheckCircle2 size={18} /> Mark Delivered
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass p-12 rounded-[3rem] text-center space-y-6">
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-foreground/10">
                                <Package size={40} strokeWidth={1} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">No orders assigned</h3>
                                <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px] mt-2">Take a break or contact manager for assignments.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
