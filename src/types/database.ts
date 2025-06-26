
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string | null;
  image_url: string | null;
  images: string[] | null;
  in_stock: boolean | null;
  stock_quantity: number | null;
  rating: number | null;
  review_count: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products?: Product;
}
