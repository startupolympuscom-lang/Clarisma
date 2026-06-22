import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Download, ShoppingBag, ExternalLink, Filter } from 'lucide-react';
import { Product } from '../types';

interface ShopPageProps {
  onBack: () => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ onBack }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const PREDEFINED_CATEGORIES = [
    'Intelligence Library',
    'Professional Toolkit',
    'Clarisma Collection',
    'Curated Experience Bundles'
  ];

  const categories = [
    'All',
    ...PREDEFINED_CATEGORIES.filter(cat => products.some(p => p.category === cat)),
    ...Array.from(new Set(products.map(p => p.category)))
      .filter((cat: string) => !PREDEFINED_CATEGORIES.includes(cat))
  ];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-clarisma-red pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-clarisma-gold hover:text-white transition-colors group w-fit"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center md:text-right"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">Digital Store</h1>
            <p className="text-white/70 italic max-w-sm ml-auto">Empowering resources to help you reclaim your narrative and lead with impact.</p>
          </motion.div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-3 mb-12 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-clarisma-gold text-clarisma-red shadow-lg shadow-clarisma-gold/20' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-clarisma-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-clarisma-gold/50 transition-all group flex flex-col h-full"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-clarisma-gold text-clarisma-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-clarisma-gold transition-colors">{product.title}</h3>
                    <span className="text-2xl font-serif text-clarisma-gold">${product.price}</span>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-6 flex-grow">
                    {product.description}
                  </p>
                  
                  <button 
                    onClick={() => window.open(product.download_url, '_blank')}
                    className="w-full py-4 bg-white/10 hover:bg-clarisma-gold hover:text-clarisma-red text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Get Resource</span>
                    <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
            <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl text-white font-medium">No products found</h3>
            <p className="text-white/40 mt-2">Check back soon for new empowering resources.</p>
          </div>
        )}

        {/* Promotion Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-8 md:p-12 bg-gradient-to-br from-clarisma-gold/20 to-transparent rounded-3xl border border-clarisma-gold/30 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-clarisma-gold/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Want a Bespoke Workshop?</h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Dr. Claris Harbon offers tailored digital resources and virtual workshops for institutions, teams, and individuals. Reach out to discuss your specific needs.
            </p>
            <button 
              onClick={() => onBack()}
              className="px-8 py-4 bg-clarisma-gold text-clarisma-red font-bold rounded-xl hover:bg-white transition-all transform hover:-translate-y-1 shadow-xl shadow-clarisma-gold/20"
            >
              Contact Dr. Claris
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShopPage;
