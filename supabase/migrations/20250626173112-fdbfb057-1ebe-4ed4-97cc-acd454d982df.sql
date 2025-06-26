
-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  images TEXT[], -- Array of image URLs
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create addresses table
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('shipping', 'billing')) DEFAULT 'shipping',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  shipping_address JSONB,
  billing_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart_items table for persistent cart
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id),
  UNIQUE(session_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Create policies for products (public read)
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for addresses
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create policies for cart_items
CREATE POLICY "Users can view own cart items" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can insert own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can update own cart items" ON public.cart_items
  FOR UPDATE USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can delete own cart items" ON public.cart_items
  FOR DELETE USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Electronics', 'electronics', 'Latest electronic gadgets and devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
('Fashion', 'fashion', 'Trendy clothing and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'),
('Home & Garden', 'home-garden', 'Everything for your home and garden', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'),
('Sports', 'sports', 'Sports equipment and fitness gear', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Books', 'books', 'Books for every reader', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400');

-- Insert sample products
INSERT INTO public.products (name, slug, description, price, compare_price, category_id, image_url, images, in_stock, stock_quantity, rating, review_count, tags) VALUES
('iPhone 15 Pro', 'iphone-15-pro', 'Latest iPhone with A17 Pro chip and titanium design', 999.99, 1099.99, (SELECT id FROM public.categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1696446702061-8108bf582c8a?w=400', ARRAY['https://images.unsplash.com/photo-1696446702061-8108bf582c8a?w=400', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'], true, 50, 4.8, 342, ARRAY['smartphone', 'apple', 'premium']),
('MacBook Air M2', 'macbook-air-m2', 'Supercharged by M2 chip for incredible performance', 1199.99, 1299.99, (SELECT id FROM public.categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', ARRAY['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'], true, 25, 4.9, 156, ARRAY['laptop', 'apple', 'productivity']),
('Sony WH-1000XM4', 'sony-wh-1000xm4', 'Industry-leading noise canceling wireless headphones', 299.99, 349.99, (SELECT id FROM public.categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'], true, 75, 4.7, 892, ARRAY['headphones', 'wireless', 'noise-canceling']),
('Nike Air Max 270', 'nike-air-max-270', 'Comfortable running shoes with Max Air cushioning', 150.00, 180.00, (SELECT id FROM public.categories WHERE slug = 'sports'), 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], true, 120, 4.5, 234, ARRAY['shoes', 'running', 'nike']),
('Vintage Denim Jacket', 'vintage-denim-jacket', 'Classic denim jacket with vintage wash', 89.99, 120.00, (SELECT id FROM public.categories WHERE slug = 'fashion'), 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400', ARRAY['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400'], true, 45, 4.3, 67, ARRAY['jacket', 'denim', 'vintage']),
('Smart Home Speaker', 'smart-home-speaker', 'Voice-controlled smart speaker with premium sound', 99.99, 129.99, (SELECT id FROM public.categories WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'], true, 80, 4.4, 445, ARRAY['smart-home', 'speaker', 'voice-control']),
('Yoga Mat Pro', 'yoga-mat-pro', 'Premium non-slip yoga mat for all practice levels', 49.99, 69.99, (SELECT id FROM public.categories WHERE slug = 'sports'), 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], true, 200, 4.6, 123, ARRAY['yoga', 'fitness', 'mat']),
('Coffee Table Book: Photography', 'coffee-table-book-photography', 'Beautiful collection of contemporary photography', 39.99, 55.00, (SELECT id FROM public.categories WHERE slug = 'books'), 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', ARRAY['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'], true, 30, 4.7, 89, ARRAY['book', 'photography', 'art']);
