
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    // Here you would typically send the email to your newsletter service
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  const handleLinkClick = (section: string) => {
    // For demo purposes, we'll show an alert. In production, these would navigate to actual pages
    alert(`Navigating to ${section} - This would be a real page in production`);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest deals, new products, and exclusive offers
          </p>
          <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white text-gray-900 border-0 rounded-r-none"
              required
            />
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 rounded-l-none px-8"
            >
              Subscribe
            </Button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">ShopEase</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Your one-stop shop for amazing products at great prices. We're committed to providing the best shopping experience.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleLinkClick('Facebook')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleLinkClick('Twitter')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleLinkClick('Instagram')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/auth" className="text-gray-300 hover:text-white transition-colors">Login / Sign Up</Link></li>
              <li><Link to="/wishlist" className="text-gray-300 hover:text-white transition-colors">My Wishlist</Link></li>
              <li><Link to="/admin" className="text-gray-300 hover:text-white transition-colors">Admin Panel</Link></li>
              <li><button onClick={() => handleLinkClick('My Orders')} className="text-gray-300 hover:text-white transition-colors">My Orders</button></li>
              <li><button onClick={() => handleLinkClick('Track Order')} className="text-gray-300 hover:text-white transition-colors">Track Order</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleLinkClick('Electronics')} className="text-gray-300 hover:text-white transition-colors">Electronics</button></li>
              <li><button onClick={() => handleLinkClick('Clothing')} className="text-gray-300 hover:text-white transition-colors">Clothing</button></li>
              <li><button onClick={() => handleLinkClick('Home & Garden')} className="text-gray-300 hover:text-white transition-colors">Home & Garden</button></li>
              <li><button onClick={() => handleLinkClick('Sports')} className="text-gray-300 hover:text-white transition-colors">Sports</button></li>
              <li><button onClick={() => handleLinkClick('Books')} className="text-gray-300 hover:text-white transition-colors">Books</button></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleLinkClick('Shipping Info')} className="text-gray-300 hover:text-white transition-colors">Shipping Info</button></li>
              <li><button onClick={() => handleLinkClick('Returns & Exchanges')} className="text-gray-300 hover:text-white transition-colors">Returns & Exchanges</button></li>
              <li><button onClick={() => handleLinkClick('Size Guide')} className="text-gray-300 hover:text-white transition-colors">Size Guide</button></li>
              <li><button onClick={() => handleLinkClick('FAQ')} className="text-gray-300 hover:text-white transition-colors">FAQ</button></li>
              <li><button onClick={() => handleLinkClick('Contact Support')} className="text-gray-300 hover:text-white transition-colors">Contact Support</button></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Phone className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-semibold">Call Us</p>
                <p className="text-sm text-gray-300">+91 1234567890</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-semibold">Email Us</p>
                <p className="text-sm text-gray-300">support@shopease.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-semibold">Visit Us</p>
                <p className="text-sm text-gray-300">Delhi, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 ShopEase. All rights reserved. | 
            <button onClick={() => handleLinkClick('Privacy Policy')} className="hover:text-white ml-2">Privacy Policy</button> | 
            <button onClick={() => handleLinkClick('Terms of Service')} className="hover:text-white ml-2">Terms of Service</button>
          </p>
        </div>
      </div>
    </footer>
  );
};
