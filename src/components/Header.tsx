
import { useState } from 'react';
import { ShoppingCart, Menu, User, Search } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ShopePlane
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Home
            </a>
            <a href="#products" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Products
            </a>
            <a href="#categories" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Categories
            </a>
            <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  {totalItems > 99 ? '99+' : totalItems}
                </Badge>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="flex flex-col space-y-4 py-4">
              <a href="#home" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Home
              </a>
              <a href="#products" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Products
              </a>
              <a href="#categories" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Categories
              </a>
              <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
