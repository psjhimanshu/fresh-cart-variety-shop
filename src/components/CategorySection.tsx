
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

interface CategorySectionProps {
  onCategorySelect?: (categoryId: string) => void;
}

export const CategorySection = ({ onCategorySelect }: CategorySectionProps) => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Skeleton className="w-full h-64" />
                <div className="p-6 text-center">
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories?.slice(0, 3).map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onCategorySelect={onCategorySelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryCard = ({ 
  category, 
  onCategorySelect 
}: { 
  category: any; 
  onCategorySelect?: (categoryId: string) => void; 
}) => {
  const { data: products } = useProducts(category.id);
  const productCount = products?.length || 0;

  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
      onClick={() => onCategorySelect?.(category.id)}
    >
      <div className="h-64 overflow-hidden">
        <img
          src={category.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
        <p className="text-gray-500 text-sm">{productCount} products</p>
      </div>
    </div>
  );
};
