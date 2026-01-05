
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
  Search,
  Mail,
  Lock,
  User as UserIcon,
  Info,
  UserPlus,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { UserProfile, FoodItem, Order, ChatMessage, Review, Notification } from './types';

const AppLogo = () => (
  <div className="flex flex-col items-center justify-center leading-none select-none py-2">
    <span className="text-pink-600 font-black text-3xl md:text-4xl tracking-tighter drop-shadow-sm">Sue</span>
    <span className="text-blue-950 font-black text-3xl md:text-4xl tracking-tighter drop-shadow-sm">AhHahn</span>
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 nav-blur border-t-2 border-gray-100 flex justify-around items-center pt-3 pb-6 px-1 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b-2 md:px-8 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:shadow-none safe-bottom">
      <div className="hidden md:block">
        <AppLogo />
      </div>
      <div className="flex justify-around w-full md:w-auto md:gap-8 max-w-lg mx-auto md:mx-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              window.scrollTo(0, 0);
              setTab(item.id);
            }}
            className={`flex flex-col items-center gap-1 transition-all flex-1 md:flex-none ${activeTab === item.id ? 'text-pink-600 active-nav-item' : 'text-gray-400 hover:text-blue-900'}`}
          >
            <div className="relative p-1">
              <item.icon size={24} strokeWidth={activeTab === item.id ? 3 : 2} />
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black ring-2 ring-white">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] md:text-xs font-black tracking-tight ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
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
    email: '',
    password: '',
    displayName: '',
    bio: '',
    profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random()
  });
  const [error, setError] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(formData.email)) return setError('⚠️ รูปแบบอีเมลไม่ถูกต้อง');
    if (isLogin) {
      if (!(await login(formData.email, formData.password))) setError('⚠️ อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } else {
      if (!formData.displayName || !formData.password || !formData.bio) return setError('⚠️ กรุณากรอกข้อมูลให้ครบถ้วน');
      try {
        await signup(formData);
      } catch (err: any) {
        setError('⚠️ ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:bg-gray-50">
      <div className="mb-10 scale-110"><AppLogo /></div>
      <form onSubmit={handleAction} className="w-full max-w-sm space-y-6 md:bg-white md:p-10 md:rounded-[3rem] md:shadow-2xl md:border-2 md:border-gray-100">
        <h2 className="text-3xl font-black text-center text-blue-950 mb-2">{isLogin ? 'ยินดีต้อนรับ' : 'ร่วมเป็นพาร์ทเนอร์'}</h2>
        <p className="text-center text-gray-400 font-bold text-sm mb-6">{isLogin ? 'เข้าสู่ระบบเพื่อสั่งอาหารอร่อย' : 'สมัครสมาชิกฟรีเพื่อซื้อหรือขายอาหาร'}</p>
        
        {!isLogin && (
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer" onClick={() => {
              const url = prompt('ใส่ Link รูปโปรไฟล์ (URL):');
              if(url) setFormData({...formData, profilePic: url});
            }}>
              <img src={formData.profilePic} className="w-24 h-24 rounded-full border-4 border-pink-500 object-cover shadow-xl" alt="profile" />
              <div className="absolute -bottom-1 -right-1 bg-blue-900 text-white p-2 rounded-full border-4 border-white"><PlusCircle size={20} /></div>
            </div>
            <p className="text-xs text-blue-900 mt-3 font-black bg-blue-50 px-3 py-1 rounded-full">เปลี่ยนรูปโปรไฟล์</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-blue-950 ml-1 uppercase tracking-widest">Email (อีเมล)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-950" size={20} />
              <input 
                type="email" 
                required 
                placeholder="ชื่อ@email.com"
                className="w-full pl-12 pr-4 h-14 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:border-pink-600 focus:bg-white outline-none font-black text-blue-950 transition-all shadow-sm" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-blue-950 ml-1 uppercase tracking-widest">Display Name (ชื่อแสดง)</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-950" size={20} />
                <input 
                  type="text" 
                  required 
                  placeholder="ชื่อเล่นหรือชื่อจริง"
                  className="w-full pl-12 pr-4 h-14 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:border-pink-600 focus:bg-white outline-none font-black text-blue-950 transition-all shadow-sm" 
                  value={formData.displayName} 
                  onChange={e => setFormData({...formData, displayName: e.target.value})} 
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black text-blue-950 ml-1 uppercase tracking-widest">Password (รหัสผ่าน)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-950" size={20} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                placeholder="••••••••"
                className="w-full pl-12 pr-12 h-14 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:border-pink-600 focus:bg-white outline-none font-black text-blue-950 transition-all shadow-sm" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-950" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-blue-950 ml-1 uppercase tracking-widest">Bio (แนะนำตัว)</label>
              <textarea 
                required 
                placeholder="ขายอะไร หรือชอบกินอะไร บอกเพื่อนๆ ได้นะ..."
                className="w-full p-4 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:border-pink-600 focus:bg-white outline-none font-black text-blue-950 h-24 resize-none shadow-sm" 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                maxLength={500} 
              />
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl animate-pulse">
            <p className="text-red-700 text-xs font-black text-center">{error}</p>
          </div>
        )}

        <button className="w-full h-16 bg-pink-600 hover:bg-pink-700 text-white font-black text-xl rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
          {isLogin ? 'เข้าสู่ระบบ 🚀' : 'เริ่มใช้งานเลย ✨'}
        </button>

        <button type="button" className="w-full text-blue-900 text-sm font-black mt-4 py-2 border-2 border-transparent active:border-blue-100 rounded-xl transition-all" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? 'ยังไม่เคยมา Sue AhHahn? สมัครที่นี่ 🎉' : 'มีบัญชีอยู่แล้ว? ล็อกอินที่นี่ 🔑'}
        </button>
      </form>
    </div>
  );
};

