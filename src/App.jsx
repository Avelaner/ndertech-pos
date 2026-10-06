import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  Store, 
  BarChart3, 
  FileText, 
  ArrowRight, 
  Sparkles,
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
  UserPlus,
  Truck,
  CreditCard,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Authenticated User State
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // CRUD States
  const [branches, setBranches] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  
  // Customers State
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Alhaji Dangote', phone: '+234 803 111 2222', email: 'dangote@b2b.ng', spent: '₦450,000' },
    { id: 2, name: 'Chief Mrs. Okoro', phone: '+234 805 333 4444', email: 'okoro@retail.ng', spent: '₦125,000' }
  ]);
  const [customerModal, setCustomerModal] = useState({ isOpen: false, editId: null, name: '', phone: '', email: '' });

  // Products State
  const [products, setProducts] = useState([
    { id: 1, name: 'Premium Rice 50kg', category: 'Grains', price: '₦75,000', stock: 45 },
    { id: 2, name: 'Vegetable Oil 25L', category: 'Groceries', price: '₦38,000', stock: 20 }
  ]);
  const [productModal, setProductModal] = useState({ isOpen: false, editId: null, name: '', category: '', price: '', stock: '' });

  // Suppliers State
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Northwind Agro Ltd', contact: '+234 802 999 0000', item: 'Grains & Cereals' }
  ]);
  const [supplierModal, setSupplierModal] = useState({ isOpen: false, editId: null, name: '', contact: '', item: '' });

  // Sales State
  const [sales, setSales] = useState([
    { id: 1, reference: 'POS-9001', customer: 'Alhaji Dangote', total: '₦75,000', date: '2026-10-06' }
  ]);
  const [saleModal, setSaleModal] = useState({ isOpen: false, reference: '', customer: '', total: '' });

  // Invoices & Billing State
  const [invoices, setInvoices] = useState([
    { id: 1, invNo: 'INV-5001', client: 'Chief Mrs. Okoro', amount: '₦125,000', status: 'Paid' }
  ]);

  // Subscription History State
  const [subscriptions] = useState([
    { id: 1, plan: 'Professional Plan', amount: '₦45,000', status: 'Active', renewal: '2026-11-06' }
  ]);

  // Form Management
  const [newBranchData, setNewBranchData] = useState({ branchName: '', address: '', phone: '' });
  const [newStaffData, setNewStaffData] = useState({ branchId: '', name: '', email: '', password: '', roleId: 'cashier' });

  // Legal Modal & Signup States
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
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
    setFormData(prev => ({ ...prev, [field]: sanitizeInput(value) }));
  };

  const selectPlanAndStart = (id, name) => {
    setFormData(prev => ({ ...prev, planId: id, planName: name }));
    setCurrentView('signup');
    setSignupStep(1);
  };

  const pwd = formData.password;
  const isPasswordValid = pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd);

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
          Swal.fire({ title: 'Success!', text: data.message, icon: 'success', confirmButtonColor: '#059669', background: '#0f172a', color: '#f8fafc' });
          setCurrentView('signin');
        } else {
          Swal.fire({ title: 'Error', text: data.message, icon: 'error', confirmButtonColor: '#059669', background: '#0f172a', color: '#f8fafc' });
        }
      } catch (err) {
        setIsLoading(false);
        Swal.fire({ title: 'Connection Error', text: 'Failed to connect to backend server.', icon: 'error', confirmButtonColor: '#059669', background: '#0f172a', color: '#f8fafc' });
      }
    }
  };

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
        Swal.fire({ title: 'Welcome Back!', text: `Login successful. Welcome, ${data.user.name}.`, icon: 'success', confirmButtonColor: '#059669', background: '#0f172a', color: '#f8fafc' });
      } else {
        Swal.fire({ title: 'Access Denied', text: data.message, icon: 'warning', confirmButtonColor: '#059669', background: '#0f172a', color: '#f8fafc' });
      }
    } catch (err) {
      setIsLoading(false);
      Swal.fire({ title: 'Connection Error', text: 'Failed to connect to backend sign-in service.', icon: 'error', confirmButtonColor: '#059669', background: '#0f172a', color: '#f8fafc' });
    }
  };

  const fetchDashboardData = async (tenantId) => {
    try {
      const res = await fetch('/api/branches', { headers: { 'Tenant-Id': tenantId } });
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
    { id: 1, name: "Starter Plan", price: "₦15,000", period: "per month", branches: "1 Store Branch", usersPerBranch: "Up to 3 Users per Branch", customers: "500 Saved Customers", highlight: false },
    { id: 2, name: "Professional Plan", price: "₦45,000", period: "per month", branches: "Up to 3 Store Branches", usersPerBranch: "Up to 5 Users per Branch", customers: "5,000 Saved Customers", highlight: true },
    { id: 3, name: "Enterprise Plan", price: "₦120,000", period: "per month", branches: "Up to 10 Store Branches", usersPerBranch: "Up to 10 Users per Branch", customers: "50,000 Saved Customers", highlight: false }
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
            <div className="hidden md:flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white">NderTech POS</span>
                <span className="block text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">User Dashboard</span>
              </div>
            </div>

            <nav className="space-y-1.5 text-sm font-medium">
              <button onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>
              <button onClick={() => { setActiveTab('pos'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-colors ${activeTab === 'pos' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <ShoppingCart className="w-4 h-4" />
                <span>POS Terminal (₦)</span>
              </button>
              <button onClick={() => { setActiveTab('products'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Package className="w-4 h-4" />
                <span>Products Stock</span>
              </button>
              <button onClick={() => { setActiveTab('customers'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-colors ${activeTab === 'customers' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Users className="w-4 h-4" />
                <span>Customers (CRM)</span>
              </button>
              <button onClick={() => { setActiveTab('suppliers'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-colors ${activeTab === 'suppliers' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Truck className="w-4 h-4" />
                <span>Suppliers</span>
              </button>
              <button onClick={() => { setActiveTab('sales'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-colors ${activeTab === 'sales' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <BarChart3 className="w-4 h-4" />
                <span>Sales Records</span>
              </button>
              <button onClick={() => { setActiveTab('invoices'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-colors ${activeTab === 'invoices' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <FileText className="w-4 h-4" />
                <span>Invoices & Billing</span>
              </button>
              <button onClick={() => { setActiveTab('subscriptions'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-colors ${activeTab === 'subscriptions' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <CreditCard className="w-4 h-4" />
                <span>Subscription History</span>
              </button>
              <button onClick={() => { setActiveTab('branches'); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-colors ${activeTab === 'branches' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <Building className="w-4 h-4" />
                <span>Branches & Staff</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-3 mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {loggedInUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{loggedInUser?.name || 'Admin User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{loggedInUser?.email || 'admin@company.com'}</p>
              </div>
            </div>
            <button onClick={() => { setLoggedInUser(null); navigateTo('landing'); }} className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-4 sm:p-8">
          
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-black text-white capitalize">{activeTab.replace('_', ' ')}</h1>
              <p className="text-xs text-slate-400">User-scoped operations and CRUD records in Nigerian Naira (₦).</p>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                User: {loggedInUser?.name || 'Active User'}
              </span>
            </div>
          </header>

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Total Sales (Today)</p>
                  <p className="text-3xl font-black text-white">₦75,000</p>
                  <span className="text-xs text-emerald-400 font-semibold mt-2 block">+100% user-scoped</span>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Products in Stock</p>
                  <p className="text-3xl font-black text-white">{products.length}</p>
                  <span className="text-xs text-slate-500 mt-2 block">CRUD active inventory</span>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Registered Customers</p>
                  <p className="text-3xl font-black text-white">{customers.length}</p>
                  <span className="text-xs text-slate-500 mt-2 block">CRM Directory</span>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Active Plan</p>
                  <p className="text-3xl font-black text-emerald-400">Pro</p>
                  <span className="text-xs text-slate-500 mt-2 block">Subscription verified</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS (CRUD) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Product Inventory (CRUD)</h3>
                <button onClick={() => setProductModal({ isOpen: true, editId: null, name: '', category: '', price: '', stock: '' })} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center space-x-2">
                  <Plus className="w-4 h-4" /><span>Add Product</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                    <tr>
                      <th className="p-4">Item Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (₦)</th>
                      <th className="p-4">Stock Units</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-950/50">
                        <td className="p-4 font-bold text-white">{p.name}</td>
                        <td className="p-4">{p.category}</td>
                        <td className="p-4 text-emerald-400">{p.price}</td>
                        <td className="p-4">{p.stock}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setProductModal({ isOpen: true, editId: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock })} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-emerald-400"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {productModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6">
                    <h3 className="text-lg font-bold text-white mb-4">{productModal.editId ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (productModal.editId) {
                        setProducts(products.map(x => x.id === productModal.editId ? { ...x, name: productModal.name, category: productModal.category, price: productModal.price, stock: productModal.stock } : x));
                      } else {
                        setProducts([...products, { id: Date.now(), name: productModal.name, category: productModal.category, price: productModal.price, stock: productModal.stock }]);
                      }
                      setProductModal({ isOpen: false, editId: null, name: '', category: '', price: '', stock: '' });
                    }} className="space-y-4">
                      <div><label className="text-xs text-slate-400 block mb-1">Product Name</label><input type="text" required value={productModal.name} onChange={e => setProductModal({...productModal, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div><label className="text-xs text-slate-400 block mb-1">Category</label><input type="text" required value={productModal.category} onChange={e => setProductModal({...productModal, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div><label className="text-xs text-slate-400 block mb-1">Price (₦)</label><input type="text" required value={productModal.price} onChange={e => setProductModal({...productModal, price: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div><label className="text-xs text-slate-400 block mb-1">Stock Units</label><input type="number" required value={productModal.stock} onChange={e => setProductModal({...productModal, stock: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div className="flex space-x-3 pt-2">
                        <button type="button" onClick={() => setProductModal({ isOpen: false })} className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
                        <button type="submit" className="w-1/2 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold">Save Product</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CUSTOMERS (CRM CRUD) */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Customer Directory (CRUD)</h3>
                <button onClick={() => setCustomerModal({ isOpen: true, editId: null, name: '', phone: '', email: '' })} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center space-x-2">
                  <Plus className="w-4 h-4" /><span>Add Customer</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Total Spent</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-950/50">
                        <td className="p-4 font-bold text-white">{c.name}</td>
                        <td className="p-4">{c.phone}</td>
                        <td className="p-4">{c.email}</td>
                        <td className="p-4 text-emerald-400">{c.spent || '₦0'}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setCustomerModal({ isOpen: true, editId: c.id, name: c.name, phone: c.phone, email: c.email })} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-emerald-400"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setCustomers(customers.filter(x => x.id !== c.id))} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {customerModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6">
                    <h3 className="text-lg font-bold text-white mb-4">{customerModal.editId ? 'Edit Customer' : 'Add New Customer'}</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (customerModal.editId) {
                        setCustomers(customers.map(x => x.id === customerModal.editId ? { ...x, name: customerModal.name, phone: customerModal.phone, email: customerModal.email } : x));
                      } else {
                        setCustomers([...customers, { id: Date.now(), name: customerModal.name, phone: customerModal.phone, email: customerModal.email, spent: '₦0' }]);
                      }
                      setCustomerModal({ isOpen: false, editId: null, name: '', phone: '', email: '' });
                    }} className="space-y-4">
                      <div><label className="text-xs text-slate-400 block mb-1">Full Name</label><input type="text" required value={customerModal.name} onChange={e => setCustomerModal({...customerModal, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div><label className="text-xs text-slate-400 block mb-1">Phone Number</label><input type="tel" required value={customerModal.phone} onChange={e => setCustomerModal({...customerModal, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div><label className="text-xs text-slate-400 block mb-1">Email Address</label><input type="email" required value={customerModal.email} onChange={e => setCustomerModal({...customerModal, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div className="flex space-x-3 pt-2">
                        <button type="button" onClick={() => setCustomerModal({ isOpen: false })} className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
                        <button type="submit" className="w-1/2 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold">Save Customer</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SUPPLIERS (CRUD) */}
          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Suppliers Directory (CRUD)</h3>
                <button onClick={() => setSupplierModal({ isOpen: true, editId: null, name: '', contact: '', item: '' })} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center space-x-2">
                  <Plus className="w-4 h-4" /><span>Add Supplier</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                    <tr>
                      <th className="p-4">Supplier Name</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Supplied Items</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {suppliers.map(s => (
                      <tr key={s.id} className="hover:bg-slate-950/50">
                        <td className="p-4 font-bold text-white">{s.name}</td>
                        <td className="p-4">{s.contact}</td>
                        <td className="p-4">{s.item}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setSupplierModal({ isOpen: true, editId: s.id, name: s.name, contact: s.contact, item: s.item })} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-emerald-400"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setSuppliers(suppliers.filter(x => x.id !== s.id))} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {supplierModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6">
                    <h3 className="text-lg font-bold text-white mb-4">{supplierModal.editId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (supplierModal.editId) {
                        setSuppliers(suppliers.map(x => x.id === supplierModal.editId ? { ...x, name: supplierModal.name, contact: supplierModal.contact, item: supplierModal.item } : x));
                      } else {
                        setSuppliers([...suppliers, { id: Date.now(), name: supplierModal.name, contact: supplierModal.contact, item: supplierModal.item }]);
                      }
                      setSupplierModal({ isOpen: false, editId: null, name: '', contact: '', item: '' });
                    }} className="space-y-4">
                      <div><label className="text-xs text-slate-400 block mb-1">Supplier Name</label><input type="text" required value={supplierModal.name} onChange={e => setSupplierModal({...supplierModal, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div><label className="text-xs text-slate-400 block mb-1">Contact Phone</label><input type="tel" required value={supplierModal.contact} onChange={e => setSupplierModal({...supplierModal, contact: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div><label className="text-xs text-slate-400 block mb-1">Supplied Items</label><input type="text" required value={supplierModal.item} onChange={e => setSupplierModal({...supplierModal, item: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div className="flex space-x-3 pt-2">
                        <button type="button" onClick={() => setSupplierModal({ isOpen: false })} className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
                        <button type="submit" className="w-1/2 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold">Save Supplier</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SALES (CRUD) */}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Sales Records (CRUD)</h3>
                <button onClick={() => setSaleModal({ isOpen: true, reference: `POS-${Math.floor(1000 + Math.random() * 9000)}`, customer: '', total: '' })} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center space-x-2">
                  <Plus className="w-4 h-4" /><span>Record Sale</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Total Amount (₦)</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {sales.map(s => (
                      <tr key={s.id} className="hover:bg-slate-950/50">
                        <td className="p-4 font-bold text-white">{s.reference}</td>
                        <td className="p-4">{s.customer}</td>
                        <td className="p-4 text-emerald-400">{s.total}</td>
                        <td className="p-4">{s.date}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => setSales(sales.filter(x => x.id !== s.id))} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {saleModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Record New POS Sale</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setSales([...sales, { id: Date.now(), reference: saleModal.reference, customer: saleModal.customer, total: saleModal.total, date: new Date().toISOString().split('T')[0] }]);
                      setSaleModal({ isOpen: false, reference: '', customer: '', total: '' });
                    }} className="space-y-4">
                      <div><label className="text-xs text-slate-400 block mb-1">Reference</label><input type="text" disabled value={saleModal.reference} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div><label className="text-xs text-slate-400 block mb-1">Customer Name</label><input type="text" required value={saleModal.customer} onChange={e => setSaleModal({...saleModal, customer: e.target.value})} placeholder="Alhaji Dangote" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div><label className="text-xs text-slate-400 block mb-1">Total Amount (₦)</label><input type="text" required value={saleModal.total} onChange={e => setSaleModal({...saleModal, total: e.target.value})} placeholder="₦75,000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                      <div className="flex space-x-3 pt-2">
                        <button type="button" onClick={() => setSaleModal({ isOpen: false })} className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancel</button>
                        <button type="submit" className="w-1/2 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold">Save Sale</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: INVOICES & BILLING */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">B2B Invoices & Billing</h3>
                <button onClick={() => {
                  const no = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
                  setInvoices([...invoices, { id: Date.now(), invNo: no, client: 'New Corporate Client', amount: '₦50,000', status: 'Pending' }]);
                }} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs flex items-center space-x-2">
                  <Plus className="w-4 h-4" /><span>Create Invoice</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                    <tr>
                      <th className="p-4">Invoice No</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Amount (₦)</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-950/50">
                        <td className="p-4 font-bold text-white">{inv.invNo}</td>
                        <td className="p-4">{inv.client}</td>
                        <td className="p-4 text-emerald-400">{inv.amount}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${inv.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{inv.status}</span></td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setInvoices(invoices.map(x => x.id === inv.id ? {...x, status: 'Paid'} : x))} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-emerald-400 text-xs font-semibold">Mark Paid</button>
                          <button onClick={() => setInvoices(invoices.filter(x => x.id !== inv.id))} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SUBSCRIPTION HISTORY */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">SaaS Subscription History</h3>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                    <tr>
                      <th className="p-4">Plan Name</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Renewal Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {subscriptions.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-950/50">
                        <td className="p-4 font-bold text-white">{sub.plan}</td>
                        <td className="p-4 text-emerald-400">{sub.amount}</td>
                        <td className="p-4"><span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">{sub.status}</span></td>
                        <td className="p-4">{sub.renewal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: BRANCHES & STAFF */}
          {activeTab === 'branches' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <Building className="w-5 h-5 text-emerald-400" />
                    <span>Create Store Branch</span>
                  </h3>
                  <form onSubmit={handleCreateBranch} className="space-y-4">
                    <div><label className="text-xs text-slate-400 block mb-1">Branch Name</label><input type="text" required value={newBranchData.branchName} onChange={e => setNewBranchData({...newBranchData, branchName: e.target.value})} placeholder="Wuse Market Branch" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                    <div><label className="text-xs text-slate-400 block mb-1">Address</label><input type="text" required value={newBranchData.address} onChange={e => setNewBranchData({...newBranchData, address: e.target.value})} placeholder="Abuja, Nigeria" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                    <div><label className="text-xs text-slate-400 block mb-1">Phone</label><input type="tel" required value={newBranchData.phone} onChange={e => setNewBranchData({...newBranchData, phone: e.target.value})} placeholder="+234 800 000 0000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                    <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs">Add Branch</button>
                  </form>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-emerald-400" />
                    <span>Allocate Staff / Cashier</span>
                  </h3>
                  <form onSubmit={handleCreateStaff} className="space-y-4">
                    <div><label className="text-xs text-slate-400 block mb-1">Branch</label><select required value={newStaffData.branchId} onChange={e => setNewStaffData({...newStaffData, branchId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm"><option value="">Choose Branch</option>{branches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}</select></div>
                    <div><label className="text-xs text-slate-400 block mb-1">Full Name</label><input type="text" required value={newStaffData.name} onChange={e => setNewStaffData({...newStaffData, name: e.target.value})} placeholder="Jane Doe" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                    <div><label className="text-xs text-slate-400 block mb-1">Email</label><input type="email" required value={newStaffData.email} onChange={e => setNewStaffData({...newStaffData, email: e.target.value})} placeholder="jane@company.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                    <div><label className="text-xs text-slate-400 block mb-1">Password</label><input type="password" required value={newStaffData.password} onChange={e => setNewStaffData({...newStaffData, password: e.target.value})} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm" /></div>
                    <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs">Allocate Staff</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: POS TERMINAL */}
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
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
      </div>
    );
  }

  // ================= VIEW: SIGN UP =================
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
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {signupStep === 1 && "Confirm your subscription"}
              {signupStep === 2 && "Let's get to know you"}
              {signupStep === 3 && "Tell us about your business"}
              {signupStep === 4 && "Secure your SaaS instance"}
            </h2>

            <form onSubmit={handleNextStep} className="space-y-4">
              {signupStep === 1 && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                  <span className="text-sm font-bold text-white">{formData.planName}</span>
                  <p className="text-xs text-slate-400">Includes branch allocation, cashier RBAC, and all modules.</p>
                </div>
              )}

              {signupStep === 2 && (
                <>
                  <div><label className="text-xs text-slate-400 block mb-1">Full Name</label><input type="text" required value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} placeholder="Engr. Avela Marcel" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm" /></div>
                  <div><label className="text-xs text-slate-400 block mb-1">Work Email</label><input type="email" required value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="admin@ndertech.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm" /></div>
                </>
              )}

              {signupStep === 3 && (
                <>
                  <div><label className="text-xs text-slate-400 block mb-1">Company / Store Name</label><input type="text" required value={formData.companyName} onChange={e => handleInputChange('companyName', e.target.value)} placeholder="NderTech Hub" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm" /></div>
                  <div><label className="text-xs text-slate-400 block mb-1">Phone Number</label><input type="tel" required value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="+234 800 000 0000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm" /></div>
                  <div><label className="text-xs text-slate-400 block mb-1">Business Address</label><input type="text" required value={formData.address} onChange={e => handleInputChange('address', e.target.value)} placeholder="Makurdi, Benue State" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm" /></div>
                </>
              )}

              {signupStep === 4 && (
                <>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Password</label>
                    <input type={showSignUpPassword ? "text" : "password"} required value={formData.password} onChange={e => handleInputChange('password', e.target.value)} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm" />
                  </div>
                  <div>
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input type="checkbox" required checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-800 bg-slate-950 text-emerald-600" />
                      <span className="text-xs text-slate-400">I agree to the Terms & Conditions and Privacy Policy.</span>
                    </label>
                  </div>
                </>
              )}

              <div className="flex items-center space-x-3 pt-4">
                {signupStep > 1 && <button type="button" onClick={() => setSignupStep(signupStep - 1)} className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold">Back</button>}
                <button type="submit" disabled={isLoading} className={`${signupStep > 1 ? 'w-2/3' : 'w-full'} py-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center space-x-2`}>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{signupStep === 4 ? 'Launch Instance' : 'Continue'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
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

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => navigateTo('signin')} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white">Sign In</button>
            <button onClick={() => selectPlanAndStart(1, 'Starter Plan')} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm">Get Started</button>
          </div>
        </div>
      </header>

      <section className="relative pt-20 pb-20 text-center px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white max-w-4xl mx-auto leading-tight">
          Multi-Branch POS & User-Scoped CRUD Suite in <span className="text-emerald-400">₦ Naira</span>
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">Full CRUD operations for products, customers, suppliers, sales, invoices, and billing.</p>
        <div className="mt-10 flex justify-center">
          <button onClick={() => selectPlanAndStart(1, 'Starter Plan')} className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl">
            Launch Your Store
          </button>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-slate-900/50 border-t border-slate-900 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Subscription Plans & Allocation</h2>
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
                  </div>
                </div>
                <button onClick={() => selectPlanAndStart(plan.id, plan.name)} className={`w-full py-3 rounded-xl font-semibold text-sm ${plan.highlight ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}