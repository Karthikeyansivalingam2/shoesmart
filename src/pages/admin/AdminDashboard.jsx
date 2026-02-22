import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, Box, ShoppingCart, Users, Activity,
    Plus, Search, Edit2, Trash2, Package, CheckCircle, Clock
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 245000,
        totalOrders: 142,
        totalProducts: 85,
        totalCustomers: 1200
    });

    const recentOrders = [
        { id: '#STP-101', customer: 'Rahul Sharma', amount: '₹2,499', status: 'Delivered', date: '2 hours ago' },
        { id: '#STP-102', customer: 'Priya Singh', amount: '₹1,899', status: 'Shipped', date: '4 hours ago' },
        { id: '#STP-103', customer: 'Amit Patel', amount: '₹5,499', status: 'Packed', date: 'Yesterday' },
    ];

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <motion.div
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-[2.5rem] flex items-center justify-between"
        >
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-2">{title}</p>
                <h3 className="text-3xl font-black">{title.includes('Revenue') ? '₹' : ''}{value.toLocaleString()}</h3>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} text-white shadow-lg`}>
                <Icon size={24} />
            </div>
        </motion.div>
    );

    return (
        <div className="pt-32 pb-24 px-6 min-h-screen">
            <div className="container mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Admin Dashboard</h1>
                        <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs mt-3">Welcome back, Super Admin</p>
                    </div>
                    <button className="bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-foreground transition-all shadow-xl shadow-accent/20">
                        <Plus size={18} /> Add New Product
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <StatCard title="Total Revenue" value={stats.totalRevenue} icon={Activity} color="bg-green-500" />
                    <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="bg-blue-500" />
                    <StatCard title="Total Products" value={stats.totalProducts} icon={Box} color="bg-purple-500" />
                    <StatCard title="Total Customers" value={stats.totalCustomers} icon={Users} color="bg-orange-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Orders Table */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black tracking-tighter uppercase">Recent Orders</h2>
                            <button className="text-accent text-[10px] font-black uppercase tracking-widest underline">View All</button>
                        </div>
                        <div className="glass rounded-[3rem] overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-secondary/30">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Order ID</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Customer</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Amount</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-t border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
                                            <td className="px-8 py-6 font-black text-sm">{order.id}</td>
                                            <td className="px-8 py-6 font-bold text-xs uppercase">{order.customer}</td>
                                            <td className="px-8 py-6 font-black text-sm">{order.amount}</td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                                                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Management */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black tracking-tighter uppercase text-center md:text-left">Quick Actions</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: 'Product Inventory', icon: Package, desc: 'Update stock levels', color: 'text-blue-500' },
                                { title: 'Customer Support', icon: Users, desc: 'Manage queries', color: 'text-purple-500' },
                                { title: 'Sales Reports', icon: BarChart3, desc: 'Download GST reports', color: 'text-green-500' },
                            ].map((action, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="glass p-6 rounded-3xl flex items-center gap-5 cursor-pointer hover:border-accent transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                                        <action.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-[10px] leading-none mb-1">{action.title}</h4>
                                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-tight">{action.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Order Progress Placeholder */}
                        <div className="glass p-8 rounded-[2.5rem] space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Live Status Notifications</h4>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                        <Clock size={14} />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-tight leading-relaxed">
                                        New Order <span className="text-accent">#STP-104</span> placed 5 mins ago
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                                        <CheckCircle size={14} />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-tight leading-relaxed">
                                        Delivery person <span className="text-accent">Vikram</span> completed #STP-101
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
