
import { useState } from 'react';
import { ShoppingCart, Menu, User, Heart, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';

export const Header = () => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = getTotalItems();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left - Menu button for mobile and Logo */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Link to="/" className="text-2xl font-bold text-gray-900">
              ShopEase
            </Link>
          </div>

          {/* Center - Categories (desktop only) */}
          <div className="hidden md:flex">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              Categories
            </Button>
          </div>

          {/* Right side - Account, Wishlist, Cart */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate('/auth')}>
                <User className="w-5 h-5" />
              </Button>
            )}

            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-5 h-5" />
              <span className="sr-only">Account</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Heart className="w-5 h-5" />
              <span className="sr-only">Wishlist</span>
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
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white pb-4">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Button variant="ghost" className="justify-start text-gray-700 hover:text-blue-600">
                Categories
              </Button>
              {user ? (
                <>
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Admin Panel
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Login / Sign Up
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
