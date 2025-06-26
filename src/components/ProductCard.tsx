
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
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {product.compare_price && product.compare_price > product.price && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
          </Badge>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        >
          <Heart className="w-4 h-4" />
        </Button>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <h4 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-1">
          {product.name}
        </h4>
        
        {product.description && (
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">
            {product.description}
          </p>
        )}
        
        {product.rating && product.review_count && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500">
              ({product.review_count})
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-600">
              ${product.price}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.compare_price}
              </span>
            )}
          </div>
          
          {product.stock_quantity !== null && product.stock_quantity < 10 && (
            <Badge variant="outline" className="text-xs">
              Only {product.stock_quantity} left
            </Badge>
          )}
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {product.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
