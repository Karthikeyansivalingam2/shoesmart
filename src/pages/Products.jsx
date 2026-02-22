import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import { Filter, SlidersHorizontal, Search, Grid, List, X } from 'lucide-react';

const Products = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState(20000);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const categories = ['All', 'Running', 'Casual', 'Sports', 'Formal'];

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
            const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const priceMatch = p.price <= priceRange;
            return categoryMatch && searchMatch && priceMatch;
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0;
        });
    }, [activeCategory, searchQuery, priceRange, sortBy]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24 min-h-screen px-6"
        >
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-12 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">All Products</h1>
                            <p className="text-foreground/40 font-bold uppercase tracking-widest mt-2">
                                Showing {filteredProducts.length} results
                            </p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-grow md:w-64">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                <input
                                    type="text"
                                    placeholder="Search shoes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-foreground/5 rounded-2xl focus:outline-none focus:border-accent transition-colors"
                                />
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-3 bg-secondary rounded-2xl hover:bg-accent hover:text-white transition-colors"
                            >
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Category Quick Filter */}
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat
                                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                    : 'bg-secondary text-foreground/60 hover:bg-foreground/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-12">
                    {/* Sidebar Filter (Desktop) */}
                    <aside className="hidden lg:block w-64 space-y-12 shrink-0">
                        <div>
                            <h4 className="font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                <SlidersHorizontal size={18} /> Sort By
                            </h4>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-4 bg-secondary/50 rounded-2xl border border-foreground/5 focus:outline-none font-bold text-xs uppercase"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-black uppercase tracking-widest text-sm">Price Range</h4>
                                <span className="text-accent font-black">₹{priceRange}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="20000"
                                step="500"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full accent-accent"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-foreground/40 mt-2 uppercase">
                                <span>₹0</span>
                                <span>₹20,000</span>
                            </div>
                        </div>

                        <div className="p-8 bg-accent rounded-[2rem] text-white">
                            <h5 className="font-black text-2xl uppercase tracking-tighter leading-none mb-4">Get 20% <br /> Discount</h5>
                            <p className="text-xs font-medium opacity-80 mb-6">Use code: NEW20</p>
                            <button className="bg-white text-accent px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Copy Code
                            </button>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-grow">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProducts.map((product, i) => (
                                    <ProductCard key={product.id} product={product} index={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-foreground/20">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter">No products found</h3>
                                <p className="text-foreground/40 max-w-xs">Try adjusting your filters or search terms to find what you're looking for.</p>
                                <button
                                    onClick={() => { setActiveCategory('All'); setPriceRange(20000); setSearchQuery(''); }}
                                    className="text-accent font-bold underline"
                                >
                                    RESET FILTERS
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Modal */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[90]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed top-0 left-0 h-full w-80 bg-background z-[100] p-8 space-y-12 flex flex-col"
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="font-black uppercase tracking-widest text-lg">Filters</h4>
                                <button onClick={() => setIsSidebarOpen(false)}><X /></button>
                            </div>
                            {/* Reuse filters here if needed */}
                            <div>
                                <h5 className="font-bold mb-4 uppercase text-xs">Price: ₹{priceRange}</h5>
                                <input
                                    type="range"
                                    min="0" max="20000" step="500"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full accent-accent"
                                />
                            </div>
                            <div>
                                <h5 className="font-bold mb-4 uppercase text-xs">Sort By</h5>
                                <select className="w-full p-4 bg-secondary rounded-xl uppercase text-xs font-bold">
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="mt-auto bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-widest"
                            >
                                APPLY FILTERS
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Products;
