
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  password?: string; // Visible as requested
  displayName: string;
  bio: string;
  profilePic: string;
  role: UserRole;
  createdAt: number;
  following: string[]; // User IDs
  followers: string[]; // User IDs
}

export interface FoodItem {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  isHidden: boolean;
  rating: number;
  reviewCount: number;
}

export type OrderStatus = 'processing' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  foodId: string;
  foodName: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  quantity: number;
  totalPrice: number;
  note: string;
  pickupTime: string;
  pickupLocation: string;
  status: OrderStatus;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string; // User ID or 'group'
  text?: string;
  imageUrl?: string;
  createdAt: number;
}

export interface Review {
  id: string;
  foodId: string;
  orderId: string;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
  reply?: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'status' | 'message';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: number;
}
