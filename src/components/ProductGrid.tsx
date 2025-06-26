
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  initialCategory?: string | null;
}

export const ProductGrid = ({ initialCategory }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Update selected category when initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  
  const { data: products, isLoading, error } = useProducts(selectedCategory || undefined, searchQuery || undefined);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center text-red-600">
            <p>Failed to load products. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">
            Featured Products
          </h3>
          {products && products.length > 0 && (
            <p className="text-gray-600">
              Loading products...
            </p>
          )}
        </div>

        <SearchBar onSearch={handleSearch} />
        
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found</p>
            {(selectedCategory || searchQuery) && (
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
