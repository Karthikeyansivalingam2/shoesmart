import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Sun, Moon, Search, User as UserIcon, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const { cartCount, setIsCartOpen } = useCart();
    const { wishlist } = useWishlist();
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/products' },
        { name: 'Collections', path: '/products?filter=trending' },
        { name: 'New Arrivals', path: '/products?filter=new' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                    <motion.div
                        initial={{ rotate: -10 }}
                        whileHover={{ rotate: 10 }}
                        className="w-8 h-8 bg-accent flex items-center justify-center rounded-lg"
                    >
                        <div className="w-4 h-1 bg-white rotate-45" />
                    </motion.div>
                    <span>STEP<span className="text-accent">UP</span></span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors relative group ${location.pathname === link.path ? 'text-accent' : ''
                                }`}
                        >
                            {link.name}
                            <motion.span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"
                                layoutId={location.pathname === link.path ? 'underline' : ''}
                            />
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-5">
                    <button className="hover:text-accent transition-colors">
                        <Search size={20} />
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="hover:text-accent transition-colors"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {isAuthenticated ? (
                        <Link to="/profile" className="flex items-center gap-2 hover:text-accent transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-black text-white shadow-lg border border-background">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="hover:text-accent transition-colors">
                            <UserIcon size={20} />
                        </Link>
                    )}

                    <Link to="/wishlist" className="relative p-2 hover:bg-foreground/5 rounded-full transition-colors group">
                        <Heart size={20} className={wishlist.length > 0 ? 'text-accent fill-accent' : ''} />
                        <AnimatePresence>
                            {wishlist.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 bg-accent text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full"
                                >
                                    {wishlist.length}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    <button
                        className="relative p-2 hover:bg-foreground/5 rounded-full transition-colors"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag size={22} />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 hover:bg-foreground/5 rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-foreground/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-bold uppercase tracking-widest hover:text-accent"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-accent origin-left"
                style={{ scaleX: useScrollProgress() }}
            />
        </nav>
    );
};

// Custom hook for scroll progress (could be in its own file)
function useScrollProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setProgress(window.scrollY / scrollHeight);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return progress;
}

export default Navbar;
