import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-secondary/50 pt-20 pb-10 border-t border-foreground/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black tracking-tighter">
                            STEP<span className="text-accent">UP</span>
                        </h3>
                        <p className="text-foreground/60 leading-relaxed">
                            We provide the best shoes for your daily life. From running to formal, we have it all. Stay ahead of the game with StepUp.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ y: -5, color: '#FF5A00' }}
                                    className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center transition-colors hover:border-accent"
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6">Support</h4>
                        <ul className="space-y-4">
                            {['Order Status', 'Shipping & Delivery', 'Returns', 'Payment Options', 'Contact Us'].map(link => (
                                <li key={link}>
                                    <motion.a
                                        href="#"
                                        whileHover={{ x: 5 }}
                                        className="text-foreground/60 hover:text-accent transition-colors"
                                    >
                                        {link}
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6">Company</h4>
                        <ul className="space-y-4">
                            {['About StepUp', 'News', 'Careers', 'Sustainability', 'Investors'].map(link => (
                                <li key={link}>
                                    <motion.a
                                        href="#"
                                        whileHover={{ x: 5 }}
                                        className="text-foreground/60 hover:text-accent transition-colors"
                                    >
                                        {link}
                                    </motion.a>
                                </li>
                            ))}
                            {/* Admin Links */}
                            <li>
                                <Link
                                    to="/admin/login"
                                    className="text-foreground/60 hover:text-accent transition-colors block"
                                >
                                    Admin Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6">Stay Updated</h4>
                        <p className="text-foreground/60 mb-6">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-background border border-foreground/10 px-4 py-3 rounded-lg focus:outline-none focus:border-accent transition-colors"
                            />
                            <button className="absolute right-2 top-2 p-1.5 bg-accent text-white rounded-md hover:scale-105 transition-transform">
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/40">
                    <p>© 2024 STEPUP. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-foreground/80 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground/80 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-foreground/80 transition-colors">Cookies Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
