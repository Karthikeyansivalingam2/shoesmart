import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    // 3D Tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
            className="group relative bg-secondary/30 rounded-[2.5rem] overflow-hidden transition-colors hover:bg-secondary/50"
        >
            {/* Wishlist Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                }}
                className="absolute top-6 right-6 z-20 w-10 h-10 glass rounded-full flex items-center justify-center transition-colors group/heart shadow-lg"
            >
                <Heart
                    size={18}
                    fill={isInWishlist(product.id) ? "currentColor" : "none"}
                    className={`${isInWishlist(product.id) ? "text-accent" : "text-foreground/40"} transition-colors group-hover/heart:text-accent`}
                />
            </button>
            {/* Badge */}
            {product.isNew && (
                <span className="absolute top-6 left-6 z-10 bg-accent text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-accent/20">
                    New Arrival
                </span>
            )}

            {/* Image Container */}
            <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden flex items-center justify-center p-8 bg-secondary/10" style={{ transform: 'translateZ(50px)' }}>
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-2xl"
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                            rotate: isHovered ? -5 : 0
                        }}
                        transition={{ duration: 0.4 }}
                        loading="lazy"
                    />

                    {/* Overlays/Actions */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center gap-4"
                            >
                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl"
                                >
                                    <Eye size={20} />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Link>

            {/* Details */}
            <div className="p-8 space-y-3" style={{ transform: 'translateZ(30px)' }}>
                <div className="flex justify-between items-start">
                    <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">{product.category}</p>
                    <div className="flex items-center gap-1 text-accent">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-black">{product.rating}</span>
                    </div>
                </div>

                <h3 className="font-bold text-xl leading-tight group-hover:text-accent transition-colors">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="flex justify-between items-center pt-4">
                    <span className="text-2xl font-black">₹{product.price}</span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product, product.sizes[0])}
                        className="flex items-center gap-3 bg-foreground text-background px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-accent hover:text-white"
                    >
                        <ShoppingCart size={16} />
                        <span>ADD TO BAG</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
