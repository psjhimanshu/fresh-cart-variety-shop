
import { ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';

export const Hero = () => {
  const { data: categories } = useCategories();

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Main Hero Section */}
      <section id="home" className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 bg-clip-text text-transparent">
                    Shop
                  </span>
                  <br />
                  <span className="text-gray-800">
                    the Future
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-lg">
                  Discover amazing products at unbeatable prices. Your perfect shopping experience starts here.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={scrollToProducts}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-purple-200 hover:border-purple-300"
                >
                  Learn More
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <Headphones className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium text-gray-600">24/7 Support</p>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=600&fit=crop"
                  alt="Shopping Experience"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-10 -right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview Section */}
      {categories && categories.length > 0 && (
        <section id="categories" className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our diverse range of products across different categories
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.slice(0, 5).map((category) => (
                <div
                  key={category.id}
                  className="group cursor-pointer text-center p-6 rounded-xl bg-gray-50 hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                    <img
                      src={category.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop'}
                      alt={category.name}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
