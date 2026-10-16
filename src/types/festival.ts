export interface LyricLine {
  id: number;
  timeSec: number;
  text: string;
  subtext?: string;
  highlight?: boolean;
  section?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  japaneseTitle: string;
  description: string;
  price: number;
  cheeseStretchCm: number;
  tag: string;
  popular?: boolean;
  flavorNotes: string[];
  spiceLevel?: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  flavorOption: string;
  sauceOption: string;
}

export interface OrderTicket {
  orderNumber: string;
  customerName: string;
  items: CartItem[];
  totalPrice: number;
  pickupTime: string;
  cheesePullScore: number;
  timestamp: string;
  status: 'frying' | 'ready' | 'delivered';
}

export interface ChalkNote {
  id: string;
  author: string;
  classOrRole: string;
  text: string;
  color: 'yellow' | 'pink' | 'cyan' | 'white' | 'orange';
  x: number;
  y: number;
  stamp?: string;
  createdAt: string;
}

export interface GameCustomer {
  id: string;
  name: string;
  type: 'student' | 'friend' | 'teacher' | 'alumni';
  flavor: string;
  sauce: string;
  count: number;
  patience: number; // 0 to 100
  initialPatience: number;
}
