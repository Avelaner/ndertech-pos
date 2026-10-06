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
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'signin' | 'signup' | 'forgot' | 'terms' | 'privacy' | 'disclaimer'>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Legal Modal States for Sign Up
  const [activeLegalModal, setActiveLegalModal] = useState<'terms' | 'privacy' | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Password visibility states
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Sign In Form States
  const [signInData, setSignInData] = useState({ email: '', password: '' });

  // Conversational Sign-Up State
  const [signupStep, setSignupStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  // Input Sanitization Helper: Strips out risky HTML/Script characters
  const sanitizeInput = (value: string) => {
    return value.replace(/[<>]/g, '');
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitized = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitized }));
  };

  // Live Password Validation Criteria
  const pwd = formData.password;
  const hasLength = pwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
  const isPasswordValid = hasLength && hasUppercase && hasNumber && hasSymbol;

  // Handle Tenant Registration Form Submission
  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupStep < 3) {
      setSignupStep(signupStep + 1);
    } else {
      if (!isPasswordValid) return;
      
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();

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
        console.error('Network error during registration:', err);
        Swal.fire({
          title: 'Connection Error',
          text: 'Failed to connect to the backend server.',
          icon: 'error',
          confirmButtonColor: '#059669',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    }
  };

  // Handle User Sign-In Submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...signInData })
      });
      const data = await response.json();

      if (data.success) {
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
      console.error('Sign-in error:', err);
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

  // Navigation handler
  const navigateTo = (view: 'landing' | 'signin' | 'signup' | 'forgot' | 'terms' | 'privacy' | 'disclaimer') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (view === 'signup') setSignupStep(1);
    window.scrollTo(0, 0);
  };

  const modules = [
    { icon: <ShoppingCart className="w-8 h-8 text-emerald-400" />, title: "1. POS Terminal & Checkout", desc: "Lightning-fast touch-optimized checkout, barcode scanning, offline mode caching, split payments, and shift drawer management." },
    { icon: <Package className="w-8 h-8 text-emerald-400" />, title: "2. Inventory & Stock Management", desc: "Real-time stock tracking across multi-locations, low stock automated alerts, barcode generation, and variant matrix tracking." },
    { icon: <Users className="w-8 h-8 text-emerald-400" />, title: "3. CRM & Customer Loyalty", desc: "Detailed client profiles, lifetime value tracking, tiered rewards points, gift cards, and targeted marketing integration." },
    { icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />, title: "4. Staff Management & RBAC", desc: "Granular role-based access control, integrated shift time-clock tracking, employee sales performance, and automated commission logs." },
    { icon: <Store className="w-8 h-8 text-emerald-400" />, title: "5. Multi-Store Enterprise Control", desc: "Centralized master dashboard managing multiple branches, inter-store inventory transfers, and localized tax/pricing structures." },
    { icon: <BarChart3 className="w-8 h-8 text-emerald-400" />, title: "6. Reports & Business Analytics", desc: "Real-time sales summaries, profit margin trends, Z-reports, and seamless CSV/Excel exports for accounting integration." },
    { icon: <Layers className="w-8 h-8 text-emerald-400" />, title: "7. Integrations & Extensibility", desc: "Two-way e-commerce sync (Shopify, WooCommerce, custom web apps), payment gateway APIs, and open REST webhooks." },
    { icon: <FileText className="w-8 h-8 text-emerald-400" />, title: "8. Quotation & B2B Invoicing", desc: "Dynamic quotes sent via email, interactive client approval loops, one-click conversion to proforma invoices, and payment logging." }
  ];

  const workflowSteps = [
    { step: "01", title: "Quotation Generation", desc: "Build itemized B2B quotations with custom tax, discounts, and expiration dates." },
    { step: "02", title: "Client Review & Feedback", desc: "Email secure PDF links allowing clients to review, request edits, or digitally approve." },
    { step: "03", title: "Proforma Conversion", desc: "Instantly convert approved quotations into proforma invoices without re-entering items." },
    { step: "04", title: "Payment & Ledger Logging", desc: "Process payments via gateways or cash, automatically updating inventory and general ledgers." }
  ];

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
                  <input 
                    type="email" 
                    required 
                    value={signInData.email}
                    onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                    placeholder="name@company.com" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                  <button type="button" onClick={() => navigateTo('forgot')} className="text-xs text-emerald-400 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                  <input 
                    type={showSignInPassword ? "text" : "password"} 
                    required 
                    value={signInData.password}
                    onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 pr-12 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                  >
                    {showSignInPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all mt-4">
                Sign In to Dashboard
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Don't have a store account?{' '}
              <button onClick={() => navigateTo('signup')} className="text-emerald-400 font-semibold hover:underline">
                Get Started
              </button>
            </div>
          </div>
        </div>
        <footer className="text-center text-xs text-slate-600 py-4">&copy; 2026 NderTech Universal Services.</footer>
      </div>
    );
  }

  // ================= VIEW: CONVERSATIONAL SIGN UP (GET STARTED) =================
  if (currentView === 'signup') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative">
        <div className="max-w-md mx-auto w-full pt-10">
          <button onClick={() => navigateTo('landing')} className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step {signupStep} of 3</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {signupStep === 1 ? 'Personal Info' : signupStep === 2 ? 'Business Details' : 'Secure Account'}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {signupStep === 1 && "Let's get to know you"}
              {signupStep === 2 && "Tell us about your business"}
              {signupStep === 3 && "Secure your SaaS instance"}
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              {signupStep === 1 && "Please enter your name and professional contact email."}
              {signupStep === 2 && "We need your store name, phone number, and branch address."}
              {signupStep === 3 && "Create a secure password with live strength verification."}
            </p>

            <form onSubmit={handleNextStep} className="space-y-4">
              {/* STEP 1 */}
              {signupStep === 1 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input 
                        type="text" 
                        required 
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Engr. Avela Marcel" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Work Email</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input 
                        type="email" 
                        required 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="admin@ndertech.com" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                      />
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {signupStep === 2 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Company / Store Name</label>
                    <div className="relative">
                      <Building className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input 
                        type="text" 
                        required 
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="NderTech Hub" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input 
                        type="tel" 
                        required 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+234 800 000 0000" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Business Address</label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input 
                        type="text" 
                        required 
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Makurdi, Benue State, Nigeria" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                      />
                    </div>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {signupStep === 3 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                      <input 
                        type={showSignUpPassword ? "text" : "password"} 
                        required 
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 pr-12 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                      >
                        {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Live Password Strength Requirements Checklist */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password Security Requirements:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center space-x-2 ${hasLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>One uppercase letter</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>One number</span>
                        </div>
                        <div className={`flex items-center space-x-2 ${hasSymbol ? 'text-emerald-400' : 'text-slate-500'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>One special symbol</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions Agreement Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        required
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-emerald-500" 
                      />
                      <span className="text-xs text-slate-400 leading-relaxed">
                        I agree to the{' '}
                        <button type="button" onClick={() => setActiveLegalModal('terms')} className="text-emerald-400 hover:underline font-semibold">Terms & Conditions</button>{' '}
                        and{' '}
                        <button type="button" onClick={() => setActiveLegalModal('privacy')} className="text-emerald-400 hover:underline font-semibold">Privacy Policy</button>.
                      </span>
                    </label>
                  </div>
                </>
              )}

              <div className="flex items-center space-x-3 pt-4">
                {signupStep > 1 && (
                  <button 
                    type="button" 
                    onClick={() => setSignupStep(signupStep - 1)}
                    className="w-1/3 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all"
                  >
                    Back
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={(signupStep === 3 && (!agreedToTerms || !isPasswordValid))}
                  className={`${signupStep > 1 ? 'w-2/3' : 'w-full'} py-3.5 rounded-xl ${(signupStep === 3 && (!agreedToTerms || !isPasswordValid)) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'} font-semibold text-sm transition-all flex items-center justify-center space-x-2`}
                >
                  <span>{signupStep === 3 ? 'Launch Tenant Instance' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <button onClick={() => navigateTo('signin')} className="text-emerald-400 font-semibold hover:underline">
                Sign In
              </button>
            </div>
          </div>
        </div>
        <footer className="text-center text-xs text-slate-600 py-4">&copy; 2026 NderTech Universal Services.</footer>

        {/* Non-Destructive Legal Modal Drawer */}
        {activeLegalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 relative shadow-2xl max-h-[80vh] overflow-y-auto">
              <button 
                onClick={() => setActiveLegalModal(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-bold text-white mb-4 capitalize">
                {activeLegalModal === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
              </h3>
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed mb-6">
                {activeLegalModal === 'terms' ? (
                  <>
                    <p>Welcome to NderTech POS & B2B Invoicing SaaS. By accessing or using our multi-tenant software platform, you agree to be bound by these Terms and Conditions.</p>
                    <p><strong>1. SaaS Subscription & Account Usage:</strong> Subscribers are granted a non-exclusive license to utilize our POS terminal, inventory tracking, and quotation workflows. You are responsible for safeguarding your admin credentials.</p>
                  </>
                ) : (
                  <>
                    <p>At NderTech Universal Services, we respect your privacy and protect your business data with industry-standard encryption protocols.</p>
                    <p><strong>1. Information We Collect:</strong> We collect merchant account details, customer directory records, inventory catalogs, and transaction ledgers strictly necessary to operate your POS terminal.</p>
                  </>
                )}
              </div>
              <button 
                onClick={() => setActiveLegalModal(null)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all"
              >
                Close & Return to Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW: FORGOTTEN PASSWORD =================
  if (currentView === 'forgot') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
        <div className="max-w-md mx-auto w-full pt-10">
          <button onClick={() => navigateTo('signin')} className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </button>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-sm text-slate-400 mb-8">Enter your work email address and we'll send you instructions to reset your password.</p>

            <form onSubmit={(e) => { 
              e.preventDefault(); 
              Swal.fire({
                title: 'Check Your Email',
                text: 'Password reset instructions sent to your email!',
                icon: 'success',
                confirmButtonColor: '#059669',
                background: '#0f172a',
                color: '#f8fafc'
              });
              navigateTo('signin'); 
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Work Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                  <input type="email" required placeholder="admin@company.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all mt-2">
                Send Reset Instructions
              </button>
            </form>
          </div>
        </div>
        <footer className="text-center text-xs text-slate-600 py-4">&copy; 2026 NderTech Universal Services.</footer>
      </div>
    );
  }

  // ================= VIEW: TERMS & CONDITIONS =================
  if (currentView === 'terms') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto w-full px-6 py-12">
          <button onClick={() => navigateTo('landing')} className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl font-extrabold text-white mb-6">Terms and Conditions</h1>
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
            <p>Welcome to NderTech POS & B2B Invoicing SaaS. By accessing or using our multi-tenant software platform, you agree to be bound by these Terms and Conditions.</p>
          </div>
        </div>
        <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">&copy; 2026 NderTech Universal Services.</footer>
      </div>
    );
  }

  // ================= VIEW: PRIVACY POLICY =================
  if (currentView === 'privacy') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto w-full px-6 py-12">
          <button onClick={() => navigateTo('landing')} className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl font-extrabold text-white mb-6">Privacy Policy</h1>
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
            <p>At NderTech Universal Services, we respect your privacy and protect your business data with industry-standard encryption protocols.</p>
          </div>
        </div>
        <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">&copy; 2026 NderTech Universal Services.</footer>
      </div>
    );
  }

  // ================= VIEW: DISCLAIMER =================
  if (currentView === 'disclaimer') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto w-full px-6 py-12">
          <button onClick={() => navigateTo('landing')} className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-emerald-400 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-3xl font-extrabold text-white mb-6">Platform Disclaimer</h1>
          <div className="space-y-6 text-slate-300 text-sm leading-relaxed bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
            <p>The information and software services provided by NderTech POS are on an "as is" and "as available" basis without warranties of any kind.</p>
          </div>
        </div>
        <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">&copy; 2026 NderTech Universal Services.</footer>
      </div>
    );
  }

  // ================= VIEW: LANDING PAGE =================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                NderTech POS
              </span>
              <span className="block text-xs font-medium text-emerald-400 tracking-wider uppercase">Enterprise SaaS</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-emerald-400 transition-colors">B2B Workflow</a>
            <a href="#architecture" className="hover:text-emerald-400 transition-colors">Tech Stack</a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => navigateTo('signin')}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigateTo('signup')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-emerald-400 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-4 text-base font-medium text-slate-300">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400 transition-colors">Features</a>
              <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400 transition-colors">B2B Workflow</a>
              <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400 transition-colors">Tech Stack</a>
            </nav>
            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-3">
              <button 
                onClick={() => navigateTo('signin')}
                className="w-full py-3 text-center rounded-xl bg-slate-800 text-white font-semibold text-sm transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigateTo('signup')}
                className="w-full py-3 text-center rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950/40 to-slate-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Multi-Tenant POS & Invoicing Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            The Ultimate <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Point of Sale</span> & B2B Suite for Growing Businesses
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal">
            Empower your retail stores, supermarkets, and wholesale businesses with real-time inventory, offline cashier terminals, and seamless quotation-to-invoice workflows.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigateTo('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
            >
              <span>Launch Your SaaS Store</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-base transition-all text-center"
            >
              Explore Live Modules
            </a>
          </div>
        </div>
      </section>

      {/* 8 Core Modules Grid */}
      <section id="features" className="py-24 bg-slate-900/50 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Packed with Advanced Enterprise Features
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Every tool your subscribers need to run retail counters, manage multi-branch stock, and close B2B enterprise deals effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {modules.map((mod, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/50 transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  {mod.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {mod.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Quotation Workflow Section (Module 8 Highlight) */}
      <section id="workflow" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>B2B Procurement Pipeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              From Quotation to Cash in 4 Steps
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Seamlessly bridge the gap between retail checkouts and corporate wholesale contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflowSteps.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
                <span className="text-3xl font-black text-emerald-500/30 absolute top-4 right-4">{item.step}</span>
                <h3 className="text-base font-bold text-white mb-2 mt-4">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack & Architecture Section */}
      <section id="architecture" className="py-20 bg-slate-900/30 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Built on Enterprise-Grade Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center space-x-3">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">React & Vite (SPA)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center space-x-3">
              <Server className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">Node.js API</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center space-x-3">
              <Database className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">PostgreSQL (RLS)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center space-x-3">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">IndexedDB Offline Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Legal Links */}
      <footer className="mt-auto py-12 bg-slate-950 border-t border-slate-900 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <p>&copy; 2026 NderTech Universal Services. Built for High-Performance SaaS Commerce.</p>
          <div className="flex space-x-6 text-xs">
            <button onClick={() => navigateTo('terms')} className="hover:text-emerald-400 transition-colors">Terms & Conditions</button>
            <button onClick={() => navigateTo('privacy')} className="hover:text-emerald-400 transition-colors">Privacy Policy</button>
            <button onClick={() => navigateTo('disclaimer')} className="hover:text-emerald-400 transition-colors">Disclaimer</button>
          </div>
        </div>
      </footer>
    </div>
  );
}