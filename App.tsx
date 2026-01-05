
import React, { useState, useMemo, useEffect } from 'react';
import { AppProvider, useApp } from './store';
import { 
  Home, 
  ShoppingBag, 
  MessageCircle, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  PlusCircle, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  Trash2, 
  Heart,
  ShieldCheck,
  Send,
  Image as ImageIcon,
  Star,
  CheckCircle2,
  XCircle,
  Menu as MenuIcon,
  Search,
  UserPlus
} from 'lucide-react';
import { UserProfile, FoodItem, Order, ChatMessage, Review, Notification } from './types';

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const AppLogo = () => (
  <div className="flex flex-col items-center justify-center leading-none">
    <span className="text-pink-500 font-bold text-3xl tracking-tighter">Sue</span>
    <span className="text-blue-800 font-bold text-3xl tracking-tighter">AhHahn</span>
  </div>
);

const Navbar = ({ activeTab, setTab }: { activeTab: string, setTab: (t: string) => void, isAdmin: boolean }) => {
  const { notifications, currentUser } = useApp();
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.isRead).length;

  const navItems = [
    { id: 'home', icon: Home, label: 'หน้าแรก' },
    { id: 'menu', icon: ShoppingBag, label: 'เมนู' },
    { id: 'chat', icon: MessageCircle, label: 'แชท' },
    { id: 'orders', icon: CheckCircle2, label: 'ออเดอร์' },
    { id: 'notif', icon: Bell, label: 'แจ้งเตือน', badge: unreadCount },
    { id: 'profile', icon: User, label: 'โปรไฟล์' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-1 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b md:px-8">
      <div className="hidden md:block">
        <AppLogo />
      </div>
      <div className="flex justify-around w-full md:w-auto md:gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? 'text-pink-500' : 'text-gray-400'}`}
          >
            <div className="relative">
              <item.icon size={24} />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const LoginPage = () => {
  const { login, signup } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    displayName: '',
    bio: '',
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'
  });
  const [error, setError] = useState('');

  const validateUsername = (val: string) => {
    if (val.length > 50) return 'Username ยาวเกิน 50 ตัวอักษร';
    if (!/^[a-zA-Z0-9_]*$/.test(val)) return 'ใช้ได้เฉพาะ A-Z, 0-9 และ _ เท่านั้น';
    return '';
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    if (isLogin) {
      const success = await login(formData.username, formData.password);
      if (!success) setError('Username หรือ Password ไม่ถูกต้อง');
    } else {
      if (!formData.displayName || !formData.password) {
        setError('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }
      await signup(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, profilePic: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pb-24">
      <div className="mb-8 scale-150">
        <AppLogo />
      </div>
      
      <form onSubmit={handleAction} className="w-full max-w-md space-y-4 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">
          {isLogin ? 'ยินดีต้อนรับกลับมา' : 'สร้างบัญชีใหม่'}
        </h2>

        {!isLogin && (
          <div className="flex flex-col items-center mb-4">
            <div className="relative group cursor-pointer" onClick={() => document.getElementById('pic-upload')?.click()}>
              <img src={formData.profilePic} className="w-24 h-24 rounded-full border-4 border-pink-200 object-cover shadow-sm" alt="Profile" />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlusCircle className="text-white" />
              </div>
            </div>
            <input id="pic-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <p className="text-xs text-gray-400 mt-2">คลิกเพื่ออัปโหลดรูป</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none bg-white text-black font-medium"
            placeholder="ใช้ _ แทนช่องว่าง"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            maxLength={50}
          />
          <p className="text-[10px] text-gray-500 mt-1">A-Z, a-z, 0-9, _ (สูงสุด 50 ตัว)</p>
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อที่แสดง (Display Name)</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none bg-white text-black font-medium"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div>
        )}

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none bg-white text-black font-medium"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bio (แนะนำตัว)</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none h-24 bg-white text-black font-medium"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 500) })}
            />
            <p className="text-[10px] text-right text-gray-400">{formData.bio.length}/500</p>
          </div>
        )}

        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

        <button className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl shadow-lg hover:bg-pink-600 transition-transform active:scale-95">
          {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
        </button>

        <button
          type="button"
          className="w-full text-blue-800 text-sm font-semibold mt-4"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'ไม่มีบัญชี? สมัครที่นี่' : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
};

