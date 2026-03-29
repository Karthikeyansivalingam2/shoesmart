import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24 px-6 min-h-screen"
        >
            <div className="container mx-auto">
                <div className="mb-16">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">Your Wishlist</h1>
                    <p className="text-foreground/40 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Heart size={16} fill="currentColor" className="text-accent" />
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-8 glass rounded-[3rem]">
                        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-foreground/10">
                            <Heart size={48} strokeWidth={1} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Your wishlist is empty</h2>
                            <p className="text-foreground/40 max-w-xs mx-auto font-medium">Save items you love to your wishlist and they'll show up here.</p>
                        </div>
                        <Link to="/products">
                            <button className="bg-foreground text-background px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-accent transition-colors flex items-center gap-3">
                                START SHOPPING <ArrowRight size={20} />
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {wishlist.map((product, i) => (
                                <ProductCard key={product.id} product={product} index={i} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Wishlist;
