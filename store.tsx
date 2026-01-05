
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile, FoodItem, Order, ChatMessage, Review, Notification, OrderStatus } from './types';

interface AppContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  foodItems: FoodItem[];
  orders: Order[];
  chats: ChatMessage[];
  reviews: Review[];
  notifications: Notification[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<UserProfile, 'id' | 'createdAt' | 'role' | 'following' | 'followers'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  changePassword: (oldPw: string, newPw: string) => boolean;
  addFood: (item: Omit<FoodItem, 'id' | 'sellerId' | 'sellerName' | 'rating' | 'reviewCount'>) => void;
  updateFood: (id: string, data: Partial<FoodItem>) => void;
  deleteFood: (id: string) => void;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  sendMessage: (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  deleteMessage: (msgId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  replyReview: (reviewId: string, reply: string) => void;
  followUser: (targetId: string) => void;
  unfollowUser: (targetId: string) => void;
  deleteNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'sue_ah_hahn_db_v3';
const SYNC_CHANNEL = 'sue_ah_hahn_sync';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      users: [],
      foodItems: [],
      orders: [],
      chats: [],
      reviews: [],
      notifications: [],
      currentUser: null
    };
  });

  const bc = useMemo(() => new BroadcastChannel(SYNC_CHANNEL), []);

  const save = useCallback((newData: any) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    bc.postMessage(newData);
  }, [bc]);

  useEffect(() => {
    bc.onmessage = (event) => {
      setData(event.data);
    };
    return () => bc.close();
  }, [bc]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const signup = async (userData: any) => {
    if (!userData.email || !validateEmail(userData.email)) {
      throw new Error('รูปแบบอีเมลไม่ถูกต้อง กรุณาใช้อีเมลจริง (เช่น name@example.com)');
    }

    const isFirstUser = data.users.length === 0;
    const role = isFirstUser ? 'admin' : 'user';
    
    if (data.users.some((u: UserProfile) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
    }

    const newUser: UserProfile = {
      ...userData,
      id: 'U' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: Date.now(),
      role,
      following: [],
      followers: []
    };
    save({ ...data, users: [...data.users, newUser], currentUser: newUser });
    return true;
  };

  const login = async (email: string, password: string) => {
    const user = data.users.find((u: UserProfile) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      save({ ...data, currentUser: user });
      return true;
    }
    return false;
  };

  const logout = () => save({ ...data, currentUser: null });

  const updateProfile = (profileData: Partial<UserProfile>) => {
    if (!data.currentUser) return;
    // ป้องกันการแก้ไขอีเมล (Account email uneditable)
    const { email, ...rest } = profileData;
    const updatedUser = { ...data.currentUser, ...rest };
    const updatedUsers = data.users.map((u: UserProfile) => u.id === data.currentUser?.id ? updatedUser : u);
    save({ ...data, users: updatedUsers, currentUser: updatedUser });
  };

  const changePassword = (oldPw: string, newPw: string) => {
    if (data.currentUser?.password === oldPw) {
      updateProfile({ password: newPw });
      return true;
    }
    return false;
  };

  const addFood = (item: any) => {
    if (!data.currentUser) return;
    const newFood: FoodItem = {
      ...item,
      id: 'F' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      sellerId: data.currentUser.id,
      sellerName: data.currentUser.displayName,
      rating: 0,
      reviewCount: 0
    };
    save({ ...data, foodItems: [...data.foodItems, newFood] });
  };

  const updateFood = (id: string, foodData: Partial<FoodItem>) => {
    const updatedItems = data.foodItems.map((f: FoodItem) => f.id === id ? { ...f, ...foodData } : f);
    save({ ...data, foodItems: updatedItems });
  };

  const deleteFood = (id: string) => {
    save({ ...data, foodItems: data.foodItems.filter((f: FoodItem) => f.id !== id) });
  };

  const placeOrder = (order: any) => {
    const newOrder: Order = {
      ...order,
      id: 'O' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: Date.now(),
      status: 'processing'
    };
    const notif: Notification = {
      id: 'N' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: order.sellerId,
      type: 'order',
      title: 'มีออเดอร์ใหม่!',
      message: `${order.buyerName} สั่ง ${order.foodName} จำนวน ${order.quantity}`,
      isRead: false,
      createdAt: Date.now()
    };
    save({ 
      ...data, 
      orders: [...data.orders, newOrder], 
      notifications: [notif, ...data.notifications] 
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    if (status === 'cancelled') {
      save({ ...data, orders: data.orders.filter((o: Order) => o.id !== orderId) });
      return;
    }
    const order = data.orders.find((o: Order) => o.id === orderId);
    if (!order) return;
    const updatedOrders = data.orders.map((o: Order) => o.id === orderId ? { ...o, status } : o);
    const notif: Notification = {
      id: 'N' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: order.buyerId,
      type: 'status',
      title: 'อัปเดตสถานะออเดอร์',
      message: `ออเดอร์ ${order.foodName} ของคุณเปลี่ยนเป็น: ${status === 'delivered' ? 'ส่งเรียบร้อยแล้ว' : 'กำลังดำเนินการ'}`,
      isRead: false,
      createdAt: Date.now()
    };
    save({ ...data, orders: updatedOrders, notifications: [notif, ...data.notifications] });
  };

  const sendMessage = (msg: any) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: 'M' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: Date.now()
    };
    const notif: Notification = {
      id: 'N' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: msg.receiverId,
      type: 'message',
      title: 'ข้อความใหม่',
      message: `คุณได้รับข้อความใหม่จาก ${data.currentUser?.displayName}`,
      isRead: false,
      createdAt: Date.now()
    };
    const newNotifs = msg.receiverId !== 'group' ? [notif, ...data.notifications] : data.notifications;
    save({ ...data, chats: [...data.chats, newMsg], notifications: newNotifs });
  };

  const deleteMessage = (id: string) => {
    save({ ...data, chats: data.chats.filter((m: ChatMessage) => m.id !== id) });
  };

  const addReview = (review: any) => {
    const newReview: Review = {
      ...review,
      id: 'R' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: Date.now()
    };
    const food = data.foodItems.find((f: FoodItem) => f.id === review.foodId);
    if (food) {
      const newCount = food.reviewCount + 1;
      const newRating = ((food.rating * food.reviewCount) + review.rating) / newCount;
      const updatedFoodItems = data.foodItems.map((f: FoodItem) => 
        f.id === review.foodId ? { ...f, rating: newRating, reviewCount: newCount } : f
      );
      save({ ...data, reviews: [...data.reviews, newReview], foodItems: updatedFoodItems });
    }
  };

  const replyReview = (reviewId: string, reply: string) => {
    const updatedReviews = data.reviews.map((r: Review) => r.id === reviewId ? { ...r, reply } : r);
    save({ ...data, reviews: updatedReviews });
  };

  const followUser = (targetId: string) => {
    if (!data.currentUser) return;
    const updatedUsers = data.users.map((u: UserProfile) => {
      if (u.id === data.currentUser?.id) return { ...u, following: [...u.following, targetId] };
      if (u.id === targetId) return { ...u, followers: [...u.followers, data.currentUser!.id] };
      return u;
    });
    const updatedCurrent = updatedUsers.find((u: UserProfile) => u.id === data.currentUser?.id);
    save({ ...data, users: updatedUsers, currentUser: updatedCurrent });
  };

  const unfollowUser = (targetId: string) => {
    if (!data.currentUser) return;
    const updatedUsers = data.users.map((u: UserProfile) => {
      if (u.id === data.currentUser?.id) return { ...u, following: u.following.filter(id => id !== targetId) };
      if (u.id === targetId) return { ...u, followers: u.followers.filter(id => id !== data.currentUser!.id) };
      return u;
    });
    const updatedCurrent = updatedUsers.find((u: UserProfile) => u.id === data.currentUser?.id);
    save({ ...data, users: updatedUsers, currentUser: updatedCurrent });
  };

  const deleteNotification = (id: string) => {
    save({ ...data, notifications: data.notifications.filter((n: Notification) => n.id !== id) });
  };

  return (
    <AppContext.Provider value={{
      ...data,
      login,
      signup,
      logout,
      updateProfile,
      changePassword,
      addFood,
      updateFood,
      deleteFood,
      placeOrder,
      updateOrderStatus,
      sendMessage,
      deleteMessage,
      addReview,
      replyReview,
      followUser,
      unfollowUser,
      deleteNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