const AdminDashboard = ({ onBack }: { onBack: () => void }) => {
  const { users } = useApp();
  return (
    <div className="p-4 pt-20">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack}><ChevronLeft size={24} /></button>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <div className="space-y-4">
        {users.map(u => (
          <div key={u.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-xs">
            <div className="flex items-center gap-3 mb-2">
              <img src={u.profilePic} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-bold text-sm">{u.displayName}</p>
                <p className="text-gray-500">@{u.username}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="font-semibold">UID:</span> {u.id}</p>
              <p><span className="font-semibold">บทบาท:</span> {u.role}</p>
              <p className="col-span-2 text-pink-600 bg-pink-50 p-1 rounded"><span className="font-semibold">รหัสผ่าน:</span> {u.password}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = ({ user, onBack, onStartChat }: { user: UserProfile, onBack?: () => void, onStartChat: (u: UserProfile) => void }) => {
  const { currentUser, logout, updateProfile, changePassword, followUser, unfollowUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: user.displayName, bio: user.bio, profilePic: user.profilePic });
  const [pwForm, setPwForm] = useState({ old: '', new: '', confirm: '' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isMe = currentUser?.id === user.id;
  const isFollowing = currentUser?.following.includes(user.id);

  const handleEdit = () => {
    updateProfile(editForm);
    setEditing(false);
  };

  const handlePwChange = () => {
    if (pwForm.new !== pwForm.confirm) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    if (changePassword(pwForm.old, pwForm.new)) {
      alert('เปลี่ยนรหัสผ่านสำเร็จ');
      setChangingPw(false);
    } else {
      alert('รหัสผ่านเดิมไม่ถูกต้อง');
    }
  };

  return (
    <div className="p-4 pt-20 pb-24 max-w-2xl mx-auto">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 mb-4 text-gray-600">
          <ChevronLeft size={20} /> ย้อนกลับ
        </button>
      )}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-pink-100 flex flex-col items-center text-center">
        <div className="relative group">
          <img src={user.profilePic} className="w-32 h-32 rounded-full border-4 border-pink-500 object-cover" />
          {editing && isMe && (
            <button 
              className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center text-white"
              onClick={() => {
                const url = prompt('ใส่ Link รูปภาพใหม่ (URL):');
                if (url) setEditForm({ ...editForm, profilePic: url });
              }}
            >
              แก้ไข
            </button>
          )}
        </div>
        
        {editing && isMe ? (
          <div className="w-full mt-4 space-y-3">
            <input 
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black font-medium" 
              value={editForm.displayName} 
              onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
              placeholder="ชื่อที่แสดง"
            />
            <textarea 
              className="w-full p-2 border border-gray-300 rounded-lg h-24 bg-white text-black font-medium" 
              value={editForm.bio} 
              onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
              placeholder="แนะนำตัวเอง"
            />
            <div className="flex gap-2">
              <button onClick={handleEdit} className="flex-1 py-2 bg-pink-500 text-white rounded-lg font-bold">บันทึก</button>
              <button onClick={() => setEditing(false)} className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold">ยกเลิก</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mt-4 text-blue-900">{user.displayName}</h2>
            <p className="text-gray-500 font-medium">@{user.username}</p>
            <p className="text-gray-700 mt-3 text-sm italic">{user.bio || 'ยังไม่มีคำแนะนำตัว'}</p>
            
            <div className="flex gap-8 my-6 w-full justify-center">
              <div><p className="font-bold text-pink-500">{user.followers.length}</p><p className="text-xs text-gray-400">ผู้ติดตาม</p></div>
              <div><p className="font-bold text-blue-800">{user.following.length}</p><p className="text-xs text-gray-400">กำลังติดตาม</p></div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              {isMe ? (
                <>
                  <button onClick={() => setEditing(true)} className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-800 rounded-2xl font-bold transition-transform active:scale-95">
                    <Settings size={18} /> แก้ไขโปรไฟล์
                  </button>
                  <button onClick={() => setChangingPw(true)} className="flex items-center justify-center gap-2 py-3 bg-pink-50 text-pink-500 rounded-2xl font-bold transition-transform active:scale-95">
                    <ShieldCheck size={18} /> เปลี่ยนรหัส
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => isFollowing ? unfollowUser(user.id) : followUser(user.id)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-transform active:scale-95 ${isFollowing ? 'bg-gray-100 text-gray-500' : 'bg-pink-500 text-white shadow-lg shadow-pink-200'}`}
                  >
                    <Heart size={18} fill={isFollowing ? 'currentColor' : 'none'} /> {isFollowing ? 'เลิกติดตาม' : 'ติดตาม'}
                  </button>
                  <button 
                    onClick={() => onStartChat(user)}
                    className="flex items-center justify-center gap-2 py-3 bg-blue-800 text-white rounded-2xl font-bold transition-transform active:scale-95 shadow-lg shadow-blue-200"
                  >
                    <MessageCircle size={18} /> ส่งข้อความ
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {isMe && (
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full mt-6 py-4 bg-red-500 text-white rounded-3xl font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <LogOut size={20} /> ออกจากระบบ
        </button>
      )}

      {changingPw && isMe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">เปลี่ยนรหัสผ่าน</h3>
            <div className="space-y-3">
              <input type="password" placeholder="รหัสผ่านเดิม" className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black font-medium" onChange={e => setPwForm({ ...pwForm, old: e.target.value })} />
              <input type="password" placeholder="รหัสผ่านใหม่" className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black font-medium" onChange={e => setPwForm({ ...pwForm, new: e.target.value })} />
              <input type="password" placeholder="ยืนยันรหัสผ่านใหม่" className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black font-medium" onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} />
              <div className="flex gap-2">
                <button onClick={handlePwChange} className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-bold">ยืนยัน</button>
                <button onClick={() => setChangingPw(false)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && isMe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold mb-4">ยืนยันการออกจากระบบ?</h3>
            <p className="text-gray-500 mb-6">คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ Sue AhHahn</p>
            <div className="flex gap-3">
              <button onClick={logout} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">ออกจากระบบ</button>
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuPage = ({ onSelectUser }: { onSelectUser: (u: UserProfile) => void }) => {
  const { foodItems, currentUser, addFood, deleteFood, updateFood, placeOrder, users } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [showOrder, setShowOrder] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    isHidden: false
  });
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    note: '',
    pickupTime: '',
    pickupLocation: ''
  });

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    addFood(formData);
    setShowAdd(false);
    setFormData({ name: '', description: '', price: 0, stock: 0, imageUrl: '', isHidden: false });
  };

  const handlePlaceOrder = () => {
    if (!showOrder || !currentUser) return;
    placeOrder({
      foodId: showOrder.id,
      foodName: showOrder.name,
      sellerId: showOrder.sellerId,
      buyerId: currentUser.id,
      buyerName: currentUser.displayName,
      quantity: orderForm.quantity,
      totalPrice: showOrder.price * orderForm.quantity,
      note: orderForm.note,
      pickupTime: orderForm.pickupTime,
      pickupLocation: orderForm.pickupLocation
    });
    alert('สั่งซื้อสำเร็จ!');
    setShowOrder(null);
  };

  return (
    <div className="p-4 pt-20 pb-24 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">เมนูอาหาร</h1>
        <button onClick={() => setShowAdd(true)} className="p-2 bg-pink-500 text-white rounded-full shadow-lg">
          <PlusCircle size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foodItems.filter(f => !f.isHidden || f.sellerId === currentUser?.id).map(item => (
          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col">
            <img src={item.imageUrl} className="w-full h-48 object-cover" alt={item.name} />
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-blue-900">{item.name}</h3>
                <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-lg font-bold">฿{item.price}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                โดย: <button 
                  onClick={() => {
                    const seller = users.find(u => u.id === item.sellerId);
                    if (seller) onSelectUser(seller);
                  }}
                  className="font-bold text-blue-800 hover:underline"
                >
                  {item.sellerName}
                </button>
              </p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
              
              <div className="mt-auto">
                <div className="flex items-center gap-1 mb-3">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-sm font-bold">{item.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({item.reviewCount} รีวิว)</span>
                  <span className={`ml-auto text-xs font-bold ${item.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    เหลือ {item.stock} ชิ้น
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {item.sellerId === currentUser?.id ? (
                    <>
                      <button onClick={() => updateFood(item.id, { isHidden: !item.isHidden })} className="flex-1 py-2 bg-blue-50 text-blue-800 rounded-xl text-xs font-bold">
                        {item.isHidden ? 'เลิกซ่อน' : 'ซ่อนเมนู'}
                      </button>
                      <button onClick={() => deleteFood(item.id)} className="p-2 bg-red-50 text-red-500 rounded-xl">
                        <Trash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <button 
                      disabled={item.stock <= 0}
                      onClick={() => setShowOrder(item)}
                      className={`w-full py-2 bg-pink-500 text-white rounded-xl font-bold shadow-md transition-transform active:scale-95 ${item.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                    >
                      {item.stock > 0 ? 'สั่งเลย' : 'สินค้าหมด'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">เพิ่มเมนูใหม่</h3>
            <form onSubmit={handleAddFood} className="space-y-4">
              <input placeholder="ชื่ออาหาร" required className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black font-medium" onChange={e => setFormData({...formData, name: e.target.value})} />
              <textarea placeholder="คำอธิบาย" required className="w-full p-3 border border-gray-300 rounded-xl h-24 bg-white text-black font-medium" onChange={e => setFormData({...formData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="ราคา (บาท)" required className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black font-medium" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                <input type="number" placeholder="จำนวนในสต็อก" required className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black font-medium" onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
              </div>
              <input placeholder="Link รูปภาพอาหาร (URL)" required className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black font-medium" onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-bold">บันทึก</button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showOrder && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">สั่งอาหาร: {showOrder.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500">จำนวน</label>
                <input type="number" min="1" max={showOrder.stock} className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black font-medium" value={orderForm.quantity} onChange={e => setOrderForm({...orderForm, quantity: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">เวลานัดรับ (ระบุวัน เดือน เวลา)</label>
                <input placeholder="เช่น 12 มกราคม 14:00" className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black font-medium" onChange={e => setOrderForm({...orderForm, pickupTime: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">สถานที่นัดรับ (ที่ต้องการ)</label>
                <input placeholder="เช่น หน้าตึก A" className="w-full p-3 border border-gray-300 rounded-xl bg-white text-black font-medium" onChange={e => setOrderForm({...orderForm, pickupLocation: e.target.value})} />
              </div>
              <textarea placeholder="คำอธิบายเพิ่มเติมถึงผู้ขาย" className="w-full p-3 border border-gray-300 rounded-xl h-20 bg-white text-black font-medium" onChange={e => setOrderForm({...orderForm, note: e.target.value})} />
              
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-gray-800">รวมทั้งสิ้น:</span>
                <span className="text-xl font-bold text-pink-500">฿{showOrder.price * orderForm.quantity}</span>
              </div>

              <div className="flex gap-2">
                <button onClick={handlePlaceOrder} className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-bold transition-transform active:scale-95 shadow-md">ยืนยันการสั่งซื้อ</button>
                <button onClick={() => setShowOrder(null)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const { orders, currentUser, updateOrderStatus } = useApp();
  const myOrders = orders.filter(o => o.buyerId === currentUser?.id);
  const mySales = orders.filter(o => o.sellerId === currentUser?.id);
  const [view, setView] = useState<'buy' | 'sell'>('buy');

  const getStatusText = (status: string) => {
    switch(status) {
      case 'processing': return 'กำลังดำเนินการ';
      case 'delivered': return 'ส่งเรียบร้อย';
      case 'cancelled': return 'ยกเลิกแล้ว';
      default: return status;
    }
  };

  const ordersToShow = view === 'buy' ? myOrders : mySales;

  return (
    <div className="p-4 pt-20 pb-24 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">รายการสั่งซื้อ</h1>
      
      <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
        <button onClick={() => setView('buy')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${view === 'buy' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-500'}`}>สั่งซื้อของฉัน</button>
        <button onClick={() => setView('sell')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${view === 'sell' ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-500'}`}>รายการที่ขาย</button>
      </div>

      <div className="space-y-4">
        {ordersToShow.length === 0 ? (
          <div className="text-center py-20 text-gray-400">ยังไม่มีรายการสั่งซื้อ</div>
        ) : (
          ordersToShow.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between mb-3">
                <span className="text-[10px] text-gray-400 font-mono">#{order.id}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${order.status === 'processing' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">{order.foodName} x {order.quantity}</h3>
              <p className="text-pink-500 font-bold mb-3">รวม ฿{order.totalPrice}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-2xl mb-4">
                <p><span className="font-bold">นัดรับ:</span> {order.pickupTime}</p>
                <p><span className="font-bold">ที่อยู่:</span> {order.pickupLocation}</p>
                <p className="col-span-full"><span className="font-bold">โน้ต:</span> {order.note || '-'}</p>
                <p><span className="font-bold">{view === 'buy' ? 'ผู้ขาย:' : 'ผู้ซื้อ:'}</span> {view === 'buy' ? 'ร้านค้า' : order.buyerName}</p>
              </div>

              {view === 'sell' && order.status === 'processing' && (
                <div className="flex gap-2">
                  <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="flex-1 py-2 bg-green-500 text-white rounded-xl font-bold text-sm">ส่งเรียบร้อย</button>
                  <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-sm">ยกเลิกและลบ</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ChatPage = ({ initialTarget }: { initialTarget: UserProfile | 'group' | null }) => {
  const { chats, users, currentUser, sendMessage, deleteMessage } = useApp();
  const [selectedUser, setSelectedUser] = useState<UserProfile | 'group' | null>(initialTarget);
  const [msgText, setMsgText] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (initialTarget) setSelectedUser(initialTarget);
  }, [initialTarget]);

  const filteredChats = chats.filter(c => 
    (selectedUser === 'group' && c.receiverId === 'group') ||
    (selectedUser !== 'group' && selectedUser && (
      (c.senderId === currentUser?.id && c.receiverId === selectedUser.id) ||
      (c.senderId === selectedUser.id && c.receiverId === currentUser?.id)
    ))
  );

  const contactList = useMemo(() => {
    // ผู้ใช้ที่เคยแชทด้วย
    const chatUserIds = new Set(chats.map(c => c.senderId === currentUser?.id ? c.receiverId : c.senderId));
    return users.filter(u => u.id !== currentUser?.id && chatUserIds.has(u.id));
  }, [users, currentUser, chats]);

  const handleSend = () => {
    if (!msgText.trim() || !selectedUser) return;
    sendMessage({
      senderId: currentUser!.id,
      receiverId: selectedUser === 'group' ? 'group' : selectedUser.id,
      text: msgText
    });
    setMsgText('');
  };

  const handleSearch = () => {
    const found = users.find(u => u.username === searchUsername && u.id !== currentUser?.id);
    setSearchResult(found || null);
    if (!found) alert('ไม่พบผู้ใช้ชื่อนี้');
  };

  return (
    <div className="p-4 pt-20 pb-24 max-w-4xl mx-auto h-screen flex flex-col">
      {selectedUser ? (
        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden mb-4 border border-gray-100">
          <div className="p-4 bg-blue-800 text-white flex items-center gap-3">
            <button onClick={() => setSelectedUser(null)}><ChevronLeft /></button>
            <div className="flex items-center gap-2">
              {selectedUser === 'group' ? (
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center font-bold">G</div>
              ) : (
                <img src={selectedUser.profilePic} className="w-10 h-10 rounded-full" />
              )}
              <span className="font-bold">{selectedUser === 'group' ? 'กลุ่มแชทสาธารณะ' : selectedUser.displayName}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-blue-50/30">
            {filteredChats.map(c => {
              const isMe = c.senderId === currentUser?.id;
              const sender = users.find(u => u.id === c.senderId);
              return (
                <div key={c.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl relative group ${isMe ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none shadow-sm'}`}>
                    {!isMe && selectedUser === 'group' && (
                      <p className="text-[10px] font-bold mb-1 text-blue-800">{sender?.displayName}</p>
                    )}
                    <p className="text-sm">{c.text}</p>
                    {isMe && (
                      <button onClick={() => deleteMessage(c.id)} className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 text-red-400">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-white border-t flex gap-2">
            <button className="p-2 text-gray-400"><ImageIcon size={24} /></button>
            <input 
              className="flex-1 p-2 bg-gray-100 rounded-xl outline-none bg-white text-black font-medium" 
              placeholder="พิมพ์ข้อความ..." 
              value={msgText} 
              onChange={e => setMsgText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="p-2 bg-blue-800 text-white rounded-xl"><Send size={20} /></button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">การสนทนา</h2>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input 
                placeholder="พิมพ์ Username เพื่อแชท..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-pink-200"
                value={searchUsername}
                onChange={e => setSearchUsername(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
            <button onClick={handleSearch} className="px-6 bg-pink-500 text-white rounded-2xl font-bold">ค้นหา</button>
          </div>

          {searchResult && (
            <div className="bg-blue-50 p-4 rounded-3xl flex items-center gap-4 mb-4 border border-blue-100">
              <img src={searchResult.profilePic} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <p className="font-bold text-blue-900">{searchResult.displayName}</p>
                <p className="text-xs text-gray-500">@{searchResult.username}</p>
              </div>
              <button onClick={() => setSelectedUser(searchResult)} className="p-2 bg-blue-800 text-white rounded-full">
                <UserPlus size={20} />
              </button>
            </div>
          )}

          <div 
            onClick={() => setSelectedUser('group')}
            className="bg-white p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-pink-50 transition-colors shadow-sm border border-gray-50"
          >
            <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">G</div>
            <div className="flex-1">
              <p className="font-bold">กลุ่มแชทสาธารณะ</p>
              <p className="text-xs text-gray-400">คุยกับทุกคนในแอป</p>
            </div>
          </div>

          {contactList.map(u => (
            <div 
              key={u.id} 
              onClick={() => setSelectedUser(u)}
              className="bg-white p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-blue-50 transition-colors shadow-sm border border-gray-50"
            >
              <img src={u.profilePic} className="w-14 h-14 rounded-full border-2 border-gray-100" />
              <div className="flex-1">
                <p className="font-bold">{u.displayName}</p>
                <p className="text-xs text-gray-400">@{u.username}</p>
              </div>
            </div>
          ))}

          {contactList.length === 0 && !searchResult && (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">ยังไม่มีแชทส่วนตัว<br/>ลองค้นหาด้วย Username ด้านบน!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NotificationPage = () => {
  const { notifications, currentUser, deleteNotification } = useApp();
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);

  return (
    <div className="p-4 pt-20 pb-24 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">การแจ้งเตือน</h1>
      <div className="space-y-3">
        {myNotifs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">ไม่มีการแจ้งเตือน</div>
        ) : (
          myNotifs.map(n => (
            <div key={n.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex gap-4 relative group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${n.type === 'order' ? 'bg-pink-100 text-pink-500' : 'bg-blue-100 text-blue-500'}`}>
                {n.type === 'order' ? <ShoppingBag /> : <Bell />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{n.title}</p>
                <p className="text-xs text-gray-600">{n.message}</p>
                <p className="text-[10px] text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString('th-TH')}</p>
              </div>
              <button onClick={() => deleteNotification(n.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                <XCircle size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const HomePage = ({ setTab, onAdmin, onSelectUser }: { setTab: (t: string) => void, onAdmin: () => void, onSelectUser: (u: UserProfile) => void }) => {
  const { currentUser, foodItems, users } = useApp();
  const trending = foodItems.slice(0, 4);

  return (
    <div className="p-4 pt-20 pb-24 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-pink-500 to-blue-800 rounded-3xl p-6 text-white mb-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-1">สวัสดี, {currentUser?.displayName}! 👋</h1>
        <p className="text-sm opacity-90">ยินดีต้อนรับสู่ Sue AhHahn สั่งอาหารอร่อยๆ ได้เลย</p>
        
        {currentUser?.role === 'admin' && (
          <button 
            onClick={onAdmin}
            className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/30 backdrop-blur-sm transition-colors"
          >
            <ShieldCheck size={18} /> Admin Dashboard
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={() => setTab('menu')} className="bg-white p-4 rounded-3xl shadow-md border border-gray-50 flex flex-col items-center gap-2 transition-transform active:scale-95">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
            <ShoppingBag />
          </div>
          <span className="font-bold text-gray-700">หิวจัง สั่งเลย</span>
        </button>
        <button onClick={() => setTab('orders')} className="bg-white p-4 rounded-3xl shadow-md border border-gray-50 flex flex-col items-center gap-2 transition-transform active:scale-95">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800">
            <CheckCircle2 />
          </div>
          <span className="font-bold text-gray-700">ดูรายการสั่ง</span>
        </button>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-900">เมนูแนะนำ 🔥</h2>
          <button onClick={() => setTab('menu')} className="text-sm text-pink-500 font-bold">ดูทั้งหมด</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {trending.map(item => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 flex flex-col">
              <img src={item.imageUrl} className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="font-bold text-sm truncate">{item.name}</p>
                <button 
                  onClick={() => {
                    const seller = users.find(u => u.id === item.sellerId);
                    if (seller) onSelectUser(seller);
                  }}
                  className="text-blue-800 text-[10px] font-bold hover:underline mb-1"
                >
                  ร้าน: {item.sellerName}
                </button>
                <p className="text-pink-500 font-bold text-sm">฿{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminView, setIsAdminView] = useState(false);
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
  const [chatInitialTarget, setChatInitialTarget] = useState<UserProfile | 'group' | null>(null);
  const { currentUser } = useApp();

  if (!currentUser) return <LoginPage />;
  if (isAdminView) return <AdminDashboard onBack={() => setIsAdminView(false)} />;

  const startChat = (user: UserProfile) => {
    setChatInitialTarget(user);
    setViewedProfile(null);
    setActiveTab('chat');
  };

  const showProfile = (user: UserProfile) => {
    setViewedProfile(user);
    if (user.id === currentUser.id) {
      setActiveTab('profile');
      setViewedProfile(null);
    }
  };

  const renderContent = () => {
    if (viewedProfile) return <ProfilePage user={viewedProfile} onBack={() => setViewedProfile(null)} onStartChat={startChat} />;

    switch(activeTab) {
      case 'home': return <HomePage setTab={setActiveTab} onAdmin={() => setIsAdminView(true)} onSelectUser={showProfile} />;
      case 'menu': return <MenuPage onSelectUser={showProfile} />;
      case 'orders': return <OrdersPage />;
      case 'chat': return <ChatPage initialTarget={chatInitialTarget} />;
      case 'notif': return <NotificationPage />;
      case 'profile': return <ProfilePage user={currentUser} onStartChat={startChat} />;
      default: return <HomePage setTab={setActiveTab} onAdmin={() => setIsAdminView(true)} onSelectUser={showProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setTab={(t) => { setActiveTab(t); setViewedProfile(null); setChatInitialTarget(null); }} isAdmin={currentUser.role === 'admin'} />
      <main className="pb-4">
        {renderContent()}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
