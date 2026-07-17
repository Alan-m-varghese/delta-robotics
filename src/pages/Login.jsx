import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const { showToast } = useContext(UIContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('⚠️ Please enter both email and password.');
      return;
    }
    
    // Perform simulated login
    login(email, role);
    showToast('🔐 Login successful. Welcome back!');
    navigate('/dashboard');
  };

  return (
    <div className="pt-20 bg-background text-on-background min-h-screen">
      <main className="flex-grow flex items-center justify-center pt-16 pb-12 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] rounded-full border-[40px] border-primary-container blur-3xl"></div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-full max-w-lg p-md md:p-lg z-10 relative">
          <div className="text-center mb-lg">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-xs">Welcome Back</h1>
            <p className="font-body-md text-body-md text-secondary">Sign in to continue your robotics journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-md">
            {/* Role Selection */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wide">Select Role</label>
              <div className="grid grid-cols-3 gap-sm">
                
                <div 
                  className={`role-card border border-outline-variant rounded-lg p-sm flex flex-col items-center justify-center text-center h-24 ${
                    role === 'student' ? 'active' : ''
                  }`}
                  onClick={() => setRole('student')}
                >
                  <span className="material-symbols-outlined text-3xl mb-xs transition-colors text-secondary">school</span>
                  <span className="font-label-md text-label-md text-on-background font-semibold">Student</span>
                </div>

                <div 
                  className={`role-card border border-outline-variant rounded-lg p-sm flex flex-col items-center justify-center text-center h-24 ${
                    role === 'intern' ? 'active' : ''
                  }`}
                  onClick={() => setRole('intern')}
                >
                  <span className="material-symbols-outlined text-3xl mb-xs text-secondary transition-colors">engineering</span>
                  <span className="font-label-md text-label-md text-on-background font-semibold">Intern</span>
                </div>

                <div 
                  className={`role-card border border-outline-variant rounded-lg p-sm flex flex-col items-center justify-center text-center h-24 ${
                    role === 'admin' ? 'active' : ''
                  }`}
                  onClick={() => setRole('admin')}
                >
                  <span className="material-symbols-outlined text-3xl mb-xs text-secondary transition-colors">admin_panel_settings</span>
                  <span className="font-label-md text-label-md text-on-background font-semibold">Admin</span>
                </div>

              </div>
            </div>

            {/* Credentials */}
            <div className="space-y-sm">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="email">Email Address</label>
                <input 
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded px-sm py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors" 
                  id="email" 
                  placeholder="name@deltarobotics.edu" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-xs">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                  <a className="font-label-md text-label-md text-primary-container hover:underline" href="#forgot" onClick={(e) => { e.preventDefault(); showToast('🔑 Password reset link simulated.'); }}>Forgot Password?</a>
                </div>
                <input 
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded px-sm py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-sm">
              <button 
                className="w-full bg-primary-container text-on-primary font-headline-md text-headline-md font-bold uppercase rounded-lg py-3 hover:opacity-90 transition-all flex justify-center items-center gap-xs cursor-pointer" 
                type="submit"
              >
                Login <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Sign-up Link */}
          <div className="mt-lg text-center border-t border-surface-variant pt-md">
            <p className="font-body-md text-body-md text-secondary">
              New to Delta Robotics? <Link className="text-primary-container font-semibold hover:underline" to="/signup">Sign up here</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
