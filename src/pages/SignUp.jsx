import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';

export default function SignUp() {
  const { signup } = useContext(AuthContext);
  const { showToast } = useContext(UIContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [notifyEvents, setNotifyEvents] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, institution, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !institution || !password || !confirmPassword) {
      showToast('⚠️ Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('❌ Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      showToast('⚠️ You must agree to the Terms of Service.');
      return;
    }

    // Call simulated registration
    signup(firstName, lastName, email, institution);
    showToast('🎉 Account created successfully! Welcome to Delta Robotics.');
    navigate('/dashboard');
  };

  return (
    <div className="pt-20 bg-background text-on-background min-h-screen">
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-12">
        <div className="w-full max-w-2xl bg-surface-container-lowest border border-surface-variant rounded-xl p-md md:p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.05)] relative overflow-hidden">
          
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-primary-container"></div>
          
          <div className="text-center mb-lg pt-4">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-sm">
              Join the Next Generation of Engineers
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Create your Delta Robotics student account today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="firstName">First Name</label>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md h-12" 
                  id="firstName" 
                  name="firstName" 
                  placeholder="Ada" 
                  required 
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="lastName">Last Name</label>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md h-12" 
                  id="lastName" 
                  name="lastName" 
                  placeholder="Lovelace" 
                  required 
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">Email Address</label>
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md h-12" 
                id="email" 
                name="email" 
                placeholder="ada@university.edu" 
                required 
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="institution">Institutional / School Name</label>
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md h-12" 
                id="institution" 
                name="institution" 
                placeholder="Institute of Technology" 
                required 
                type="text"
                value={formData.institution}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="password">Password</label>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md h-12" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md h-12" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-sm pt-sm">
              <label className="flex items-start gap-sm cursor-pointer">
                <input 
                  className="mt-1 w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container bg-surface-container-lowest" 
                  required 
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="font-body-md text-body-md text-on-surface-variant">
                  I agree to the <a className="text-primary hover:underline" href="#terms" onClick={(e) => { e.preventDefault(); showToast('📜 Terms of Service window.'); }}>Terms of Service</a> and Privacy Policy.
                </span>
              </label>
              <label className="flex items-start gap-sm cursor-pointer">
                <input 
                  className="mt-1 w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-primary-container bg-surface-container-lowest" 
                  type="checkbox"
                  checked={notifyEvents}
                  onChange={(e) => setNotifyEvents(e.target.checked)}
                />
                <span className="font-body-md text-body-md text-on-surface-variant">Notify me of new workshops and robotics events.</span>
              </label>
            </div>

            <div className="pt-md flex flex-col gap-md">
              <button 
                type="submit"
                className="w-full bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg transition-colors font-bold uppercase tracking-wider h-12 cursor-pointer"
              >
                Create Account
              </button>
              <div className="text-center">
                <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" to="/login">
                  Already have an account? <span className="font-bold text-primary-container">Log in</span>
                </Link>
              </div>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}
