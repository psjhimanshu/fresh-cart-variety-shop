
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategorySection } from '@/components/CategorySection';
import { ProductGrid } from '@/components/ProductGrid';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Footer } from '@/components/Footer';
import { Cart } from '@/components/Cart';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistProvider';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery(''); // Clear search when selecting category
    // Scroll to products section
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null); // Clear category when searching
    // Scroll to products section
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen bg-white">
          <Header onSearch={handleSearch} onCategorySelect={handleCategorySelect} />
          {!searchQuery && <Hero />}
          {!searchQuery && <CategorySection onCategorySelect={handleCategorySelect} />}
          <ProductGrid 
            initialCategory={selectedCategory} 
            searchQuery={searchQuery}
          />
          {!searchQuery && <NewsletterSection />}
          <Footer />
          <Cart />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
};

export default Index;
