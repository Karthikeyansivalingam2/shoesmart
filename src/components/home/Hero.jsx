import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const { scrollY } = useScroll();

    // Smooth scroll transforms
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const rotate = useTransform(scrollY, [0, 1000], [-15, 20]);
    const scale = useTransform(scrollY, [0, 500], [1, 1.2]);

    const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });

    return (
        <section className="relative h-screen w-full flex items-center overflow-hidden pt-20 bg-background">
            {/* Background Animated Text */}
            <motion.div
                style={{ y: y1, opacity }}
                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0"
            >
                <motion.h1
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.05 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-[25vw] font-black text-foreground tracking-tighter uppercase leading-none whitespace-nowrap"
                >
                    STEP UP
                </motion.h1>
            </motion.div>

            {/* Content Container */}
            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                            className="inline-block bg-accent/10 text-accent px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6 backdrop-blur-md border border-accent/10"
                        >
                            Collection 2024
                        </motion.div>

                        <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                            Elevate <br />
                            <span className="text-accent relative inline-block">
                                Your Game
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 1 }}
                                    className="absolute -bottom-2 left-0 w-full h-3 bg-accent/20 origin-left rounded-full"
                                />
                            </span>
                        </h2>

                        <p className="max-w-md text-foreground/60 text-xl leading-relaxed mt-10 font-medium">
                            Engineering the perfect fusion of street style and peak performance. Built for those who never stop.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 1 }}
                        className="flex flex-wrap items-center gap-8"
                    >
                        <Link to="/products">
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 20px 40px rgba(255, 71, 0, 0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-foreground text-background px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-4 transition-all hover:bg-accent group text-xs tracking-widest"
                            >
                                EXPLORE SHOP
                                <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                            </motion.button>
                        </Link>

                        <motion.button
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-4 font-black text-xs tracking-widest hover:text-accent transition-all uppercase"
                        >
                            <div className="relative w-14 h-14 rounded-full border border-foreground/10 flex items-center justify-center group overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                                <Play size={22} fill="currentColor" className="group-hover:text-accent ml-1 transition-colors" />
                            </div>
                            The Experience
                        </motion.button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="flex gap-16 pt-10 border-t border-foreground/5"
                    >
                        <div className="space-y-1">
                            <p className="text-4xl font-black tracking-tighter">50k+</p>
                            <p className="text-[10px] text-foreground/30 font-black uppercase tracking-[0.2em]">Community</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl font-black tracking-tighter">15+</p>
                            <p className="text-[10px] text-foreground/30 font-black uppercase tracking-[0.2em]">Brands</p>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Interactive Shoe */}
                <div className="relative perspective-[1500px]">
                    <motion.div
                        style={{
                            y: springY2,
                            rotate,
                            scale
                        }}
                        initial={{ opacity: 0, scale: 0.5, rotate: -45, x: 200 }}
                        animate={{ opacity: 1, scale: 1, rotate: -15, x: 0 }}
                        transition={{ duration: 1.5, type: "spring", damping: 15 }}
                        className="relative z-10 select-none group"
                    >
                        {/* Interactive floating shoe */}
                        <motion.img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
                            alt="Hero Shoe"
                            className="w-full h-auto z-10"
                            animate={{
                                y: [0, -20, 0],
                                rotate: [-15, -12, -15]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{ filter: 'drop-shadow(0 50px 50px rgba(0,0,0,0.3))' }}
                        />

                        {/* Radial Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-accent/10 rounded-full blur-[120px] -z-10 group-hover:bg-accent/20 transition-colors duration-700" />
                    </motion.div>

                    {/* Draggable/Interactive Callout */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, type: "spring" }}
                        className="absolute bottom-10 right-10 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl z-20 hidden md:block"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-black">
                                4.9
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Rating</p>
                                <p className="text-sm font-black">Top Pick 2024</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
