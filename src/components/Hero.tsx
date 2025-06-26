
import { Button } from '@/components/ui/button';

export const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Main Hero Section */}
      <section id="home" className="relative py-16 px-4 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to ShopEase
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Discover amazing products at unbeatable prices
            </p>
            <Button
              onClick={scrollToProducts}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-lg"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
