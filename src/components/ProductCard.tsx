
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/database';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    await addToCart(product);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {product.compare_price && product.compare_price > product.price && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
            -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
          </Badge>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white h-8 w-8"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <h4 className="text-sm font-medium mb-1 text-gray-900 line-clamp-2">
          {product.name}
        </h4>
        
        {product.rating && product.review_count && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-gray-500">
              ({product.review_count})
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.compare_price}
              </span>
            )}
          </div>
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
};
