
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { CheckoutForm } from '@/components/CheckoutForm';
import { Header } from '@/components/Header';

const Checkout = () => {
  const { user, loading } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [user, loading, cartItems, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutForm />
      </div>
    </div>
  );
};

export default Checkout;
