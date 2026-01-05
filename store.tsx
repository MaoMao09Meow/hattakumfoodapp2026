
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile, FoodItem, Order, ChatMessage, Review, Notification, OrderStatus } from './types.ts';

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
  changePassword: (oldPw: string, newPw: string, confirmNewPw: string) => { success: boolean, message: string };
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

const STORAGE_KEY = 'sue_ah_hahn_db_v4';
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
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const signup = async (userData: any) => {
    if (!userData.email || !validateEmail(userData.email)) {
      throw new Error('⚠️ ERRORRRR! อีเมลไม่ถูกต้อง กรุณาใช้อีเมลจริงเท่านั้น');
    }
    if (data.users.some((u: UserProfile) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('⚠️ อีเมลนี้มีในระบบแล้ว!');
    }
    const isFirstUser = data.users.length === 0;
    const role = isFirstUser ? 'admin' : 'user';
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
    if (!validateEmail(email)) return false;
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
    const { email, id, role, createdAt, ...rest } = profileData;
    const updatedUser = { ...data.currentUser, ...rest };
    const updatedUsers = data.users.map((u: UserProfile) => u.id === data.currentUser?.id ? updatedUser : u);
    save({ ...data, users: updatedUsers, currentUser: updatedUser });
  };

  const changePassword = (oldPw: string, newPw: string, confirmNewPw: string) => {
    if (!data.currentUser) return { success: false, message: 'ไม่พบผู้ใช้' };
    if (data.currentUser.password !== oldPw) return { success: false, message: '⚠️ รหัสผ่านเดิมไม่ถูกต้อง' };
    if (newPw !== confirmNewPw) return { success: false, message: '⚠️ รหัสใหม่ไม่ตรงกัน' };
    if (newPw.length < 4) return { success: false, message: '⚠️ ต้องมีอย่างน้อย 4 ตัว' };
    updateProfile({ password: newPw });
    return { success: true, message: '✅ เปลี่ยนสำเร็จ!' };
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
      message: `${order.buyerName} สั่ง ${order.foodName} x${order.quantity}`,
      isRead: false,
      createdAt: Date.now()
    };
    save({ ...data, orders: [...data.orders, newOrder], notifications: [notif, ...data.notifications] });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const order = data.orders.find((o: Order) => o.id === orderId);
    if (!order) return;
    const updatedOrders = data.orders.map((o: Order) => o.id === orderId ? { ...o, status } : o);
    const notif: Notification = {
      id: 'N' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: order.buyerId,
      type: 'status',
      title: 'อัปเดตออเดอร์',
      message: `${order.foodName}: ${status === 'delivered' ? 'ส่งแล้ว' : 'กำลังทำ'}`,
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
    save({ ...data, chats: [...data.chats, newMsg] });
  };

  const deleteMessage = (id: string) => {
    save({ ...data, chats: data.chats.filter((m: ChatMessage) => m.id !== id) });
  };

  const addReview = (review: any) => {
    const newReview: Review = { ...review, id: 'R' + Math.random().toString(36).substr(2, 9).toUpperCase(), createdAt: Date.now() };
    save({ ...data, reviews: [...data.reviews, newReview] });
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
      login, signup, logout, updateProfile, changePassword,
      addFood, updateFood, deleteFood, placeOrder, updateOrderStatus,
      sendMessage, deleteMessage, addReview, replyReview, followUser, unfollowUser, deleteNotification
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
