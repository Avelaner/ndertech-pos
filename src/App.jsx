import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  ShieldCheck, 
  Store, 
  BarChart3, 
  Layers, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Zap,
  Globe,
  Database,
  Server,
  RefreshCw,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  MapPin,
  ArrowLeft,
  Menu,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Check,
  LayoutDashboard,
  LogOut,
  UserPlus
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Authenticated User State
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard Management State (Branches & Staff)
  const [branches, setBranches] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [newBranchData, setNewBranchData] = useState({ branchName: '', address: '', phone: '' });
  const [newStaffData, setNewStaffData] = useState({ branchId: '', name: '', email: '', password: '', roleId: 'cashier' });

  // Legal Modal States for Sign Up
  const [activeLegalModal, setActiveLegalModal] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Password visibility states
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Sign In Form States
  const [signInData, setSignInData] = useState({ email: '', password: '' });

  // Conversational Sign-Up State
  const [signupStep, setSignupStep] = useState(1);
  const [formData, setFormData] = useState({
    planId: 1,
    planName: 'Starter Plan',
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  const sanitizeInput = (value) => value.replace(/[<>]/g, '');

  const handleInputChange = (field, value) => {
    const sanitized = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitized }));
  };

  const selectPlanAndStart = (id, name) => {
    setFormData(prev => ({ ...prev, planId: id, planName: name }));
    setCurrentView('signup');
    setSignupStep(1);
  };

  const pwd = formData.password;
  const hasLength = pwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
  const isPasswordValid = hasLength && hasUppercase && hasNumber && hasSymbol;

  // Handle Tenant Registration Form Submission
  const handleNextStep = async (e) => {
    e.preventDefault();
    if (signupStep < 4) {
      setSignupStep(signupStep + 1);
    } else {
      if (!isPasswordValid) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        setIsLoading(false);

        if (data.success) {
          Swal.fire({
            title: 'Success!',
            text: data.message || `Tenant instance for ${formData.companyName} initialized successfully!`,
            icon: 'success',
            confirmButtonColor: '#059669',
            background: '#0f172a',
            color: '#f8fafc'
          });
          setCurrentView('signin');
        } else {
          Swal.fire({
            title: 'Error',
            text: data.message || 'Registration failed.',
            icon: 'error',
            confirmButtonColor: '#059669',
            background: '#0f172a',
            color: '#f8fafc'
          });
        }
      } catch (err) {
        setIsLoading(false);
        Swal.fire({
          title: 'Connection Error',
          text: 'Failed to connect to backend server.',
          icon: 'error',
          confirmButtonColor: '#059669',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    }
  };

  // Handle User Sign-In Submission & Load Dashboard Data
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...signInData })
      });
      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        setLoggedInUser(data.user);
        setCurrentView('dashboard');
        fetchDashboardData(data.user.tenantId);
        Swal.fire({
          title: 'Welcome Back!',
          text: `Login successful. Welcome, ${data.user.name}.`,
          icon: 'success',
          confirmButtonColor: '#059669',
          background: '#0f172a',
          color: '#f8fafc'
        });
      } else {
        Swal.fire({
          title: 'Access Denied',
          text: data.message || 'Invalid email or password.',
          icon: 'warning',
          confirmButtonColor: '#059669',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        title: 'Connection Error',
        text: 'Failed to connect to backend sign-in service.',
        icon: 'error',
        confirmButtonColor: '#059669',
        background: '#0f172a',
        color: '#f8fafc'
      });
    }
  };

  const fetchDashboardData = async (tenantId) => {
    try {
      const res = await fetch('/api/branches', {
        headers: { 'Tenant-Id': tenantId }
      });
      const data = await res.json();
      if (data.success) {
        setBranches(data.branches);
        setStaffUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard records', err);
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!loggedInUser) return;

    try {
      const res = await fetch('/api/branches?action=create_branch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Tenant-Id': loggedInUser.tenantId },
        body: JSON.stringify(newBranchData)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ title: 'Success', text: data.message, icon: 'success', background: '#0f172a', color: '#f8fafc', confirmButtonColor: '#059669' });
        setNewBranchData({ branchName: '', address: '', phone: '' });
        fetchDashboardData(loggedInUser.tenantId);
      } else {
        Swal.fire({ title: 'Limit Reached', text: data.message, icon: 'warning', background: '#0f172a', color: '#f8fafc', confirmButtonColor: '#059669' });
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Failed to create branch', icon: 'error', background: '#0f172a', color: '#f8fafc', confirmButtonColor: '#059669' });
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!loggedInUser) return;

    try {
      const res = await fetch('/api/branches?action=create_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Tenant-Id': loggedInUser.tenantId },
        body: JSON.stringify(newStaffData)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ title: 'Success', text: data.message, icon: 'success', background: '#0f172a', color: '#f8fafc', confirmButtonColor: '#059669' });
        setNewStaffData({ branchId: '', name: '', email: '', password: '', roleId: 'cashier' });
        fetchDashboardData(loggedInUser.tenantId);
      } else {
        Swal.fire({ title: 'Limit Reached', text: data.message, icon: 'warning', background: '#0f172a', color: '#f8fafc', confirmButtonColor: '#059669' });
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Failed to allocate staff member', icon: 'error', background: '#0f172a', color: '#f8fafc', confirmButtonColor: '#059669' });
    }
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (view === 'signup') setSignupStep(1);
    window.scrollTo(0, 0);
  };

  const plans = [
    { id: 1, name: "Starter Plan", price: "₦15,000", period: "per month", desc: "Ideal for growing single-counter retail shops.", branches: "1 Store Branch", usersPerBranch: "Up to 3 Users per Branch", customers: "500 Saved Customers", transactions: "1,000 Monthly Transactions", highlight: false },
    { id: 2, name: "Professional Plan", price: "₦45,000", period: "per month", desc: "Perfect for supermarkets and multi-branch retail chains.", branches: "Up to 3 Store Branches", usersPerBranch: "Up to 5 Users per Branch", customers: "5,000 Saved Customers", transactions: "10,000 Monthly Transactions", highlight: true },
    { id: 3, name: "Enterprise Plan", price: "₦120,000", period: "per month", desc: "Built for large wholesale distributors and corporate networks.", branches: "Up to 10 Store Branches", usersPerBranch: "Up to 10 Users per Branch", customers: "50,000 Saved Customers", transactions: "100,000 Monthly Transactions", highlight: false }
  ];

  // ================= VIEW: AUTHENTICATED DASHBOARD =================
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-emerald-500 selection:text-white">
        
        <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-4 sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-sm">NderTech POS SaaS</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg bg-slate-800 text-slate-200">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div>
            <div className="hidden md:flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white">NderTech POS</span>
                <span className="block text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">Enterprise Hub</span>
              </div>
            </div>

            <nav className="space-y-2 text-sm font-medium">
              <button onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard Overview</span>
              </button>
              <button onClick={() => { setActiveTab('pos'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'pos' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <ShoppingCart className="w-5 h-5" />
                <span>POS Terminal (₦)</span>
              </button>
              <button onClick={() => { setActiveTab('inventory'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'inventory' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Package className="w-5 h-5" />
                <span>Inventory Stock</span>
              </button>
              <button onClick={() => { setActiveTab('branches'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'branches' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Building className="w-5 h-5" />
                <span>Branches & Staff</span>
              </button>
              <button onClick={() => { setActiveTab('invoices'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'invoices' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <FileText className="w-5 h-5" />
                <span>B2B Invoicing</span>
              </button>
              <button onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'reports' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <BarChart3 className="w-5 h-5" />
                <span>Sales & Reports</span>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-center space-x-3 mb-4 px-2">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                {loggedInUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{loggedInUser?.name || 'Admin User'}</p>
                <p className="text-xs text-slate-400 truncate">{loggedInUser?.email || 'admin@company.com'}</p>
              </div>
            </div>
            <button onClick={() => { setLoggedInUser(null); navigateTo('landing'); }} className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-4 sm:p-8">
          
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-black text-white capitalize">{activeTab.replace('_', ' ')}</h1>
              <p className="text-xs text-slate-400">Manage your multi-branch operations and team allocation in Nigerian Naira (₦).</p>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                Active Tenant Instance
              </span>
            </div>
          </header>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Total Sales (Today)</p>
                  <p className="text-3xl font-black text-white">₦0.00</p>
                  <span className="text-xs text-emerald-400 font-semibold mt-2 block">+0% from yesterday</span>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Active Branches</p>
                  <p className="text-3xl font-black text-white">{branches.length}</p>
                  <span className="text-xs text-slate-500 mt-2 block">Multi-store synchronized</span>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Allocated Staff</p>
                  <p className="text-3xl font-black text-white">{staffUsers.length}</p>
                  <span className="text-xs text-slate-500 mt-2 block">Cashiers & Admins</span>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">B2B Invoices</p>
                  <p className="text-3xl font-black text-white">0</p>
                  <span className="text-xs text-emerald-400 font-semibold mt-2 block">All cleared</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <Building className="w-5 h-5 text-emerald-400" />
                    <span>Create Store Branch</span>
                  </h3>
                  <form onSubmit={handleCreateBranch} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Branch Name</label>
                      <input type="text" required value={newBranchData.branchName} onChange={(e) => setNewBranchData({...newBranchData, branchName: e.target.value})} placeholder="Wuse Market Branch" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Address</label>
                      <input type="text" required value={newBranchData.address} onChange={(e) => setNewBranchData({...newBranchData, address: e.target.value})} placeholder="Abuja, Nigeria" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Phone</label>
                      <input type="tel" required value={newBranchData.phone} onChange={(e) => setNewBranchData({...newBranchData, phone: e.target.value})} placeholder="+234 800 000 0000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all">
                      Add New Branch
                    </button>
                  </form>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-emerald-400" />
                    <span>Allocate Staff / Cashier</span>
                  </h3>
                  <form onSubmit={handleCreateStaff} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Select Branch</label>
                      <select required value={newStaffData.branchId} onChange={(e) => setNewStaffData({...newStaffData, branchId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500">
                        <option value="">Choose Branch</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Staff Full Name</label>
                      <input type="text" required value={newStaffData.name} onChange={(e) => setNewStaffData({...newStaffData, name: e.target.value})} placeholder="Jane Doe" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Staff Email</label>
                      <input type="email" required value={newStaffData.email} onChange={(e) => setNewStaffData({...newStaffData, email: e.target.value})} placeholder="jane@company.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Temporary Password</label>
                      <input type="password" required value={newStaffData.password} onChange={(e) => setNewStaffData({...newStaffData, password: e.target.value})} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all">
                      Allocate Staff Member
                    </button>
                  </form>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-4">Store Branches Network ({branches.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                      <tr>
                        <th className="p-4">Branch Name</th>
                        <th className="p-4">Address</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {branches.map(b => (
                        <tr key={b.id} className="hover:bg-slate-950/50">
                          <td className="p-4 font-bold text-white">{b.branch_name} {b.is_main && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Main</span>}</td>
                          <td className="p-4">{b.address}</td>
                          <td className="p-4">{b.phone}</td>
                          <td className="p-4 text-emerald-400 font-semibold">Active</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pos' && (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <ShoppingCart className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">POS Touch Terminal (₦ Naira)</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">Barcode scanning, receipt printing, and cashier split checkout ready.</p>
              <button onClick={() => Swal.fire({ title: 'POS Ready', text: 'Select a product or scan barcode.', icon: 'info', background: '#0f172a', color: '#f8fafc', confirmButtonColor: '#059669' })} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm">
                Open Cashier Drawer
              </button>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <Package className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Multi-Location Inventory Stock</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">Real-time stock matrix and automated low-stock alerts.</p>
              <button onClick={() => Swal.fire({ title: 'Inventory', text: 'No products added yet.', icon: 'info', background: '#0f172a', color: '#f8fafc', confirmButtonColor: '#059669' })} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm">
                Add Stock Item
              </button>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <FileText className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">B2B Quotations & Invoicing</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">Convert quotations into proforma invoices with ₦ payment logging.</p>
              <button onClick={() => Swal.fire({ title: 'B2B Invoices', text: 'Create your first wholesale quote.', icon: 'info', background: '#0f172a', color: '#f8fafc', confirmButtonColor: '#059669' })} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm">
                Create B2B Quote
              </button>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <BarChart3 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Business Analytics & Z-Reports</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">Export daily summaries and profit margin trends in Naira.</p>
              <button onClick={() => Swal.fire({ title: 'Reports', text: 'Generating Z-report...', icon: 'success', background: '#0f172a', color: '#f8fafc', confirmButtonColor: '#059669' })} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm">
                Download CSV Export
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ================= VIEW: SIGN IN =================
  if (currentView === 'signin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
        <div className="max-w-md mx-auto w-full pt-10">
          <button onClick={() => navigateTo('landing')} className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
              <Store className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-slate-400 mb-8">Sign in to your NderTech POS SaaS dashboard.</p>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                  <input type="email" required value={signInData.email} onChange={(e) => setSignInData({...signInData, email: e.target.value})} placeholder="name@company.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                  <button type="button" onClick={() => navigateTo('forgot')} className="text-xs text-emerald-400 hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                  <input type={showSignInPassword ? "text" : "password"} required value={signInData.password} onChange={(e) => setSignInData({...signInData, password: e.target.value})} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 pr-12 text-white text-sm focus:outline-none focus:border-emerald-500" />
                  <button type="button" onClick={() => setShowSignInPassword(!showSignInPassword)} className="absolute right-3.5 top-3 text-slate-400 hover:text-white">
                    {showSignInPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all mt-4 flex items-center justify-center space-x-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isLoading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Don't have a store account?{' '}
              <button onClick={() => navigateTo('signup')} className="text-emerald-400 font-semibold hover:underline">Get Started</button>
            </div>
          </div>
        </div>
        <footer className="text-center text-xs text-slate-600 py-4">&copy; 2026 NderTech Universal Services.</footer>
      </div>
    );
  }

  // ================= VIEW: SIGN UP (4 STEPS) =================
  if (currentView === 'signup') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative">
        <div className="max-w-md mx-auto w-full pt-10">
          <button onClick={() => navigateTo('landing')} className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step {signupStep} of 4</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {signupStep === 1 ? 'Selected Plan' : signupStep === 2 ? 'Personal Info' : signupStep === 3 ? 'Business Details' : 'Secure Account'}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {signupStep === 1 && "Confirm your subscription"}
              {signupStep === 2 && "Let's get to know you"}
              {signupStep === 3 && "Tell us about your business"}
              {signupStep === 4 && "Secure your SaaS instance"}
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              {signupStep === 1 && `You selected the ${formData.planName}. All 8 modules included!`}
              {signupStep === 2 && "Please enter your name and professional contact email."}
              {signupStep === 3 && "We need your store name, phone number, and branch address."}
              {signupStep === 4 && "Create a secure password with live strength verification."}
            </p>

            <form onSubmit={handleNextStep} className="space-y-4">
              {signupStep === 1 && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{formData.planName}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">Active Selection</span>
                  </div>
                  <p className="text-xs text-slate-400">Includes branch allocation, cashier RBAC, and all 8 enterprise modules.</p>
                </div>
              )}

              {signupStep === 2 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input type="text" required value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="Engr. Avela Marcel" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Work Email</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input type="email" required value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="admin@ndertech.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                </>
              )}

              {signupStep === 3 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Company / Store Name</label>
                    <div className="relative">
                      <Building className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input type="text" required value={formData.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} placeholder="NderTech Hub" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input type="tel" required value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+234 800 000 0000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Business Address</label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input type="text" required value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="Makurdi, Benue State, Nigeria" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                </>
              )}

              {signupStep === 4 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input type={showSignUpPassword ? "text" : "password"} required value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 pr-12 text-white text-sm focus:outline-none focus:border-emerald-500" />
                      <button type="button" onClick={() => setShowSignUpPassword(!showSignUpPassword)} className="absolute right-3.5 top-3 text-slate-400 hover:text-white">
                        {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password Requirements:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center space-x-2 ${hasLength ? 'text-emerald-400' : 'text-slate-500'}`}><CheckCircle2 className="w-3.5 h-3.5" /><span>8+ chars</span></div>
                        <div className={`flex items-center space-x-2 ${hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}><CheckCircle2 className="w-3.5 h-3.5" /><span>1 uppercase</span></div>
                        <div className={`flex items-center space-x-2 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}><CheckCircle2 className="w-3.5 h-3.5" /><span>1 number</span></div>
                        <div className={`flex items-center space-x-2 ${hasSymbol ? 'text-emerald-400' : 'text-slate-500'}`}><CheckCircle2 className="w-3.5 h-3.5" /><span>1 symbol</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input type="checkbox" required checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-emerald-500" />
                      <span className="text-xs text-slate-400 leading-relaxed">I agree to the Terms & Conditions and Privacy Policy.</span>
                    </label>
                  </div>
                </>
              )}

              <div className="flex items-center space-x-3 pt-4">
                {signupStep > 1 && (
                  <button type="button" onClick={() => setSignupStep(signupStep - 1)} disabled={isLoading} className="w-1/3 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all">Back</button>
                )}
                <button type="submit" disabled={isLoading || (signupStep === 4 && (!agreedToTerms || !isPasswordValid))} className={`${signupStep > 1 ? 'w-2/3' : 'w-full'} py-3.5 rounded-xl ${(signupStep === 4 && (!agreedToTerms || !isPasswordValid)) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'} font-semibold text-sm transition-all flex items-center justify-center space-x-2`}>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isLoading ? 'Initializing...' : (signupStep === 4 ? 'Launch Tenant Instance' : 'Continue')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <footer className="text-center text-xs text-slate-600 py-4">&copy; 2026 NderTech Universal Services.</footer>
      </div>
    );
  }

  // ================= VIEW: LANDING PAGE =================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">NderTech POS</span>
              <span className="block text-xs font-medium text-emerald-400 tracking-wider uppercase">Enterprise SaaS (₦)</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Plans & Allocation</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => navigateTo('signin')} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">Sign In</button>
            <button onClick={() => selectPlanAndStart(1, 'Starter Plan')} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all">Get Started</button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-6 space-y-4 shadow-2xl">
            <nav className="flex flex-col space-y-4 text-base font-medium text-slate-300">
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Plans & Allocation</a>
            </nav>
            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
              <button onClick={() => navigateTo('signin')} className="w-full py-3 text-center rounded-xl bg-slate-800 text-white font-semibold text-sm">Sign In</button>
              <button onClick={() => selectPlanAndStart(1, 'Starter Plan')} className="w-full py-3 text-center rounded-xl bg-emerald-600 text-white font-semibold text-sm">Get Started</button>
            </div>
          </div>
        )}
      </header>

      <section className="relative pt-20 pb-32 text-center px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white max-w-4xl mx-auto leading-tight">
          Multi-Branch POS & Staff Allocation Suite in <span className="text-emerald-400">₦ Naira</span>
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">Manage store branches, cashier roles, inventory stock, and B2B invoices effortlessly.</p>
        <div className="mt-10 flex justify-center space-x-4">
          <button onClick={() => selectPlanAndStart(1, 'Starter Plan')} className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30">
            Launch Your Store
          </button>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-slate-900/50 border-t border-slate-900 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Plans Based on Branches & Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map(plan => (
              <div key={plan.id} className={`p-8 rounded-3xl bg-slate-900 border ${plan.highlight ? 'border-emerald-500 shadow-xl' : 'border-slate-800'} flex flex-col justify-between`}>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-3xl font-black text-white mb-6">{plan.price} <span className="text-xs text-slate-500">/mo</span></p>
                  <div className="space-y-3 text-sm text-slate-300 mb-8 border-t border-slate-800 pt-4">
                    <div className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>{plan.branches}</span></div>
                    <div className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>{plan.usersPerBranch}</span></div>
                    <div className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>{plan.customers}</span></div>
                    <div className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-400" /><span>{plan.transactions}</span></div>
                  </div>
                </div>
                <button onClick={() => selectPlanAndStart(plan.id, plan.name)} className={`w-full py-3 rounded-xl font-semibold text-sm ${plan.highlight ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}>
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">
        &copy; 2026 NderTech Universal Services. All rights reserved.
      </footer>
    </div>
  );
}