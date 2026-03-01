import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const navigate = useNavigate();

    // Smoother 3D Tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-100, 100], [15, -15]);
    const rotateY = useTransform(mouseXSpring, [-100, 100], [-15, 15]);

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        x.set(mouseX - width / 2);
        y.set(mouseY - height / 2);
    }

    function handleMouseLeave() {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: 1200
            }}
            className="group relative bg-secondary/10 backdrop-blur-sm rounded-[2.5rem] border border-foreground/5 overflow-hidden transition-all duration-500 hover:bg-secondary/20 hover:border-accent/20"
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Wishlist Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                }}
                className="absolute top-6 right-6 z-20 w-12 h-12 glass rounded-full flex items-center justify-center transition-all group/heart shadow-xl border border-white/10"
            >
                <Heart
                    size={20}
                    fill={isInWishlist(product.id) ? "currentColor" : "none"}
                    className={`${isInWishlist(product.id) ? "text-accent" : "text-foreground/40"} transition-colors group-hover/heart:text-accent`}
                />
            </motion.button>

            {/* Badge */}
            {product.isNew && (
                <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute top-6 left-6 z-10 bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-2xl shadow-accent/40"
                >
                    New Arrival
                </motion.span>
            )}

            {/* Image Container */}
            <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden flex items-center justify-center p-12" style={{ transform: 'translateZ(80px)' }}>
                    {/* Shadow Blob */}
                    <div className={`absolute bottom-[15%] w-3/4 h-8 bg-black/20 blur-2xl rounded-full transition-all duration-500 ${isHovered ? 'scale-110 opacity-40' : 'scale-100 opacity-20'}`} />

                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-contain select-none pointer-events-none z-10"
                        animate={{
                            scale: isHovered ? 1.15 : 1,
                            rotate: isHovered ? -8 : 0,
                            y: isHovered ? -10 : 0
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 20
                        }}
                        loading="lazy"
                        style={{ filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.15))' }}
                    />

                    {/* Quick View Overlay */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 bg-accent/5 backdrop-blur-[2px] flex items-center justify-center gap-4 z-20"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl"
                                >
                                    <Eye size={24} />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Link>

            {/* Details Content */}
            <div className="p-10 space-y-4 relative z-20" style={{ transform: 'translateZ(40px)' }}>
                <div className="flex justify-between items-center">
                    <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.3em] font-mono">{product.category}</p>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/5 rounded-full text-accent shadow-sm">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-black">{product.rating}</span>
                    </div>
                </div>

                <h3 className="font-black text-2xl tracking-tighter leading-tight group-hover:text-accent transition-colors duration-300">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-secondary/50 overflow-hidden text-[8px] flex items-center justify-center font-bold">
                                {i}+
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{product.reviews} Reviews</span>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-foreground/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest leading-none mb-1">Price</span>
                        <span className="text-3xl font-black tracking-tighter">₹{product.price}</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            const size = product.sizes ? product.sizes[0] : 'Standard';
                            addToCart(product, size);
                            navigate('/checkout');
                        }}
                        className="flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-2xl hover:shadow-accent/40"
                    >
                        <ShoppingCart size={18} />
                        <span>ADD TO BAG</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
