
import { useState } from 'react';
import { ShoppingCart, Menu, User, Search, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const Header = () => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-900">
              ShopEase
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="w-5 h-5" />
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
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500">
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

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white pb-4">
            <nav className="flex flex-col space-y-4 pt-4">
              <a href="#categories" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Categories
              </a>
              <a href="#electronics" className="text-gray-600 hover:text-blue-600 transition-colors pl-4">
                Electronics
              </a>
              <a href="#clothing" className="text-gray-600 hover:text-blue-600 transition-colors pl-4">
                Clothing
              </a>
              <a href="#home-garden" className="text-gray-600 hover:text-blue-600 transition-colors pl-4">
                Home & Garden
              </a>
              <a href="#sports" className="text-gray-600 hover:text-blue-600 transition-colors pl-4">
                Sports
              </a>
              <a href="#books" className="text-gray-600 hover:text-blue-600 transition-colors pl-4">
                Books
              </a>
              <a href="#beauty" className="text-gray-600 hover:text-blue-600 transition-colors pl-4">
                Beauty
              </a>
              <div className="border-t pt-4">
                <a href="#login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </a>
              </div>
              <a href="#signup" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Sign Up
              </a>
              <div className="border-t pt-4">
                <a href="#customer-service" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Customer Service
                </a>
              </div>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors pl-4">
                Contact Us
              </a>
              <a href="#returns" className="text-gray-600 hover:text-blue-600 transition-colors pl-4">
                Returns Policy
              </a>
              <a href="#shipping" className="text-gray-600 hover:text-blue-600 transition-colors pl-4">
                Shipping Information
              </a>
              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
