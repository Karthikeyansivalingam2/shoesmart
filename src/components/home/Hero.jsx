import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="relative h-screen w-full flex items-center overflow-hidden pt-20">
            {/* Background Text */}
            <motion.div
                style={{ y: y1, opacity }}
                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
            >
                <h1 className="text-[20vw] font-black text-foreground/5 tracking-tighter uppercase leading-none">
                    AIR MAX
                </h1>
            </motion.div>

            {/* Content */}
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
                            New Season 2024
                        </span>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
                            Step Into <br />
                            <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8">Future</span>
                        </h2>
                        <p className="max-w-md text-foreground/60 text-lg leading-relaxed mt-6">
                            Experience the next generation of comfort and style with our new Air Max collection. Engineered for the bold.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-wrap items-center gap-6"
                    >
                        <Link to="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-foreground text-background px-8 py-4 rounded-full font-black flex items-center gap-3 transition-colors hover:bg-accent group"
                            >
                                SHOP COLLECTION
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>

                        <button className="flex items-center gap-3 font-bold hover:text-accent transition-colors">
                            <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center group hover:border-accent">
                                <Play size={20} fill="currentColor" className="group-hover:text-accent ml-1" />
                            </div>
                            WATCH FILM
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex gap-12 pt-8 border-t border-foreground/10"
                    >
                        <div>
                            <p className="text-3xl font-black">2.4k+</p>
                            <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Collections</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black">150+</p>
                            <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Stores</p>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Shoe Image */}
                <div className="relative">
                    <motion.div
                        style={{ y: y2 }}
                        initial={{ opacity: 0, scale: 0.8, rotate: -20, x: 100 }}
                        animate={{ opacity: 1, scale: 1, rotate: -15, x: 0 }}
                        transition={{ duration: 1.2, ease: 'circOut' }}
                        className="relative z-10 cursor-grab active:cursor-grabbing"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
                            alt="Hero Shoe"
                            className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] animate-float"
                        />
                    </motion.div>

                    {/* Decorative elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/20 rounded-full blur-[120px] -z-10" />

                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-[10%] right-[10%] w-32 h-32 border-2 border-accent/20 rounded-full flex items-center justify-center p-4 text-center text-[10px] font-bold uppercase tracking-widest"
                    >
                        Premium Quality
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
