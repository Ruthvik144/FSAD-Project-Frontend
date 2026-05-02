import React, { useState, useEffect } from 'react';
import { Heart, ShieldAlert, ArrowRight, User, CalendarDays, Smartphone, Mail, KeyRound, RefreshCw } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
  const [role, setRole] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);

  // Form Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  // Captcha State
  const [captchaWord, setCaptchaWord] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaWord(result);
    setCaptchaValue('');
  };

  useEffect(() => {
    generateCaptcha();
  }, [isRegistering]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) return setError('Email and password are required.');
    
    if (isRegistering) {
      if (!name) return setError('Please enter your name.');
      if (!age) return setError('Please enter your age.');
      if (!phone) return setError('Please enter your phone number.');
    }

    if (captchaValue !== captchaWord) {
      generateCaptcha();
      return setError('CAPTCHA does not match. Please try again.');
    }

    setIsLoading(true);
    
    try {
      const endpoint = isRegistering ? 'register' : 'login';
      const body = isRegistering 
        ? { name, age, phone, email, password, role } 
        : { email, password };
        
      const response = await fetch(`http://localhost:2026/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      onLogin(data.user?.role || role, data.user);
    } catch (err) {
      setError(err.message);
      // Generate standard new captcha on fail
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
        
        <div className="flex flex-col items-center mb-6">
          <div className="p-4 bg-indigo-100 rounded-full text-indigo-600 mb-4">
            <Heart size={40} className="fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">WellCampus</h1>
          <p className="text-gray-500">
            {isRegistering ? 'Create New Account' : `${role === 'admin' ? 'Administrative' : 'Member'} Login`}
          </p>
        </div>

        {!isRegistering && (
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button 
              type="button"
              onClick={() => { setRole('student'); setError(''); }} 
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Member
            </button>
            <button 
              type="button"
              onClick={() => { setRole('admin'); setError(''); }} 
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Admin
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegistering && (
            <div className="space-y-4 animate-in slide-in-from-top-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500" />
                    </div>
                 </div>
                 <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-gray-500 rounded-xl">
                      {role === 'admin' ? 'Admin' : 'Member'}
                    </div>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={role === 'student' ? "member@example.com" : "admin@university.edu"} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
              Verify you are human
            </label>
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-200">
              <div className="flex gap-4 items-center mb-3">
                <div 
                  className="flex-1 bg-white border border-gray-300 py-2 rounded-lg font-mono text-xl tracking-[0.3em] font-bold text-gray-800 flex items-center justify-center select-none shadow-sm relative overflow-hidden h-12"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 4px 4px'
                  }}
                >
                  {/* Random line strikes to make it look like captcha */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                     <svg width="100%" height="100%">
                         <line x1="0" y1="10" x2="100%" y2="40" stroke="black" strokeWidth="2" />
                         <line x1="0" y1="40" x2="100%" y2="10" stroke="black" strokeWidth="1" />
                     </svg>
                  </div>
                  <span className="relative z-10 strike-through mix-blend-difference text-slate-800" style={{ textShadow: "1px 1px 0 #fff" }}>
                    {captchaWord}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={generateCaptcha} 
                  className="text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 hover:border-indigo-300 transition-colors p-2 rounded-lg shadow-sm"
                  title="Generate new CAPTCHA"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={captchaValue} 
                  onChange={e => setCaptchaValue(e.target.value)} 
                  placeholder="Type the characters" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" 
                  required 
                />
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded flex items-center gap-2 animate-in fade-in"><ShieldAlert size={14} /> {error}</p>}

          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70">
            {isLoading ? 'Authenticating...' : (isRegistering ? 'Create Account' : 'Login')} <ArrowRight size={18} />
          </button>

          {!isLoading && (
            <div className="text-center pt-2">
              <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="text-indigo-600 text-sm font-semibold hover:underline">
                {isRegistering ? "Already have an account? Login" : `New ${role === 'admin' ? 'Admin' : 'User'}? Create Account`}
              </button>
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Secure authentication with CAPTCHA verification.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
