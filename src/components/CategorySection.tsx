
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';

interface CategorySectionProps {
  onCategorySelect?: (categoryId: string) => void;
}

export const CategorySection = ({ onCategorySelect }: CategorySectionProps) => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-full h-32 rounded-lg mb-3" />
                <Skeleton className="h-4 w-20 mx-auto" />
                <Skeleton className="h-3 w-16 mx-auto mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.slice(0, 6).map((category) => (
            <div
              key={category.id}
              className="text-center cursor-pointer group"
              onClick={() => onCategorySelect?.(category.id)}
            >
              <div className="bg-gray-100 rounded-lg mb-3 overflow-hidden group-hover:shadow-md transition-shadow">
                <img
                  src={category.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'}
                  alt={category.name}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
              <p className="text-xs text-gray-500">0 products</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
