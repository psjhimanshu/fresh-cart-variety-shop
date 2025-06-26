
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategoryChange(null)}
        className="rounded-full"
      >
        All Products
      </Button>
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className="rounded-full"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};
