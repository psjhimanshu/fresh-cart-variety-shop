
-- Create wishlist_items table
CREATE TABLE public.wishlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  session_id TEXT,
  product_id UUID REFERENCES public.products(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id),
  UNIQUE(session_id, product_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlist_items
CREATE POLICY "Users can view their own wishlist items" 
  ON public.wishlist_items 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can create their own wishlist items" 
  ON public.wishlist_items 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can delete their own wishlist items" 
  ON public.wishlist_items 
  FOR DELETE 
  USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- Add indexes for better performance
CREATE INDEX idx_wishlist_user_id ON public.wishlist_items(user_id);
CREATE INDEX idx_wishlist_session_id ON public.wishlist_items(session_id);
CREATE INDEX idx_wishlist_product_id ON public.wishlist_items(product_id);

-- Add payment_status column to orders table
ALTER TABLE public.orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