const ProfilePage = ({ user, onBack, onStartChat }: { user: UserProfile, onBack?: () => void, onStartChat: (u: UserProfile) => void }) => {
  const { currentUser, logout, updateProfile, changePassword, followUser, unfollowUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [error, setError] = useState('');
  
  const [editForm, setEditForm] = useState({ 
    displayName: user.displayName, 
    bio: user.bio, 
    profilePic: user.profilePic 
  });

  const [pwChange, setPwChange] = useState({
    show: false,
    old: '',
    new: '',
    confirm: ''
  });

  const isMe = currentUser?.id === user.id;
  const isFollowing = currentUser?.following.includes(user.id);

  const handleEdit = () => {
    setError('');
    
    // Check if user is trying to change password
    if (pwChange.show) {
      if (!pwChange.old || !pwChange.new || !pwChange.confirm) {
        return setError('⚠️ กรุณากรอกรหัสผ่านให้ครบทุกช่อง');
      }
      if (pwChange.new !== pwChange.confirm) {
        return setError('⚠️ รหัสผ่านใหม่ไม่ตรงกัน');
      }
      const success = changePassword(pwChange.old, pwChange.new);
      if (!success) {
        return setError('⚠️ รหัสผ่านเดิมไม่ถูกต้อง');
      }
    }

    updateProfile(editForm);
    setEditing(false);
    setPwChange({ show: false, old: '', new: '', confirm: '' });
  };

  return (
    <div className="p-4 pt-10 pb-28 max-w-2xl mx-auto md:pt-24">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 mb-6 text-blue-950 font-black bg-white px-5 py-3 rounded-2xl shadow-md border-2 border-gray-100 active:scale-95 transition-all">
          <ChevronLeft size={24} strokeWidth={3} /> ย้อนกลับ
        </button>
      )}
      
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl border-2 border-pink-50 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-pink-500 to-blue-900 opacity-5"></div>
        
        <div className="relative group mb-6 z-10 mt-2">
          <img src={editing ? editForm.profilePic : user.profilePic} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white ring-4 ring-pink-500 object-cover shadow-2xl" alt="avatar" />
          {editing && (
            <button className="absolute inset-0 bg-black/60 rounded-full text-white font-black text-xs flex items-center justify-center backdrop-blur-[2px]" onClick={() => {
              const url = prompt('ใส่ Link รูปใหม่ (URL):'); if(url) setEditForm({...editForm, profilePic: url});
            }}>แก้ไขรูป</button>
          )}
        </div>

        {editing ? (
          <div className="w-full space-y-4 z-10">
            <div className="text-left space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ชื่อแสดง (Display Name)</label>
              <input className="w-full h-14 px-4 border-2 rounded-2xl bg-gray-50 font-black text-blue-950 outline-none focus:border-pink-600" value={editForm.displayName} onChange={e => setEditForm({...editForm, displayName: e.target.value})} placeholder="Display Name" />
            </div>

            <div className="text-left space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">อีเมล (ไม่สามารถเปลี่ยนได้)</label>
              <div className="relative">
                <input disabled className="w-full h-14 px-4 pl-12 border-2 rounded-2xl bg-gray-100 font-black text-gray-400 outline-none cursor-not-allowed" value={user.email} />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              </div>
            </div>

            <div className="text-left space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bio</label>
              <textarea className="w-full p-4 border-2 rounded-2xl bg-gray-50 font-black text-blue-950 outline-none focus:border-pink-600 h-24 resize-none" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} placeholder="Bio" />
            </div>

            {!pwChange.show ? (
              <button onClick={() => setPwChange({...pwChange, show: true})} className="w-full py-3 border-2 border-dashed border-pink-200 rounded-2xl text-pink-600 font-black text-sm flex items-center justify-center gap-2 hover:bg-pink-50 transition-all">
                <KeyRound size={16} /> เปลี่ยนรหัสผ่านใหม่
              </button>
            ) : (
              <div className="bg-blue-50/50 p-5 rounded-[2rem] border-2 border-blue-100 space-y-3">
                <p className="text-xs font-black text-blue-900 mb-2 flex items-center gap-2"><KeyRound size={14} /> ตั้งค่ารหัสผ่านใหม่</p>
                <input type="password" placeholder="รหัสผ่านเดิม" className="w-full h-12 px-4 border-2 rounded-xl font-black text-sm outline-none focus:border-blue-900" value={pwChange.old} onChange={e => setPwChange({...pwChange, old: e.target.value})} />
                <input type="password" placeholder="รหัสผ่านใหม่" className="w-full h-12 px-4 border-2 rounded-xl font-black text-sm outline-none focus:border-blue-900" value={pwChange.new} onChange={e => setPwChange({...pwChange, new: e.target.value})} />
                <input type="password" placeholder="ยืนยันรหัสผ่านใหม่" className="w-full h-12 px-4 border-2 rounded-xl font-black text-sm outline-none focus:border-blue-900" value={pwChange.confirm} onChange={e => setPwChange({...pwChange, confirm: e.target.value})} />
                <button type="button" onClick={() => setPwChange({show: false, old: '', new: '', confirm: ''})} className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2 hover:underline">ยกเลิกการเปลี่ยนรหัส</button>
              </div>
            )}

            {error && <p className="text-red-600 text-xs font-black bg-red-50 p-2 rounded-xl border border-red-100">{error}</p>}

            <div className="flex gap-2 pt-2">
              <button onClick={handleEdit} className="flex-1 h-14 bg-pink-600 text-white rounded-2xl font-black shadow-lg">บันทึกข้อมูล</button>
              <button onClick={() => {setEditing(false); setError(''); setPwChange({show: false, old: '', new: '', confirm: ''});}} className="flex-1 h-14 bg-gray-200 text-blue-950 rounded-2xl font-black">ยกเลิก</button>
            </div>
          </div>
        ) : (
          <div className="z-10 w-full">
            <h2 className="text-3xl font-black text-blue-950 mb-1 leading-tight">{user.displayName}</h2>
            <p className="text-pink-600 font-black text-sm mb-3">ID: @{user.id}</p>
            <p className="text-blue-800 font-black text-xs mb-6 bg-blue-50 px-3 py-1 rounded-full inline-block border-2 border-blue-100">{user.email}</p>
            
            <div className="bg-gray-50 p-5 rounded-[2rem] w-full mb-8 text-blue-950 font-bold text-base leading-relaxed whitespace-pre-wrap border-2 border-gray-100 text-left shadow-inner">
              {user.bio || 'ทักทายเพื่อนๆ ได้ที่นี่...'}
            </div>
            
            {isMe && (
              <div className="w-full bg-yellow-50 p-4 rounded-2xl mb-8 text-left border-2 border-yellow-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-blue-950 uppercase">รหัสผ่านลับ:</span>
                  <span className="font-mono font-black text-lg text-pink-600">{user.password}</span>
                </div>
              </div>
            )}

            <div className="flex gap-10 justify-center mb-10">
              <div className="text-center">
                <p className="text-2xl font-black text-pink-600">{user.followers.length}</p>
                <p className="text-[10px] text-blue-900 font-black uppercase tracking-widest">ผู้ติดตาม</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-blue-800">{user.following.length}</p>
                <p className="text-[10px] text-blue-900 font-black uppercase tracking-widest">ติดตามอยู่</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              {isMe ? (
                <>
                  <button onClick={() => setEditing(true)} className="h-14 bg-blue-50 text-blue-950 rounded-2xl font-black border-2 border-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all"><Settings size={18} /> แก้ไข</button>
                  <button onClick={() => setShowLogoutConfirm(true)} className="h-14 bg-red-50 text-red-600 rounded-2xl font-black border-2 border-red-100 flex items-center justify-center gap-2 active:scale-95 transition-all"><LogOut size={18} /> ออก</button>
                </>
              ) : (
                <>
                  <button onClick={() => isFollowing ? unfollowUser(user.id) : followUser(user.id)} className={`h-14 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md ${isFollowing ? 'bg-gray-100 text-gray-700' : 'bg-pink-600 text-white'}`}>
                    <Heart size={18} fill={isFollowing ? 'currentColor' : 'none'} /> {isFollowing ? 'เลิกตาม' : 'ติดตาม'}
                  </button>
                  <button onClick={() => onStartChat(user)} className="h-14 bg-blue-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"><MessageCircle size={18} /> แชท</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-[100] backdrop-blur-md">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-xs text-center shadow-2xl border-4 border-red-50">
            <h3 className="text-xl font-black text-blue-950 mb-8 leading-tight">ต้องการออกจากระบบ จริงๆ ใช่ไหม?</h3>
            <div className="flex flex-col gap-3">
              <button onClick={logout} className="w-full h-14 bg-red-600 text-white rounded-2xl font-black shadow-lg">ยืนยัน ออกเลย</button>
              <button onClick={() => setShowLogoutConfirm(false)} className="w-full h-14 bg-gray-200 text-blue-950 rounded-2xl font-black">ไม่ เอาไว้ก่อน</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ... Rest of the code remains identical to current App.tsx ...

const MenuPage = ({ onSelectUser }: { onSelectUser: (u: UserProfile) => void }) => {
  const { foodItems, currentUser, addFood, updateFood, placeOrder, users } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [showOrder, setShowOrder] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, stock: 0, imageUrl: '', isHidden: false });
  const [orderForm, setOrderForm] = useState({ quantity: 1, note: '', pickupTime: '', pickupLocation: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault(); addFood(formData); setShowAdd(false);
    setFormData({ name: '', description: '', price: 0, stock: 0, imageUrl: '', isHidden: false });
  };

  const handleOrder = () => {
    if(!showOrder || !currentUser) return;
    placeOrder({...orderForm, foodId: showOrder.id, foodName: showOrder.name, sellerId: showOrder.sellerId, buyerId: currentUser.id, buyerName: currentUser.displayName, totalPrice: showOrder.price * orderForm.quantity });
    alert('🎉 สั่งซื้อสำเร็จแล้วจ้า!'); setShowOrder(null);
  };

  return (
    <div className="p-4 pt-6 pb-28 max-w-6xl mx-auto md:pt-24">
      <div className="flex justify-between items-center mb-8 px-2">
        <div>
          <h1 className="text-3xl font-black text-blue-950">ตลาดอาหาร 🥘</h1>
          <p className="text-xs font-bold text-gray-400">เลือกของอร่อยจากเพื่อนบ้าน</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="w-14 h-14 bg-pink-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"><PlusCircle size={28} /></button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {foodItems.filter(f => !f.isHidden || f.sellerId === currentUser?.id).map(item => (
          <div key={item.id} className="bg-white rounded-[1.8rem] overflow-hidden shadow-md border-2 border-gray-100 flex flex-col group hover:shadow-xl transition-all">
            <div className="relative overflow-hidden h-36 md:h-56">
              <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-500" alt={item.name} />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl font-black text-pink-600 text-base shadow-md">฿{item.price}</div>
              {item.isHidden && <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-[8px] font-black uppercase">ถูกซ่อน</div>}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-base font-black text-blue-950 mb-0.5 leading-tight truncate">{item.name}</h3>
              <button onClick={() => { const s = users.find(u => u.id === item.sellerId); if(s) onSelectUser(s); }} className="text-[10px] font-black text-blue-700 text-left mb-2 flex items-center gap-1 active:opacity-50">
                👩‍🍳 โดย {item.sellerName}
              </button>
              
              <div className="flex items-center justify-between mb-3 bg-gray-50 p-2 rounded-xl">
                <div className="flex items-center gap-1"><Star className="text-yellow-500 fill-current" size={14} /><span className="text-xs font-black text-blue-950">{item.rating.toFixed(1)}</span></div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.stock > 0 ? `เหลือ: ${item.stock}` : 'หมด'}
                </span>
              </div>
              
              <div className="mt-auto">
                {item.sellerId === currentUser?.id ? (
                  <button onClick={() => updateFood(item.id, { isHidden: !item.isHidden })} className={`w-full py-2.5 rounded-xl text-[10px] font-black transition-all border-2 ${item.isHidden ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.isHidden ? 'แสดงเมนู' : 'ซ่อนเมนู'}
                  </button>
                ) : (
                  <button disabled={item.stock <= 0} onClick={() => setShowOrder(item)} className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-black text-sm shadow-md disabled:opacity-50 active:scale-95 transition-all">สั่งซื้อ</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-end md:items-center justify-center p-0 md:p-6 backdrop-blur-md">
          <form onSubmit={handleAdd} className="bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 w-full max-w-md space-y-5 border-t-4 border-pink-50 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-black text-blue-950">เพิ่มเมนูอร่อย 🍛</h3>
              <button type="button" onClick={() => setShowAdd(false)} className="text-gray-400"><XCircle /></button>
            </div>
            <div className="space-y-4">
              <input placeholder="ชื่ออาหาร" required className="w-full h-14 px-4 bg-gray-50 rounded-2xl font-black border-2 border-gray-200 outline-none focus:border-pink-600 text-blue-950" onChange={e => setFormData({...formData, name: e.target.value})} />
              <textarea placeholder="คำอธิบายความอร่อย..." className="w-full p-4 bg-gray-50 rounded-2xl font-black border-2 border-gray-200 outline-none focus:border-pink-600 text-blue-950 h-24 resize-none" onChange={e => setFormData({...formData, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="ราคา (฿)" required className="w-full h-14 px-4 bg-gray-50 rounded-2xl font-black border-2 border-gray-200 outline-none" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                <input type="number" placeholder="จำนวน" required className="w-full h-14 px-4 bg-gray-50 rounded-2xl font-black border-2 border-gray-200 outline-none" onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
              </div>
              <input placeholder="Link รูปภาพ (URL)" className="w-full h-14 px-4 bg-gray-50 rounded-2xl font-black border-2 border-gray-200 outline-none" onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
            </div>
            <button type="submit" className="w-full h-16 bg-pink-600 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">ลงขายเลย 🚀</button>
          </form>
        </div>
      )}

      {showOrder && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-end md:items-center justify-center p-0 md:p-6 backdrop-blur-md">
          <div className="bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 w-full max-w-md space-y-6 border-t-4 border-blue-100 shadow-2xl">
            <div className="text-center">
              <h3 className="text-2xl font-black text-blue-950 mb-1">{showOrder.name}</h3>
              <p className="text-pink-600 font-black">฿{showOrder.price} ต่อชิ้น</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-[2rem] text-center border-2 border-blue-100">
              <div className="flex items-center justify-center gap-6">
                <button onClick={() => orderForm.quantity > 1 && setOrderForm({...orderForm, quantity: orderForm.quantity - 1})} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-950 font-black text-2xl border-2 border-blue-200">-</button>
                <span className="w-12 font-black text-3xl text-blue-950">{orderForm.quantity}</span>
                <button onClick={() => orderForm.quantity < showOrder.stock && setOrderForm({...orderForm, quantity: orderForm.quantity + 1})} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-950 font-black text-2xl border-2 border-blue-200">+</button>
              </div>
            </div>
            <div className="space-y-3">
              <input placeholder="เวลานัดรับ" required className="w-full h-14 px-4 bg-gray-50 rounded-2xl border-2 border-gray-200 font-black text-blue-950" value={orderForm.pickupTime} onChange={e => setOrderForm({...orderForm, pickupTime: e.target.value})} />
              <input placeholder="จุดนัดพบ" required className="w-full h-14 px-4 bg-gray-50 rounded-2xl border-2 border-gray-200 font-black text-blue-950" value={orderForm.pickupLocation} onChange={e => setOrderForm({...orderForm, pickupLocation: e.target.value})} />
              <input placeholder="หมายเหตุ" className="w-full h-14 px-4 bg-gray-50 rounded-2xl border-2 border-gray-200 font-black text-blue-950" value={orderForm.note} onChange={e => setOrderForm({...orderForm, note: e.target.value})} />
            </div>
            <button onClick={handleOrder} className="w-full h-16 bg-pink-600 text-white rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all">สั่งเลย ✨</button>
            <button onClick={() => setShowOrder(null)} className="w-full h-16 bg-gray-100 text-blue-950 rounded-2xl font-black">ยกเลิก</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatPage = ({ initialTarget }: { initialTarget: UserProfile | 'group' | null }) => {
  const { chats, users, currentUser, sendMessage } = useApp();
  const [selected, setSelected] = useState<UserProfile | 'group' | null>(initialTarget);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [uidInput, setUidInput] = useState('');
  const [showUidAdd, setShowUidAdd] = useState(false);

  const filteredMessages = chats.filter(c => selected === 'group' ? c.receiverId === 'group' : (selected && ((c.senderId === currentUser?.id && c.receiverId === selected.id) || (c.senderId === selected.id && c.receiverId === currentUser?.id))));
  
  const chatList = useMemo(() => {
    const ids = new Set(chats.map(c => c.senderId === currentUser?.id ? c.receiverId : c.senderId));
    return users.filter(u => ids.has(u.id) && u.id !== currentUser?.id);
  }, [chats, users, currentUser]);

  const handleSend = () => {
    if(!text.trim() || !selected) return;
    sendMessage({ senderId: currentUser!.id, receiverId: selected === 'group' ? 'group' : selected.id, text });
    setText('');
  };

  const startByUid = () => {
    const target = users.find(u => u.id === uidInput.trim().toUpperCase());
    if (target) {
      if (target.id === currentUser?.id) return alert('คุยกับตัวเองไม่ได้จ้า!');
      setSelected(target); setShowUidAdd(false); setUidInput('');
    } else {
      alert('ไม่เจอ UID นี้จ้า 🔍');
    }
  };

  if (selected) {
    return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col h-screen">
        <div className="bg-blue-950 text-white p-4 pt-12 md:pt-4 flex items-center gap-4 shadow-lg">
          <button onClick={() => setSelected(null)} className="p-2 bg-white/10 rounded-full"><ChevronLeft size={28} strokeWidth={3} /></button>
          <div className="flex items-center gap-3">
            <img src={selected === 'group' ? 'https://api.dicebear.com/7.x/shapes/svg?seed=group' : selected.profilePic} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" alt="avatar" />
            <div>
              <p className="font-black text-lg leading-none">{selected === 'group' ? 'หมู่บ้านเรา 🏘️' : selected.displayName}</p>
              <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mt-1">{selected === 'group' ? 'คุยรวมทุกคน' : `UID: ${selected.id}`}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col-reverse">
          <div className="h-2"></div>
          {[...filteredMessages].reverse().map(m => {
            const isMe = m.senderId === currentUser?.id;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-5 py-3.5 rounded-[1.5rem] text-base font-black shadow-sm ${isMe ? 'bg-pink-600 text-white rounded-tr-none' : 'bg-white text-blue-950 rounded-tl-none border border-gray-100'}`}>
                  {selected === 'group' && !isMe && <p className="text-[8px] font-black text-blue-800 mb-1 uppercase">@ {users.find(u => u.id === m.senderId)?.displayName}</p>}
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 bg-white border-t-2 border-gray-100 flex gap-2 pb-10 md:pb-4 items-center safe-bottom">
          <input className="flex-1 h-14 px-6 bg-gray-100 rounded-2xl outline-none font-black text-blue-950 border-2 border-transparent focus:border-pink-600 transition-all" placeholder="พิมพ์อะไรดีนะ..." value={text} onChange={e => setText(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} />
          <button onClick={handleSend} className="w-14 h-14 bg-pink-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"><Send size={24} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-6 pb-28 max-w-3xl mx-auto md:pt-24">
      <div className="flex justify-between items-center mb-8 px-2">
        <h1 className="text-3xl font-black text-blue-950">แชทคุยกัน 💬</h1>
        <button onClick={() => setShowUidAdd(true)} className="p-3 bg-blue-900 text-white rounded-xl font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"><UserPlus size={16} /> ใส่ UID</button>
      </div>
      <div className="relative mb-8">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-950" size={24} strokeWidth={3} />
        <input className="w-full pl-14 pr-6 h-16 bg-white rounded-2xl border-2 border-gray-100 outline-none font-black text-blue-950 shadow-sm focus:border-pink-600 transition-all" placeholder="ค้นหาเพื่อนบ้าน..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="space-y-3">
        <div onClick={() => setSelected('group')} className="bg-white p-5 rounded-[2rem] border-2 border-pink-50 shadow-md flex items-center gap-4 cursor-pointer hover:bg-pink-50 transition-all active:scale-95 group">
          <div className="w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white group-hover:rotate-12 transition-transform">G</div>
          <div className="flex-1">
            <p className="font-black text-lg text-blue-950 leading-none mb-1">กลุ่มแชทสาธารณะ 🏘️</p>
            <p className="text-xs text-pink-600 font-black opacity-80 italic truncate">รวมตัวคนรักของกิน มาคุยกัน!</p>
          </div>
        </div>
        {(search ? users.filter(u => u.displayName.toLowerCase().includes(search.toLowerCase()) && u.id !== currentUser?.id) : chatList).map(u => (
          <div key={u.id} onClick={() => setSelected(u)} className="bg-white p-4 rounded-[1.8rem] border-2 border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-blue-50 transition-all active:scale-95 group">
            <img src={u.profilePic} className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover" alt="avatar" />
            <div className="flex-1">
              <p className="font-black text-lg text-blue-950 leading-none mb-1">{u.displayName}</p>
              <div className="flex gap-2 items-center opacity-60 text-[8px] font-black uppercase tracking-widest">
                <p className="text-blue-800">{u.email}</p>
                <p className="text-pink-600">UID: {u.id}</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-gray-200" />
          </div>
        ))}
      </div>
      {showUidAdd && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm space-y-5 border-4 border-blue-900 shadow-2xl text-center">
            <h3 className="text-2xl font-black text-blue-950">เริ่มแชทด้วย UID</h3>
            <input autoFocus placeholder="UXXXXXX" className="w-full h-16 bg-gray-50 rounded-2xl border-4 border-gray-200 outline-none focus:border-blue-900 font-black text-3xl text-center text-blue-950 uppercase" value={uidInput} onChange={e => setUidInput(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={startByUid} className="flex-1 h-16 bg-blue-900 text-white rounded-2xl font-black">คุยเลย</button>
              <button onClick={() => setShowUidAdd(false)} className="flex-1 h-16 bg-gray-100 text-blue-950 rounded-2xl font-black">ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationPage = () => {
  const { notifications, currentUser, deleteNotification } = useApp();
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id).sort((a,b) => b.createdAt - a.createdAt);
  return (
    <div className="p-4 pt-6 pb-28 max-w-2xl mx-auto md:pt-24">
      <h1 className="text-3xl font-black text-blue-950 mb-8 px-2">แจ้งเตือน 🔔</h1>
      <div className="space-y-4">
        {myNotifs.map(n => (
          <div key={n.id} className="bg-white p-5 rounded-[2rem] border-2 border-gray-100 shadow-md flex gap-4 relative group active:scale-[0.98]">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${n.type === 'order' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-800'}`}>
              <Bell size={24} strokeWidth={3} />
            </div>
            <div className="flex-1 pr-6">
              <p className="font-black text-lg text-blue-950 mb-0.5 leading-tight">{n.title}</p>
              <p className="text-xs text-gray-600 font-bold">{n.message}</p>
            </div>
            <button onClick={() => deleteNotification(n.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-600"><XCircle size={24} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const { orders, currentUser, updateOrderStatus } = useApp();
  const [view, setView] = useState<'buy' | 'sell'>('buy');
  const filtered = orders.filter(o => view === 'buy' ? o.buyerId === currentUser?.id : o.sellerId === currentUser?.id).sort((a,b) => b.createdAt - a.createdAt);
  return (
    <div className="p-4 pt-6 pb-28 max-w-3xl mx-auto md:pt-24">
      <h1 className="text-3xl font-black text-blue-950 mb-6 px-2">ออเดอร์ 📝</h1>
      <div className="flex bg-gray-200 p-1.5 rounded-2xl mb-8 shadow-inner border border-gray-300">
        <button onClick={() => setView('buy')} className={`flex-1 py-4 rounded-[1rem] font-black text-lg ${view === 'buy' ? 'bg-white shadow-md text-pink-600' : 'text-gray-600'}`}>🛍️ ฉันสั่ง</button>
        <button onClick={() => setView('sell')} className={`flex-1 py-4 rounded-[1rem] font-black text-lg ${view === 'sell' ? 'bg-white shadow-md text-blue-900' : 'text-gray-600'}`}>💰 ฉันขาย</button>
      </div>
      <div className="space-y-6">
        {filtered.map(o => (
          <div key={o.id} className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 shadow-lg relative overflow-hidden active:scale-[0.98]">
            <div className={`absolute top-0 left-0 w-2 h-full ${o.status === 'processing' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-2xl text-blue-950">{o.foodName} <span className="text-pink-600 ml-1">x{o.quantity}</span></h3>
                <p className="text-2xl font-black text-blue-900">฿{o.totalPrice}</p>
              </div>
              <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${o.status === 'processing' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-green-50 text-green-800 border-green-200'}`}>{o.status === 'processing' ? '🕒 กำลังทำ' : '✅ สำเร็จ'}</span>
            </div>
            <div className="text-sm font-black space-y-2 text-blue-950 mb-6 bg-blue-50/30 p-4 rounded-[1.5rem]">
              <p>📍 {o.pickupLocation}</p>
              <p>⏰ {o.pickupTime}</p>
            </div>
            {view === 'sell' && o.status === 'processing' && (
              <div className="flex gap-2">
                <button onClick={() => updateOrderStatus(o.id, 'delivered')} className="flex-1 h-14 bg-green-600 text-white rounded-xl font-black">ส่งแล้ว ✅</button>
                <button onClick={() => updateOrderStatus(o.id, 'cancelled')} className="flex-1 h-14 bg-red-50 text-red-600 rounded-xl font-black">ยกเลิก</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = ({ setTab, onAdmin, onSelectUser }: { setTab: (t: string) => void, onAdmin: () => void, onSelectUser: (u: UserProfile) => void }) => {
  const { currentUser, foodItems } = useApp();
  const trending = foodItems.slice(0, 4);
  return (
    <div className="p-4 pt-6 pb-28 max-w-4xl mx-auto md:pt-24">
      <div className="bg-gradient-to-br from-pink-600 via-pink-500 to-blue-900 rounded-[2.5rem] p-8 text-white mb-10 shadow-xl relative overflow-hidden group">
        <h1 className="text-3xl font-black mb-2 z-10 relative">หวัดดีจ้า, {currentUser?.displayName}! 👋</h1>
        <p className="text-pink-100 font-black text-base z-10 relative opacity-90 leading-relaxed max-w-[200px] md:max-w-md">วันนี้อยากทานอะไรอร่อยๆ ไหม? ✨</p>
        {currentUser?.role === 'admin' && <button onClick={onAdmin} className="mt-8 px-6 py-3 bg-white/20 text-white rounded-xl font-black text-xs border border-white/40 active:scale-95 flex items-center gap-2 relative z-20"><ShieldCheck size={16} /> แผงควบคุมแอดมิน</button>}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button onClick={() => setTab('menu')} className="bg-white p-6 rounded-[2rem] border-2 border-pink-50 shadow-lg flex flex-col items-center gap-4 active:scale-95 group">
          <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center border border-pink-200"><ShoppingBag className="text-pink-600" size={32} /></div>
          <span className="font-black text-base text-blue-950">เมนูอาหาร</span>
        </button>
        <button onClick={() => setTab('orders')} className="bg-white p-6 rounded-[2rem] border-2 border-blue-50 shadow-lg flex flex-col items-center gap-4 active:scale-95 group">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center border border-blue-200"><CheckCircle2 className="text-blue-900" size={32} /></div>
          <span className="font-black text-base text-blue-950">ออเดอร์</span>
        </button>
      </div>
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-black text-blue-950 drop-shadow-sm">แนะนำวันนี้ 🔥</h2>
        <button onClick={() => setTab('menu')} className="text-pink-600 font-black text-xs hover:underline">ดูทั้งหมด</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {trending.map(item => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-gray-50 p-3 active:scale-95 transition-all group cursor-pointer" onClick={() => setTab('menu')}>
            <div className="h-28 rounded-xl mb-3 overflow-hidden"><img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} /></div>
            <p className="font-black text-blue-950 text-xs truncate mb-0.5">{item.name}</p>
            <p className="text-pink-600 font-black text-lg">฿{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = ({ users, onBack }: { users: UserProfile[], onBack: () => void }) => (
  <div className="p-4 pt-10 pb-28 max-w-4xl mx-auto md:pt-24">
    <div className="flex items-center gap-4 mb-8 px-2">
      <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-md border-2 border-gray-100"><ChevronLeft size={24} /></button>
      <h1 className="text-2xl font-black text-blue-950">Admin Control 🛡️</h1>
    </div>
    <div className="grid gap-6">
      {users.map(u => (
        <div key={u.id} className="bg-white p-5 md:p-8 rounded-[2rem] shadow-lg border-2 border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden group">
          <div className={`absolute top-0 right-0 px-4 py-1.5 font-black text-[10px] uppercase tracking-widest text-white ${u.role === 'admin' ? 'bg-blue-900' : 'bg-pink-600'}`}>{u.role}</div>
          <div className="shrink-0"><img src={u.profilePic} className="w-20 h-20 rounded-full border-4 border-gray-50 shadow-md object-cover" alt="avatar" /></div>
          <div className="flex-1 flex flex-col gap-4 text-center md:text-left w-full">
            <div><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">ชื่อแสดง</span><p className="font-black text-2xl text-blue-950">{u.displayName}</p></div>
            <div><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Email & UID</span><div className="flex flex-col md:flex-row gap-2 md:items-center"><p className="text-base text-pink-600 font-black bg-pink-50 px-3 py-1 rounded-xl border border-pink-100">{u.email}</p><p className="text-xs text-blue-900 font-black tracking-widest font-mono">@{u.id}</p></div></div>
          </div>
          <div className="text-center md:text-right bg-yellow-50 px-6 py-4 rounded-2xl border-2 border-yellow-100 min-w-[140px] shadow-inner"><p className="text-[9px] font-black text-yellow-900 uppercase mb-2 flex items-center justify-center md:justify-end gap-1"><Lock size={12} /> Password</p><p className="text-xl font-mono font-black text-pink-600">{u.password}</p></div>
        </div>
      ))}
    </div>
  </div>
);

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
  const [chatTarget, setChatTarget] = useState<UserProfile | 'group' | null>(null);
  const { currentUser, users } = useApp();
  if (!currentUser) return <LoginPage />;
  if (isAdmin) return <AdminDashboard users={users} onBack={() => setIsAdmin(false)} />;
  const showProfile = (user: UserProfile) => {
    if(user.id === currentUser.id) setActiveTab('profile');
    else setViewedProfile(user);
  };
  const renderContent = () => {
    if (viewedProfile) return <ProfilePage user={viewedProfile} onBack={() => setViewedProfile(null)} onStartChat={(u) => { setChatTarget(u); setViewedProfile(null); setActiveTab('chat'); }} />;
    switch(activeTab) {
      case 'home': return <HomePage setTab={setActiveTab} onAdmin={() => setIsAdmin(true)} onSelectUser={showProfile} />;
      case 'menu': return <MenuPage onSelectUser={showProfile} />;
      case 'orders': return <OrdersPage />;
      case 'chat': return <ChatPage initialTarget={chatTarget} />;
      case 'notif': return <NotificationPage />;
      case 'profile': return <ProfilePage user={currentUser} onStartChat={(u) => { setChatTarget(u); setActiveTab('chat'); }} />;
      default: return null;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 text-blue-950 selection:bg-pink-200 selection:text-pink-800">
      <Navbar activeTab={activeTab} setTab={(t) => { setActiveTab(t); setViewedProfile(null); setChatTarget(null); }} isAdmin={currentUser.role === 'admin'} />
      <main className="max-w-screen-xl mx-auto pb-10">{renderContent()}</main>
    </div>
  );
};

const App = () => (<AppProvider><MainApp /></AppProvider>);
export default App;
