
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export const Header = () => {
  const { getTotalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            CoolCart
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Home</a>
          <a href="#products" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Products</a>
          <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">About</a>
          <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Contact</a>
        </nav>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <ShoppingCart className="w-5 h-5" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {getTotalItems()}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
