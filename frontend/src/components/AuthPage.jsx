import React, { useState } from 'react';
import { Scale, ArrowLeft } from 'lucide-react';

export default function AuthPage({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    const emailTrimmed = formData.email.trim().toLowerCase();

    // Get existing registered users list from localStorage
    let registeredUsers = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem('dhaara_registered_users') || '[]');
    } catch {
      registeredUsers = [];
    }

    if (isLogin) {
      // Find matching user by email
      const existingUser = registeredUsers.find(
        u => u.email && u.email.trim().toLowerCase() === emailTrimmed
      );

      let userName = '';
      if (existingUser && existingUser.name) {
        userName = existingUser.name;
      } else {
        // Fallback: derive name from email prefix (e.g. raghav@gmail.com -> Raghav)
        const prefix = emailTrimmed.split('@')[0] || 'User';
        userName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      }

      onLogin({
        name: userName,
        email: formData.email,
        password: formData.password
      });
    } else {
      // Registration flow
      if (formData.password !== formData.confirmPassword) {
        setAuthError('Passwords do not match');
        return;
      }

      const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.firstName.trim() || 'User';
      
      // Update or append in registered users list
      const filtered = registeredUsers.filter(
        u => u.email && u.email.trim().toLowerCase() !== emailTrimmed
      );
      filtered.push({
        email: emailTrimmed,
        name: fullName,
        password: formData.password
      });

      localStorage.setItem('dhaara_registered_users', JSON.stringify(filtered));

      onLogin({
        name: fullName,
        email: formData.email,
        password: formData.password
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#eef2f6',
      backgroundImage: `linear-gradient(rgba(200, 210, 220, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 210, 220, 0.3) 1px, transparent 1px)`,
      backgroundSize: '60px 60px',
      fontFamily: 'Inter, sans-serif',
      overflowX: 'hidden',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
        }

        .auth-container {
          display: flex;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
          padding: 2rem;
          box-sizing: border-box;
        }
        
        .auth-left {
          flex: 1;
          padding-right: 4rem;
          box-sizing: border-box;
          min-width: 0;
        }

        .auth-right {
          flex: 1;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
          min-width: 0;
          width: 100%;
        }
        
        .auth-card {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 440px;
          box-sizing: border-box;
        }

        input {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
          min-width: 0;
        }
        input:focus {
          border-color: #3b82f6;
        }
        
        .row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          width: 100%;
        }

        .row input {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 900px) {
          .auth-container {
            flex-direction: column !important;
            justify-content: center !important;
            padding: 1rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .auth-left {
            padding-right: 0 !important;
            margin-bottom: 2rem !important;
            text-align: center !important;
            width: 100% !important;
          }
          .auth-right {
            width: 100% !important;
          }
          .auth-card {
            padding: 1.75rem 1.25rem !important;
            border-radius: 18px !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .trust-section {
            justify-content: center !important;
          }
          .auth-back-btn {
            position: static !important;
            margin: 0 !important;
          }
        }

        @media (max-width: 480px) {
          .row {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
      
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem 1rem 0', boxSizing: 'border-box' }}>
        <button onClick={onBack} className="auth-back-btn" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
          background: 'white', border: '1px solid #e2e8f0', color: '#0f172a', padding: '0.45rem 0.9rem', 
          borderRadius: '999px', cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem'
        }}>
          <ArrowLeft size={15} /> Back to Home
        </button>
      </div>

      <div className="auth-container">
        {/* Left Side */}
        <div className="auth-left">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', fontSize: '1.6rem', fontWeight: 'bold', color: '#0f172a' }}>
            <div style={{ background: '#2563eb', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={24} color="white" />
            </div>
            DhaaraAI
          </div>
          
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3.25rem)', fontWeight: '700', color: '#0f172a', lineHeight: '1.15', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            The #1 <span style={{ color: '#2563eb' }}>AI legal assistant</span> for everyday legal issues
          </h1>
          
          <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', color: '#64748b', lineHeight: '1.6', marginBottom: '2rem', maxWidth: '480px' }}>
            Join thousands of lawyers and legal professionals using AI to streamline research, review documents, and resolve legal questions in seconds.
          </p>
          
          <div className="trust-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex' }}>
              <img src="https://i.pravatar.cc/100?img=1" alt="User 1" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #eef2f6', zIndex: 3 }} />
              <img src="https://i.pravatar.cc/100?img=2" alt="User 2" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #eef2f6', marginLeft: '-15px', zIndex: 2 }} />
              <img src="https://i.pravatar.cc/100?img=3" alt="User 3" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #eef2f6', marginLeft: '-15px', zIndex: 1 }} />
            </div>
            <span style={{ color: '#64748b', fontSize: '1rem' }}>Trusted by professionals worldwide</span>
          </div>
          
          <p style={{ color: '#2563eb', fontWeight: '600', fontSize: '1rem' }}>
            1,000,000+ <span style={{ color: '#94a3b8', fontWeight: '400' }}>legal queries processed</span>
          </p>
        </div>

        {/* Right Side (Form) */}
        <div className="auth-right">
          <div className="auth-card">
            <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
              {isLogin ? 'Sign in to access your dashboard' : 'Join DhaaraAI and revolutionize your legal work'}
            </p>
            
            <button style={{ width: '100%', padding: '0.85rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: '500', color: '#334155', cursor: 'pointer', marginBottom: '1.5rem', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='white'}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                 <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                 <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                 <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                 <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
               </svg>
               {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
              <span style={{ padding: '0 10px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', background: '#eef2f6', borderRadius: '4px', margin: '0 10px' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="row">
                  <input type="text" placeholder="First Name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  <input type="text" placeholder="Last Name" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              )}
              <div style={{ marginBottom: '1rem' }}>
                <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              {!isLogin && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <input type="password" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
              )}

              <button type="submit" style={{ width: '100%', background: '#2563eb', color: 'white', padding: '0.85rem', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', marginBottom: '1.5rem' }} onMouseOver={e=>e.currentTarget.style.background='#1d4ed8'} onMouseOut={e=>e.currentTarget.style.background='#2563eb'}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.5' }}>
              By {isLogin ? 'signing in' : 'signing up'}, you agree to our <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
