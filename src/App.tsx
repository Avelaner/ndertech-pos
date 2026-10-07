import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  Store, 
  BarChart3, 
  FileText, 
  LayoutDashboard,
  LogOut,
  Truck,
  CreditCard,
  Edit,
  Trash2,
  Plus,
  ShoppingBag,
  Printer,
  Download,
  Send,
  Search,
  ChevronLeft,
  ChevronRight,
  Minus,
  Building
} from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Pagination States per module
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. SUPPLIERS STATE (CRUD)
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Northwind Agro Ltd', contact: '+234 802 999 0000', item: 'Grains & Cereals', email: 'agro@northwind.ng' },
    { id: 2, name: 'Lagos Mega Importers', contact: '+234 801 222 3333', item: 'Vegetable Oils', email: 'sales@megaimp.ng' }
  ]);
  const [supplierModal, setSupplierModal] = useState({ isOpen: false, editId: null, name: '', contact: '', item: '', email: '' });

  // 2. CUSTOMERS STATE (CRUD & History Ledger)
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Alhaji Dangote', phone: '+234 803 111 2222', email: 'dangote@b2b.ng', address: 'Kano Industrial Layout', spent: 450000, balance: 0 },
    { id: 2, name: 'Chief Mrs. Okoro', phone: '+234 805 333 4444', email: 'okoro@retail.ng', address: 'Wuse Zone 4, Abuja', spent: 125000, balance: 15000 }
  ]);
  const [customerModal, setCustomerModal] = useState({ isOpen: false, editId: null, name: '', phone: '', email: '', address: '' });
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState(null);

  // 3. PRODUCTS STATE (CRUD)
  const [products, setProducts] = useState([
    { id: 1, name: 'Premium Rice 50kg', category: 'Grains', price: 75000, stock: 45 },
    { id: 2, name: 'Vegetable Oil 25L', category: 'Groceries', price: 38000, stock: 20 },
    { id: 3, name: 'Semovita 10kg', category: 'Grains', price: 9500, stock: 60 }
  ]);
  const [productModal, setProductModal] = useState({ isOpen: false, editId: null, name: '', category: '', price: '', stock: '' });

  // 5. PURCHASES STATE (CRUD)
  const [purchases, setPurchases] = useState([
    { id: 1, poNo: 'PO-1001', supplier: 'Northwind Agro Ltd', total: 750000, date: '2026-10-01', status: 'Received' }
  ]);
  const [purchaseModal, setPurchaseModal] = useState({ isOpen: false, supplier: '', item: '', qty: '', cost: '' });

  // 6. SALES STATE (POS Cart with Quantity Management, Discount %, Down Payment, Balance)
  const [cart, setCart] = useState([]);
  const [selectedCustomerForSale, setSelectedCustomerForSale] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [salesRecords, setSalesRecords] = useState([
    { id: 1, ref: 'POS-9001', customer: 'Alhaji Dangote', items: '1x Premium Rice 50kg', subtotal: 75000, discount: 0, totalDue: 75000, paid: 75000, balance: 0, date: '2026-10-06' }
  ]);

  // 7. QUOTATION STATE (CRUD & Convert to Proforma / Sales)
  const [quotations, setQuotations] = useState([
    { id: 1, quoteNo: 'QT-3001', client: 'Chief Mrs. Okoro', items: '2x Vegetable Oil 25L', amount: 76000, status: 'Approved' }
  ]);
  const [quotationModal, setQuotationModal] = useState({ isOpen: false, client: '', items: '', amount: '' });

  // 8. SUBSCRIPTION PLAN STATE
  const [currentPlan] = useState({ name: 'Professional Plan', price: '₦45,000 / month', status: 'Active', expiry: '2026-11-06' });

  // 9. INVOICES STATE (View, Email, Edit)
  const [invoices, setInvoices] = useState([
    { id: 1, invNo: 'INV-5001', client: 'Chief Mrs. Okoro', amount: 125000, status: 'Unpaid', email: 'okoro@retail.ng' }
  ]);

  // 10. TRANSACTIONS STATE
  const [transactions] = useState([
    { id: 1, txnRef: 'TXN-8801', type: 'Sale Payment', channel: 'Paystack Transfer', amount: '₦75,000', date: '2026-10-06' },
    { id: 2, type: 'Subscription Renewal', txnRef: 'TXN-8800', channel: 'Card', amount: '₦45,000', date: '2026-09-06' }
  ]);

  const paginateData = (items) => {
    const filtered = items.filter(item => 
      Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const start = (currentPage - 1) * itemsPerPage;
    return {
      paginated: filtered.slice(start, start + itemsPerPage),
      totalPages: Math.ceil(filtered.length / itemsPerPage) || 1
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-emerald-500 selection:text-white">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg"><Store className="w-6 h-6 text-white" /></div>
            <div>
              <span className="text-lg font-extrabold text-white">NderTech POS</span>
              <span className="block text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">Enterprise Hub</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium max-h-[75vh] overflow-y-auto pr-1">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'pos', label: 'POS Terminal (Sales)', icon: <ShoppingCart className="w-4 h-4" /> },
              { id: 'products', label: 'Products Page', icon: <Package className="w-4 h-4" /> },
              { id: 'customers', label: 'Customers Page', icon: <Users className="w-4 h-4" /> },
              { id: 'suppliers', label: 'Suppliers Page', icon: <Truck className="w-4 h-4" /> },
              { id: 'purchases', label: 'Purchase Page', icon: <ShoppingBag className="w-4 h-4" /> },
              { id: 'quotations', label: 'Quotation Page', icon: <FileText className="w-4 h-4" /> },
              { id: 'invoices', label: 'Invoices & Billing', icon: <FileText className="w-4 h-4" /> },
              { id: 'transactions', label: 'All Transactions', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'reports', label: 'Reports (D/W/M)', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'subscription', label: 'Subscription Plan', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'branches', label: 'Branches & Staff', icon: <Building className="w-4 h-4" /> }
            ].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setCurrentPage(1); setSearchTerm(''); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button onClick={() => Swal.fire('Signed Out', 'You have been logged out.', 'info')} className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors">
            <LogOut className="w-4 h-4" /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-4 sm:p-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-black text-white capitalize">{activeTab.replace('_', ' ')}</h1>
            <p className="text-xs text-slate-400">Professional multi-tenant SaaS management in Nigerian Naira (₦).</p>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            User: Engr. Avela Nder Marcel
          </span>
        </header>

        {/* Global Search Bar for Tabular Pages */}
        {['products', 'customers', 'suppliers', 'purchases', 'quotations', 'invoices', 'transactions'].includes(activeTab) && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
        )}

        {/* 1. OVERVIEW PAGE */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800"><p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Total Products</p><p className="text-3xl font-black text-white">{products.length}</p></div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800"><p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Registered Customers</p><p className="text-3xl font-black text-white">{customers.length}</p></div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800"><p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Active Quotations</p><p className="text-3xl font-black text-white">{quotations.length}</p></div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800"><p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Subscription Tier</p><p className="text-2xl font-black text-emerald-400">Pro</p></div>
          </div>
        )}

        {/* 2. POS TERMINAL WITH QUANTITY CONTROLS */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-bold text-white">Select Products to Add to Cart</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      <p className="text-xs text-emerald-400 font-semibold">₦{p.price.toLocaleString()} ({p.stock} in stock)</p>
                    </div>
                    <button onClick={() => {
                      const existing = cart.find(x => x.id === p.id);
                      if (existing) {
                        setCart(cart.map(x => x.id === p.id ? {...x, qty: x.qty + 1} : x));
                      } else {
                        setCart([...cart, {...p, qty: 1}]);
                      }
                    }} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-xs font-semibold flex items-center space-x-1">
                      <Plus className="w-3.5 h-3.5" /><span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary & Calculations with Quantities */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Checkout Cart ({cart.reduce((a,c) => a + c.qty, 0)} items)</h3>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Select Customer</label>
                <select value={selectedCustomerForSale} onChange={e => setSelectedCustomerForSale(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs">
                  <option value="">Walk-in Customer</option>
                  {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">Cart is empty. Click 'Add' on products.</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="overflow-hidden pr-2">
                        <p className="font-bold text-white truncate">{item.name}</p>
                        <p className="text-emerald-400">₦{item.price.toLocaleString()} each</p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <button onClick={() => {
                          if (item.qty > 1) {
                            setCart(cart.map(x => x.id === item.id ? {...x, qty: x.qty - 1} : x));
                          } else {
                            setCart(cart.filter(x => x.id !== item.id));
                          }
                        }} className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"><Minus className="w-3 h-3" /></button>
                        <span className="font-bold text-white w-5 text-center">{item.qty}</span>
                        <button onClick={() => {
                          setCart(cart.map(x => x.id === item.id ? {...x, qty: x.qty + 1} : x));
                        }} className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {(() => {
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
                const discountAmt = (subtotal * discountPercent) / 100;
                const totalDue = subtotal - discountAmt;
                const balance = Math.max(0, totalDue - downPayment);

                return (
                  <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                    <div className="flex justify-between text-slate-400"><span>Subtotal:</span><span>₦{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Discount (%):</span>
                      <input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-right" />
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Down Payment (₦):</span>
                      <input type="number" min="0" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-right" />
                    </div>
                    <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-slate-800"><span>Total Due:</span><span className="text-emerald-400">₦{totalDue.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-amber-400 text-xs"><span>Balance Due:</span><span>₦{balance.toLocaleString()}</span></div>

                    <button onClick={() => {
                      if (cart.length === 0) return Swal.fire('Cart is empty', 'Please add items with quantities before checking out.', 'warning');
                      const newSale = { id: Date.now(), ref: `POS-${Math.floor(1000 + Math.random()*9000)}`, customer: selectedCustomerForSale || 'Walk-in', items: cart.map(x => `${x.qty}x ${x.name}`).join(', '), subtotal, discount: discountAmt, totalDue, paid: downPayment, balance, date: new Date().toISOString().split('T')[0] };
                      setSalesRecords([newSale, ...salesRecords]);
                      setCart([]);
                      setDownPayment(0);
                      setDiscountPercent(0);
                      Swal.fire('Success', 'Sale recorded successfully!', 'success');
                    }} className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs mt-4">Complete Sale & Print Receipt</button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* 3. PRODUCTS PAGE (CRUD) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Product Catalog Management</h3>
              <button onClick={() => setProductModal({ isOpen: true, editId: null, name: '', category: '', price: '', stock: '' })} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Add Product</span></button>
            </div>

            {(() => {
              const { paginated, totalPages } = paginateData(products);
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto space-y-4">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                      <tr><th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Price (₦)</th><th className="p-4">Stock</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginated.map(p => (
                        <tr key={p.id}>
                          <td className="p-4 font-bold text-white">{p.name}</td>
                          <td className="p-4">{p.category}</td>
                          <td className="p-4 text-emerald-400">₦{p.price.toLocaleString()}</td>
                          <td className="p-4">{p.stock}</td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => setProductModal({ isOpen: true, editId: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock })} className="p-2 bg-slate-800 rounded text-emerald-400"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-2 bg-red-500/10 rounded text-red-400"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="space-x-2">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronLeft className="w-4 h-4 inline" /></button>
                      <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronRight className="w-4 h-4 inline" /></button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {productModal.isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">{productModal.editId ? 'Edit Product' : 'Add Product'}</h3>
                  <form onSubmit={e => {
                    e.preventDefault();
                    if (productModal.editId) {
                      setProducts(products.map(x => x.id === productModal.editId ? {...x, name: productModal.name, category: productModal.category, price: Number(productModal.price), stock: Number(productModal.stock)} : x));
                    } else {
                      setProducts([...products, { id: Date.now(), name: productModal.name, category: productModal.category, price: Number(productModal.price), stock: Number(productModal.stock) }]);
                    }
                    setProductModal({ isOpen: false, editId: null, name: '', category: '', price: '', stock: '' });
                  }} className="space-y-3">
                    <input type="text" required placeholder="Product Name" value={productModal.name} onChange={e => setProductModal({...productModal, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="text" required placeholder="Category" value={productModal.category} onChange={e => setProductModal({...productModal, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="number" required placeholder="Price (₦)" value={productModal.price} onChange={e => setProductModal({...productModal, price: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="number" required placeholder="Stock Units" value={productModal.stock} onChange={e => setProductModal({...productModal, stock: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <div className="flex space-x-2 pt-2">
                      <button type="button" onClick={() => setProductModal({ isOpen: false })} className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">Cancel</button>
                      <button type="submit" className="w-1/2 py-2 bg-emerald-600 text-white rounded-xl text-xs">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. CUSTOMERS PAGE */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Customer Directory & History Ledger</h3>
              <button onClick={() => setCustomerModal({ isOpen: true, editId: null, name: '', phone: '', email: '', address: '' })} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Add Customer</span></button>
            </div>

            {(() => {
              const { paginated, totalPages } = paginateData(customers);
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto space-y-4">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                      <tr><th className="p-4">Name</th><th className="p-4">Phone</th><th className="p-4">Spent (₦)</th><th className="p-4">Balance Due</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginated.map(c => (
                        <tr key={c.id}>
                          <td className="p-4 font-bold text-white">{c.name}</td>
                          <td className="p-4">{c.phone}</td>
                          <td className="p-4 text-emerald-400">₦{c.spent.toLocaleString()}</td>
                          <td className="p-4 text-amber-400">₦{c.balance.toLocaleString()}</td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => setSelectedCustomerHistory(c)} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold">View Ledger</button>
                            <button onClick={() => setCustomers(customers.filter(x => x.id !== c.id))} className="p-2 bg-red-500/10 rounded text-red-400"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="space-x-2">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronLeft className="w-4 h-4 inline" /></button>
                      <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronRight className="w-4 h-4 inline" /></button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {selectedCustomerHistory && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 overflow-y-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-8 space-y-6 text-slate-100">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Customer Activity Statement</h2>
                      <p className="text-xs text-slate-400">{selectedCustomerHistory.name} | {selectedCustomerHistory.phone}</p>
                    </div>
                    <button onClick={() => window.print()} className="px-4 py-2 bg-emerald-600 rounded-xl text-xs font-semibold flex items-center space-x-2"><Printer className="w-4 h-4" /><span>Print Statement</span></button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl">
                      <div><span className="text-slate-400">Total Spent:</span><p className="text-base font-bold text-emerald-400">₦{selectedCustomerHistory.spent.toLocaleString()}</p></div>
                      <div><span className="text-slate-400">Current Balance Due:</span><p className="text-base font-bold text-amber-400">₦{selectedCustomerHistory.balance.toLocaleString()}</p></div>
                    </div>

                    <h4 className="font-bold text-white text-sm pt-2">Transaction History</h4>
                    <div className="space-y-2">
                      {salesRecords.filter(s => s.customer === selectedCustomerHistory.name).length > 0 ? (
                        salesRecords.filter(s => s.customer === selectedCustomerHistory.name).map(s => (
                          <div key={s.id} className="flex justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <span>{s.ref} ({s.date}) - {s.items}</span>
                            <span className="text-emerald-400 font-bold">₦{s.totalDue.toLocaleString()}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 italic">No transactions recorded for this customer yet.</p>
                      )}
                    </div>
                  </div>

                  <button onClick={() => setSelectedCustomerHistory(null)} className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Close Ledger</button>
                </div>
              </div>
            )}

            {customerModal.isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Add Customer</h3>
                  <form onSubmit={e => {
                    e.preventDefault();
                    setCustomers([...customers, { id: Date.now(), name: customerModal.name, phone: customerModal.phone, email: customerModal.email, address: customerModal.address, spent: 0, balance: 0 }]);
                    setCustomerModal({ isOpen: false, editId: null, name: '', phone: '', email: '', address: '' });
                  }} className="space-y-3">
                    <input type="text" required placeholder="Full Name" value={customerModal.name} onChange={e => setCustomerModal({...customerModal, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="tel" required placeholder="Phone Number" value={customerModal.phone} onChange={e => setCustomerModal({...customerModal, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="email" required placeholder="Email Address" value={customerModal.email} onChange={e => setCustomerModal({...customerModal, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="text" required placeholder="Address" value={customerModal.address} onChange={e => setCustomerModal({...customerModal, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <div className="flex space-x-2 pt-2">
                      <button type="button" onClick={() => setCustomerModal({ isOpen: false })} className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">Cancel</button>
                      <button type="submit" className="w-1/2 py-2 bg-emerald-600 text-white rounded-xl text-xs">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. SUPPLIERS PAGE */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Suppliers Directory Page</h3>
              <button onClick={() => setSupplierModal({ isOpen: true, editId: null, name: '', contact: '', item: '', email: '' })} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Add Supplier</span></button>
            </div>

            {(() => {
              const { paginated, totalPages } = paginateData(suppliers);
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto space-y-4">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                      <tr><th className="p-4">Supplier Name</th><th className="p-4">Contact</th><th className="p-4">Supplied Items</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginated.map(s => (
                        <tr key={s.id}>
                          <td className="p-4 font-bold text-white">{s.name}</td>
                          <td className="p-4">{s.contact}</td>
                          <td className="p-4">{s.item}</td>
                          <td className="p-4 text-right"><button onClick={() => setSuppliers(suppliers.filter(x => x.id !== s.id))} className="p-2 bg-red-500/10 rounded text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="space-x-2">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronLeft className="w-4 h-4 inline" /></button>
                      <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronRight className="w-4 h-4 inline" /></button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {supplierModal.isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Add Supplier</h3>
                  <form onSubmit={e => {
                    e.preventDefault();
                    setSuppliers([...suppliers, { id: Date.now(), name: supplierModal.name, contact: supplierModal.contact, item: supplierModal.item, email: supplierModal.email }]);
                    setSupplierModal({ isOpen: false, editId: null, name: '', contact: '', item: '', email: '' });
                  }} className="space-y-3">
                    <input type="text" required placeholder="Supplier Name" value={supplierModal.name} onChange={e => setSupplierModal({...supplierModal, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="tel" required placeholder="Contact Phone" value={supplierModal.contact} onChange={e => setSupplierModal({...supplierModal, contact: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="text" required placeholder="Supplied Items" value={supplierModal.item} onChange={e => setSupplierModal({...supplierModal, item: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <div className="flex space-x-2 pt-2">
                      <button type="button" onClick={() => setSupplierModal({ isOpen: false })} className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">Cancel</button>
                      <button type="submit" className="w-1/2 py-2 bg-emerald-600 text-white rounded-xl text-xs">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. PURCHASE PAGE */}
        {activeTab === 'purchases' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Purchase Orders Page</h3>
              <button onClick={() => setPurchaseModal({ isOpen: true, supplier: '', item: '', qty: '', cost: '' })} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-2"><Plus className="w-4 h-4" /><span>New Purchase</span></button>
            </div>

            {(() => {
              const { paginated, totalPages } = paginateData(purchases);
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto space-y-4">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                      <tr><th className="p-4">PO Number</th><th className="p-4">Supplier</th><th className="p-4">Total Cost</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginated.map(p => (
                        <tr key={p.id}>
                          <td className="p-4 font-bold text-white">{p.poNo}</td>
                          <td className="p-4">{p.supplier}</td>
                          <td className="p-4 text-emerald-400">₦{p.total.toLocaleString()}</td>
                          <td className="p-4"><span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">{p.status}</span></td>
                          <td className="p-4 text-right"><button onClick={() => setPurchases(purchases.filter(x => x.id !== p.id))} className="p-2 bg-red-500/10 rounded text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="space-x-2">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronLeft className="w-4 h-4 inline" /></button>
                      <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronRight className="w-4 h-4 inline" /></button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {purchaseModal.isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Record Purchase Order</h3>
                  <form onSubmit={e => {
                    e.preventDefault();
                    setPurchases([...purchases, { id: Date.now(), poNo: `PO-${Math.floor(1000+Math.random()*9000)}`, supplier: purchaseModal.supplier, total: Number(purchaseModal.cost) * Number(purchaseModal.qty), date: new Date().toISOString().split('T')[0], status: 'Received' }]);
                    setPurchaseModal({ isOpen: false, supplier: '', item: '', qty: '', cost: '' });
                  }} className="space-y-3">
                    <input type="text" required placeholder="Supplier Name" value={purchaseModal.supplier} onChange={e => setPurchaseModal({...purchaseModal, supplier: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="text" required placeholder="Item Description" value={purchaseModal.item} onChange={e => setPurchaseModal({...purchaseModal, item: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="number" required placeholder="Quantity" value={purchaseModal.qty} onChange={e => setPurchaseModal({...purchaseModal, qty: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="number" required placeholder="Unit Cost (₦)" value={purchaseModal.cost} onChange={e => setPurchaseModal({...purchaseModal, cost: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <div className="flex space-x-2 pt-2">
                      <button type="button" onClick={() => setPurchaseModal({ isOpen: false })} className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">Cancel</button>
                      <button type="submit" className="w-1/2 py-2 bg-emerald-600 text-white rounded-xl text-xs">Save PO</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. QUOTATION PAGE */}
        {activeTab === 'quotations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Quotation & Proforma Page</h3>
              <button onClick={() => setQuotationModal({ isOpen: true, client: '', items: '', amount: '' })} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Create Quotation</span></button>
            </div>

            {(() => {
              const { paginated, totalPages } = paginateData(quotations);
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto space-y-4">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                      <tr><th className="p-4">Quote No</th><th className="p-4">Client</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginated.map(q => (
                        <tr key={q.id}>
                          <td className="p-4 font-bold text-white">{q.quoteNo}</td>
                          <td className="p-4">{q.client}</td>
                          <td className="p-4 text-emerald-400">₦{q.amount.toLocaleString()}</td>
                          <td className="p-4"><span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">{q.status}</span></td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => {
                              setSalesRecords([{ id: Date.now(), ref: `POS-${Math.floor(1000+Math.random()*9000)}`, customer: q.client, items: q.items, subtotal: q.amount, discount: 0, totalDue: q.amount, paid: q.amount, balance: 0, date: new Date().toISOString().split('T')[0] }, ...salesRecords]);
                              setQuotations(quotations.filter(x => x.id !== q.id));
                              Swal.fire('Converted!', 'Quotation converted to Sale successfully.', 'success');
                            }} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold">Convert to Sale</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="space-x-2">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronLeft className="w-4 h-4 inline" /></button>
                      <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronRight className="w-4 h-4 inline" /></button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {quotationModal.isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Create B2B Quotation</h3>
                  <form onSubmit={e => {
                    e.preventDefault();
                    setQuotations([...quotations, { id: Date.now(), quoteNo: `QT-${Math.floor(1000+Math.random()*9000)}`, client: quotationModal.client, items: quotationModal.items, amount: Number(quotationModal.amount), status: 'Pending' }]);
                    setQuotationModal({ isOpen: false, client: '', items: '', amount: '' });
                  }} className="space-y-3">
                    <input type="text" required placeholder="Client Name" value={quotationModal.client} onChange={e => setQuotationModal({...quotationModal, client: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="text" required placeholder="Items Description" value={quotationModal.items} onChange={e => setQuotationModal({...quotationModal, items: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <input type="number" required placeholder="Total Amount (₦)" value={quotationModal.amount} onChange={e => setQuotationModal({...quotationModal, amount: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                    <div className="flex space-x-2 pt-2">
                      <button type="button" onClick={() => setQuotationModal({ isOpen: false })} className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">Cancel</button>
                      <button type="submit" className="w-1/2 py-2 bg-emerald-600 text-white rounded-xl text-xs">Save Quote</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. INVOICES & BILLING PAGE */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Invoices & Billing Page</h3>
            {(() => {
              const { paginated, totalPages } = paginateData(invoices);
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto space-y-4">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                      <tr><th className="p-4">Invoice No</th><th className="p-4">Client</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginated.map(inv => (
                        <tr key={inv.id}>
                          <td className="p-4 font-bold text-white">{inv.invNo}</td>
                          <td className="p-4">{inv.client}</td>
                          <td className="p-4 text-emerald-400">₦{inv.amount.toLocaleString()}</td>
                          <td className="p-4"><span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">{inv.status}</span></td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => Swal.fire('Sent!', `Invoice sent successfully.`, 'success')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-xs font-semibold inline-flex items-center space-x-1"><Send className="w-3 h-3" /><span>Email</span></button>
                            <button onClick={() => setInvoices(invoices.map(x => x.id === inv.id ? {...x, status: 'Paid'} : x))} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold">Mark Paid</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="space-x-2">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronLeft className="w-4 h-4 inline" /></button>
                      <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronRight className="w-4 h-4 inline" /></button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 10. ALL TRANSACTIONS PAGE */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">All Transactions Page</h3>
              <div className="space-x-2">
                <button onClick={() => Swal.fire('Exported', 'Downloaded.', 'success')} className="px-3 py-2 bg-slate-800 text-emerald-400 text-xs rounded-xl font-semibold inline-flex items-center space-x-1"><Download className="w-3.5 h-3.5" /><span>Excel</span></button>
                <button onClick={() => window.print()} className="px-3 py-2 bg-slate-800 text-emerald-400 text-xs rounded-xl font-semibold inline-flex items-center space-x-1"><Printer className="w-3.5 h-3.5" /><span>PDF</span></button>
              </div>
            </div>

            {(() => {
              const { paginated, totalPages } = paginateData(transactions);
              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto space-y-4">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 uppercase text-xs text-slate-400">
                      <tr><th className="p-4">Reference</th><th className="p-4">Type</th><th className="p-4">Channel</th><th className="p-4">Amount</th><th className="p-4">Date</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {paginated.map(t => (
                        <tr key={t.id}>
                          <td className="p-4 font-bold text-white">{t.txnRef}</td>
                          <td className="p-4">{t.type}</td>
                          <td className="p-4">{t.channel}</td>
                          <td className="p-4 text-emerald-400">{t.amount}</td>
                          <td className="p-4">{t.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="space-x-2">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronLeft className="w-4 h-4 inline" /></button>
                      <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"><ChevronRight className="w-4 h-4 inline" /></button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 11. REPORTS PAGE */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Daily, Weekly & Monthly Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"><span className="text-xs text-slate-400 uppercase font-semibold">Daily Report</span><p className="text-2xl font-bold text-white">₦75,000</p></div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"><span className="text-xs text-slate-400 uppercase font-semibold">Weekly Report</span><p className="text-2xl font-bold text-white">₦525,000</p></div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"><span className="text-xs text-slate-400 uppercase font-semibold">Monthly Report</span><p className="text-2xl font-bold text-white">₦2,350,000</p></div>
            </div>
          </div>
        )}

        {/* SUBSCRIPTION PLAN PAGE */}
        {activeTab === 'subscription' && (
          <div className="space-y-6 max-w-xl">
            <h3 className="text-lg font-bold text-white">Subscription Management Page</h3>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div><span className="text-xs text-slate-400">Current Plan</span><h4 className="text-xl font-bold text-white">{currentPlan.name}</h4></div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">{currentPlan.status}</span>
              </div>
              <p className="text-xs text-slate-400">Renewal Date: {currentPlan.expiry}</p>
              <div className="flex space-x-3 pt-2">
                <button onClick={() => Swal.fire('Renewed!', '', 'success')} className="w-1/2 py-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold">Renew Plan</button>
                <button onClick={() => Swal.fire('Upgrade', '', 'info')} className="w-1/2 py-3 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold">Upgrade Tier</button>
              </div>
            </div>
          </div>
        )}

        {/* BRANCHES & STAFF */}
        {activeTab === 'branches' && (
          <div className="space-y-6"><h3 className="text-lg font-bold text-white">Branches & Staff Allocation</h3><div className="p-6 rounded-2xl bg-slate-900 border border-slate-800"><p className="text-xs text-slate-400">Active branches connected: 1</p></div></div>
        )}
      </main>
    </div>
  );
}

