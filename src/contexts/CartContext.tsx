
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types/database';

interface CartItem extends Product {
  quantity: number;
  cartId?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoading: boolean;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();

  // Load cart items on mount
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          products:product_id (*)
        `);

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading cart:', error);
        return;
      }

      if (data) {
        const items = data.map(item => ({
          ...item.products,
          quantity: item.quantity,
          cartId: item.id
        })) as CartItem[];
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const cartData = {
        product_id: product.id,
        quantity,
        ...(user ? { user_id: user.id } : { session_id: sessionId })
      };

      const { error } = await supabase
        .from('cart_items')
        .upsert(cartData, {
          onConflict: user ? 'user_id,product_id' : 'session_id,product_id'
        });

      if (error) {
        console.error('Error adding to cart:', error);
        toast({
          title: "Error",
          description: "Failed to add item to cart",
          variant: "destructive"
        });
        return;
      }

      await loadCartItems();
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const item = cartItems.find(item => item.id === productId);
      if (!item?.cartId) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', item.cartId);

      if (error) {
        console.error('Error removing from cart:', error);
        toast({
          title: "Error",
          description: "Failed to remove item from cart",
          variant: "destructive"
        });
        return;
      }

      await loadCartItems();
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const item = cartItems.find(item => item.id === productId);
      if (!item?.cartId) return;

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', item.cartId);

      if (error) {
        console.error('Error updating quantity:', error);
        toast({
          title: "Error",
          description: "Failed to update quantity",
          variant: "destructive"
        });
        return;
      }

      await loadCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase.from('cart_items').delete();
      
      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', sessionId);
      }

      const { error } = await query;

      if (error) {
        console.error('Error clearing cart:', error);
        return;
      }

      setCartItems([]);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      isCartOpen,
      setIsCartOpen,
      isLoading,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
