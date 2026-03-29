import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import ProductCard from '../components/common/ProductCard';
// import { products } from '../data/products';
import { ArrowRight, Zap, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/products');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data.filter(p => p && (p.isTrending || p.isNew)).slice(0, 4));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
        >
            <Hero />

            {/* Features Section */}
            <section className="py-20 bg-secondary/20">
                <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
                    {[
                        { icon: Zap, title: 'FAST DELIVERY', desc: 'Get your shoes in 2-3 business days with express shipping.' },
                        { icon: Shield, title: 'SECURE PAYMENT', desc: '100% secure payment processing with encrypted transactions.' },
                        { icon: RotateCcw, title: 'EASY RETURNS', desc: 'Not the right fit? Return within 30 days for a full refund.' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="flex flex-col items-center text-center space-y-4 p-8 glass rounded-3xl"
                        >
                            <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                                <feature.icon size={32} />
                            </div>
                            <h3 className="font-black tracking-widest text-sm">{feature.title}</h3>
                            <p className="text-foreground/60 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <span className="text-accent font-black uppercase tracking-[0.2em] text-xs">Featured</span>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mt-2">Trending Now</h2>
                        </div>
                        <Link to="/products">
                            <motion.button
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-2 font-bold hover:text-accent transition-colors underline underline-offset-8"
                            >
                                VIEW ALL PRODUCTS <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            <div className="col-span-full flex justify-center py-20">
                                <Loader2 size={40} className="animate-spin text-accent" />
                            </div>
                        ) : products.map((product, i) => (
                            <ProductCard key={product.id || product._id} product={product} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-[500px] rounded-[3rem] overflow-hidden bg-foreground text-background"
                    >
                        <img
                            src="/images/urban_sneakers_feet.png"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                            alt="Promotion"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
                            <motion.h2
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none"
                            >
                                Join the <br /> <span className="text-accent">Revolution</span>
                            </motion.h2>
                            <p className="max-w-xl text-lg text-background/80 font-medium">
                                Smarter technology, better comfort, and the style you deserve. Sign up for our newsletter and get 20% off your first order.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-accent text-white px-10 py-5 rounded-full font-black uppercase tracking-widest"
                            >
                                SUBSCRIBE NOW
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;
