import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/common/ProductCard';
import { Filter, SlidersHorizontal, Search, Grid, List, X, Loader2 } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState(50000);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = ['All', 'Men', 'Women', 'Kids', 'Running', 'Casual'];

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
            const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const priceMatch = p.price <= priceRange;
            return categoryMatch && searchMatch && priceMatch;
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            return 0;
        });
    }, [products, activeCategory, searchQuery, priceRange, sortBy]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={40} />
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 min-h-screen px-6">
            <div className="container mx-auto">
                <div className="mb-12 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">All Products</h1>
                            <p className="text-foreground/40 font-bold uppercase tracking-widest mt-2">Showing {filteredProducts.length} results from Database</p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:w-64">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                <input type="text" placeholder="Search shoes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-foreground/5 rounded-2xl focus:outline-none focus:border-accent transition-colors" />
                            </div>
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-secondary rounded-2xl hover:bg-accent hover:text-white transition-colors"><Filter size={20} /></button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-12">
                    <aside className="hidden lg:block w-64 space-y-12 shrink-0">
                        <div>
                            <h4 className="font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2"><SlidersHorizontal size={18} /> Sort By</h4>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-4 bg-secondary/50 rounded-2xl border border-foreground/5 focus:outline-none font-bold text-xs uppercase">
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-6"><h4 className="font-black uppercase tracking-widest text-sm">Price Range</h4><span className="text-accent font-black">₹{priceRange}</span></div>
                            <input type="range" min="0" max="50000" step="1000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-accent" />
                        </div>
                    </aside>

                    <div className="flex-grow">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredProducts.map((product, i) => (
                                <ProductCard key={product._id} product={{...product, id: product._id}} index={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Products;
