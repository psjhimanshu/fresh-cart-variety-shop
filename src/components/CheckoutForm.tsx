
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const CheckoutForm = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderData = {
        user_id: user?.id,
        email: shippingForm.email,
        total_amount: getTotalPrice(),
        shipping_amount: 50,
        tax_amount: getTotalPrice() * 0.18,
        shipping_address: shippingForm,
        billing_address: shippingForm,
        status: 'pending',
        payment_method: paymentMethod
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Save shipping address
      if (user) {
        const addressData = {
          user_id: user.id,
          type: 'shipping',
          first_name: shippingForm.firstName,
          last_name: shippingForm.lastName,
          address_line_1: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state,
          postal_code: shippingForm.postalCode,
          country: shippingForm.country
        };

        await supabase.from('addresses').insert([addressData]);
      }

      clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been placed with ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}. You will receive a confirmation email shortly.`,
      });

      // Reset form
      setShippingForm({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
      });

    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = getTotalPrice();
  const shippingCost = 50;
  const tax = totalAmount * 0.18;
  const finalTotal = totalAmount + shippingCost + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Shipping Form */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="First Name"
                value={shippingForm.firstName}
                onChange={handleInputChange}
                required
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={shippingForm.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={shippingForm.email}
              onChange={handleInputChange}
              required
            />
            
            <Input
              name="phone"
              placeholder="Phone Number"
              value={shippingForm.phone}
              onChange={handleInputChange}
              required
            />
            
            <Input
              name="address"
              placeholder="Street Address"
              value={shippingForm.address}
              onChange={handleInputChange}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="city"
                placeholder="City"
                value={shippingForm.city}
                onChange={handleInputChange}
                required
              />
              <Input
                name="state"
                placeholder="State"
                value={shippingForm.state}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="postalCode"
                placeholder="Postal Code"
                value={shippingForm.postalCode}
                onChange={handleInputChange}
                required
              />
              <Input
                name="country"
                placeholder="Country"
                value={shippingForm.country}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Online Payment</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading || cartItems.length === 0}>
              {loading ? 'Processing...' : `Place Order (${paymentMethod === 'cod' ? 'COD' : 'Pay Online'})`}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18% GST)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
