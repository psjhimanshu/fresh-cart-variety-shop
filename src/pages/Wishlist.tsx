
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WishlistPage } from '@/components/WishlistPage';
import { CartProvider } from '@/contexts/CartContext';

const Wishlist = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <WishlistPage />
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Wishlist;
