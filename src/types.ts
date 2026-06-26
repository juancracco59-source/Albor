export interface Coffee {
  id: string;
  name: string;
  origin: string;
  region: string;
  farm: string;
  altitude: number; // in meters
  process: 'Lavado' | 'Natural' | 'Honey' | 'Maceración Carbónica';
  roastLevel: 'Claro' | 'Medio' | 'Oscuro';
  flavorNotes: string[];
  description: string;
  price: number; // price per 250g bag in USD or local currency (we'll use Ars or USD, let's use USD/ARS equivalents or just clean currency formatted, e.g., $USD or $ with clear design)
  weight: number; // in grams, e.g. 250
  image: string;
  stock: number;
  score: number; // Specialty coffee cupping score (e.g., 86.5, 88, 89)
}

export interface CartItem {
  coffee: Coffee;
  quantity: number;
  grindSize: 'En grano' | 'Espresso' | 'Filtro (V60/Chemex)' | 'Prensa Francesa' | 'Cafetera Italiana';
}

export interface SubscriptionConfig {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  quantity: 250 | 500 | 1000; // in grams
  coffeeType: 'variado' | 'frutal' | 'achocolatado' | 'exotico';
  grindSize: 'En grano' | 'Espresso' | 'Filtro (V60/Chemex)' | 'Prensa Francesa' | 'Cafetera Italiana';
}

export interface Subscription {
  id: string;
  config: SubscriptionConfig;
  status: 'active' | 'paused' | 'cancelled';
  nextDelivery: string;
  price: number;
  startDate: string;
}

export interface Order {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    grindSize: string;
  }[];
  subscription?: SubscriptionConfig;
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
  };
  status: 'pending' | 'shipped' | 'delivered';
}
