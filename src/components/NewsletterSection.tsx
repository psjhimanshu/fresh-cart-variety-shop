
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <section className="py-16 px-4 bg-gray-900 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          Subscribe to our newsletter for the latest deals and products
        </p>
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white text-gray-900"
            required
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};
