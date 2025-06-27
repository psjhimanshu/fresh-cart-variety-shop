
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    country: 'India',
    landmark: '',
    addressType: 'home',
    instructions: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'postalCode'];
      const missingFields = requiredFields.filter(field => !shippingForm[field as keyof typeof shippingForm]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required shipping details",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const totalAmount = getTotalPrice();
      const shippingCost = 50;
      const tax = totalAmount * 0.18;
      const finalTotal = totalAmount + shippingCost + tax;

      // Create order
      const orderData = {
        user_id: user?.id,
        email: shippingForm.email,
        total_amount: finalTotal,
        shipping_amount: shippingCost,
        tax_amount: tax,
        shipping_address: {
          ...shippingForm,
          type: 'shipping'
        },
        billing_address: {
          ...shippingForm,
          type: 'billing'
        },
        status: 'pending',
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'awaiting_payment'
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
          address_line_2: shippingForm.landmark,
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
        country: 'India',
        landmark: '',
        addressType: 'home',
        instructions: ''
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
          <CardTitle>Shipping Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={shippingForm.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={shippingForm.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={shippingForm.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Phone Number"
                value={shippingForm.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                name="address"
                placeholder="House No, Street Name"
                value={shippingForm.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                name="landmark"
                placeholder="Near landmark"
                value={shippingForm.landmark}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  value={shippingForm.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="State"
                  value={shippingForm.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={shippingForm.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="Country"
                  value={shippingForm.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="addressType">Address Type</Label>
              <RadioGroup 
                value={shippingForm.addressType} 
                onValueChange={(value) => setShippingForm(prev => ({ ...prev, addressType: value }))}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home">Home</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="office" id="office" />
                  <Label htmlFor="office">Office</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                name="instructions"
                placeholder="Any special delivery instructions"
                value={shippingForm.instructions}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="cod" id="cod" />
                  <div className="flex-1">
                    <Label htmlFor="cod" className="font-medium">Cash on Delivery</Label>
                    <p className="text-sm text-gray-500">Pay when your order is delivered</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="online" id="online" />
                  <div className="flex-1">
                    <Label htmlFor="online" className="font-medium">Online Payment</Label>
                    <p className="text-sm text-gray-500">Pay securely online</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading || cartItems.length === 0}>
              {loading ? 'Processing...' : `Place Order - ₹${finalTotal.toFixed(2)} (${paymentMethod === 'cod' ? 'COD' : 'Pay Online'})`}
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
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop'}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
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

          {paymentMethod === 'cod' && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Cash on Delivery:</strong> Please keep exact change ready. Our delivery partner will collect ₹{finalTotal.toFixed(2)} at the time of delivery.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
