import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-foreground/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={24} className="text-accent" />
                                <h2 className="text-xl font-black uppercase tracking-widest">Your Bag</h2>
                                <span className="bg-secondary px-2 py-0.5 rounded text-xs font-bold">
                                    {cart.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-secondary rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                    <ShoppingBag size={64} strokeWidth={1} />
                                    <p className="font-bold uppercase tracking-widest">Your bag is empty</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-accent text-sm font-bold underline"
                                    >
                                        START SHOPPING
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        key={`${item.id}-${item.size}`}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="flex gap-4 group"
                                    >
                                        <div className="w-24 h-24 bg-secondary rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover p-2" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h4 className="font-bold text-sm uppercase leading-tight">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.size)}
                                                        className="text-foreground/20 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-foreground/40 mt-1">Size: {item.size}</p>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center border border-foreground/10 rounded-full overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, -1)}
                                                        className="p-1 px-3 hover:bg-secondary transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs font-bold min-w-[20px] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, 1)}
                                                        className="p-1 px-3 hover:bg-secondary transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <p className="font-black">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-foreground/10 bg-secondary/30 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-foreground/40 font-bold uppercase tracking-widest">Subtotal</span>
                                    <span className="text-xl font-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-foreground text-background py-4 rounded-xl font-black flex items-center justify-center gap-3 hover:bg-accent transition-colors group"
                                    >
                                        CHECKOUT
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                                <p className="text-[10px] text-center text-foreground/40 font-bold uppercase tracking-[0.1em]">
                                    Shipping & Taxes calculated at checkout
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
