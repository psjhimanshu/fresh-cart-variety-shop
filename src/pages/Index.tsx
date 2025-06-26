
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategorySection } from '@/components/CategorySection';
import { ProductGrid } from '@/components/ProductGrid';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Cart } from '@/components/Cart';
import { CartProvider } from '@/contexts/CartContext';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Scroll to products section
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <Hero />
        <CategorySection onCategorySelect={handleCategorySelect} />
        <ProductGrid initialCategory={selectedCategory} />
        <NewsletterSection />
        <Cart />
      </div>
    </CartProvider>
  );
};

export default Index;
