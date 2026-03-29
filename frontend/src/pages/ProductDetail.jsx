import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, Shield, Truck, RotateCcw, ChevronDown, ChevronUp, ShoppingCart, Heart } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart, setIsCartOpen } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);

    useEffect(() => {
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
            const productWithSizes = {
                ...foundProduct,
                sizes: foundProduct.sizes || ['6', '7', '8', '9', '10', '11']
            };
            setProduct(productWithSizes);
            setSelectedSize(productWithSizes.sizes[0]);
        }
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) return null;

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24"
        >
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Gallery */}
                    <div className="space-y-4">
                        <motion.div
                            layoutId={`product-image-${product.id}`}
                            className="aspect-square bg-secondary/50 rounded-[3rem] overflow-hidden group relative"
                        >
                            <motion.img
                                src={product.image}
                                className="w-full h-full object-cover p-12 group-hover:scale-110 transition-transform duration-700"
                                alt={product.name}
                            />
                            <button
                                onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                                className="absolute top-8 right-8 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                                <Heart
                                    size={20}
                                    fill={isInWishlist(product.id) ? "currentColor" : "none"}
                                    className={isInWishlist(product.id) ? "text-accent" : "text-foreground"}
                                />
                            </button>
                        </motion.div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square bg-secondary/30 rounded-2xl overflow-hidden cursor-pointer hover:border-accent border-2 border-transparent transition-colors">
                                    <img src={product.image} className="w-full h-full object-cover p-2 opacity-60" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-accent font-black uppercase tracking-[0.2em] text-xs">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className="text-accent" />
                                    ))}
                                    <span className="text-xs font-bold text-foreground/40 ml-2">({product.rating})</span>
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-none">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-black text-accent">₹{product.price.toLocaleString('en-IN')}</p>
                        </div>

                        <p className="text-foreground/60 leading-relaxed mb-10 text-lg">
                            {product.description}
                        </p>

                        {/* Size Selection */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-black uppercase tracking-widest text-sm text-foreground/40">Select Size</h4>
                                <button className="text-[10px] font-black underline uppercase tracking-widest">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-14 rounded-xl font-bold transition-all ${selectedSize === size
                                            ? 'bg-foreground text-background shadow-xl'
                                            : 'bg-secondary hover:bg-foreground/5'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-12">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    addToCart(product, selectedSize);
                                    setIsCartOpen(true);
                                }}
                                className="flex-grow bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-accent/20"
                            >
                                <ShoppingCart size={20} />
                                ADD TO CART
                            </motion.button>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-3 gap-4 p-8 bg-secondary/30 rounded-3xl mb-12">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <Truck size={20} className="text-accent" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Free Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <Shield size={20} className="text-accent" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Authentic</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <RotateCcw size={20} className="text-accent" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-tight">30 Day Return</span>
                            </div>
                        </div>

                        {/* Accordion */}
                        <div className="border-t border-foreground/10">
                            <button
                                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                className="w-full py-6 flex justify-between items-center"
                            >
                                <span className="font-black uppercase tracking-widest text-sm text-foreground/40">Product Features</span>
                                {isAccordionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            <AnimatePresence>
                                {isAccordionOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <ul className="pb-8 space-y-3">
                                            {product.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-foreground/60">
                                                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="py-24 border-t border-foreground/10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Customer Reviews</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex text-accent">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest">Based on 128 reviews</p>
                            </div>
                        </div>
                        <button className="bg-foreground text-background px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent transition-colors">
                            Write a Review
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { name: 'Alex Rivera', date: '2 days ago', rating: 5, comment: 'Hands down the most comfortable sneakers I have ever owned. The cushioning is insane!' },
                            { name: 'Sarah Chen', date: '1 week ago', rating: 4, comment: 'Love the futuristic look. They run slightly large, so maybe size down half a size.' },
                        ].map((review, i) => (
                            <div key={review.name} className="glass p-8 rounded-[2rem] space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-black uppercase tracking-widest text-sm">{review.name}</p>
                                        <p className="text-[10px] text-foreground/40 font-bold uppercase mt-1">{review.date}</p>
                                    </div>
                                    <div className="flex text-accent">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                    </div>
                                </div>
                                <p className="text-foreground/60 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="pt-24 border-t border-foreground/10">
                        <h2 className="text-4xl font-black tracking-tighter uppercase mb-12">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p, i) => (
                                <ProductCard key={p.id} product={p} index={i} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </motion.div>
    );
};

export default ProductDetail;
