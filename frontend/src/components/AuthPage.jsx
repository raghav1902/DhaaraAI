import React, { useState } from 'react';
import { Scale, ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';

export default function AuthPage({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        setAuthError('Passwords do not match. Please verify and try again.');
        return;
      }

      const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.firstName.trim() || 'User';

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

  const handleGoogleAuth = () => {
    onLogin({
      name: 'Advocate User',
      email: 'advocate.user@dhaaraai.com',
      password: 'google-oauth-session'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fbf9f6',
      backgroundImage: `radial-gradient(#e5e0d6 0.75px, transparent 0.75px)`,
      backgroundSize: '32px 32px',
      color: '#0f172a',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .auth-shell {
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          padding: 2rem 1.5rem 3.5rem;
          display: grid;
          grid-template-columns: 4fr 5fr;
          gap: 3.5rem;
          align-items: center;
          flex: 1;
          box-sizing: border-box;
          animation: pageFadeIn 0.35s ease-out forwards;
        }

        .auth-brand-col {
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          height: 100%;
          min-height: 520px;
          position: relative;
        }

        .auth-bg-art {
          position: absolute;
          bottom: -15px;
          left: -15px;
          width: 95%;
          max-width: 420px;
          height: 220px;
          background-image: url(/assets/legal/how/court_dome_sketch.jpg);
          background-size: cover;
          background-position: center bottom;
          opacity: 0.22;
          mask-image: radial-gradient(ellipse at 40% 70%, black 30%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at 40% 70%, black 30%, transparent 75%);
          pointer-events: none;
          z-index: 1;
          animation: artReveal 0.6s ease-out forwards;
        }

        .auth-form-card {
          background: #ffffff;
          border: 1px solid #e7e3da;
          border-radius: 18px;
          padding: 2.5rem 2.25rem;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02);
          width: 100%;
          max-width: 480px;
          margin-left: auto;
          box-sizing: border-box;
          animation: formSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          position: relative;
          z-index: 2;
        }

        .auth-input-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.35rem;
          letter-spacing: -0.01em;
        }

        .auth-text-input {
          width: 100%;
          padding: 0.72rem 0.95rem;
          background: #ffffff;
          border: 1px solid #d4cfc5;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .auth-text-input:focus {
          border-color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
        }

        .auth-password-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-password-wrapper .auth-text-input {
          padding-right: 2.6rem;
        }

        .auth-eye-btn {
          position: absolute;
          right: 0.65rem;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border-radius: 4px;
          transition: color 0.15s;
        }

        .auth-eye-btn:hover {
          color: #0f172a;
        }

        .auth-primary-btn {
          width: 100%;
          background: #1d4ed8;
          color: #ffffff;
          border: none;
          padding: 0.82rem 1rem;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease;
          font-family: inherit;
          box-shadow: 0 2px 6px rgba(29, 78, 216, 0.2);
        }

        .auth-primary-btn:hover {
          background: #1e40af;
        }

        .auth-primary-btn:active {
          transform: translateY(1px);
        }

        .auth-google-button {
          width: 100%;
          background: #ffffff;
          border: 1px solid #d4cfc5;
          border-radius: 10px;
          padding: 0.72rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .auth-google-button:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes artReveal {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 0.22; transform: translateY(0); }
        }

        @keyframes formSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .auth-shell, .auth-form-card, .auth-bg-art {
            animation: none !important;
          }
          .auth-primary-btn:active {
            transform: none !important;
          }
        }

        @media (max-width: 900px) {
          .auth-shell {
            grid-template-columns: 1fr !important;
            gap: 2.25rem !important;
            padding: 1.5rem 1rem 3rem !important;
          }
          .auth-brand-col {
            min-height: auto !important;
          }
          .auth-form-card {
            margin: 0 auto !important;
            max-width: 100% !important;
            padding: 2rem 1.5rem !important;
          }
          .auth-bg-art {
            display: none !important;
          }
        }

        @media (max-width: 500px) {
          .auth-names-grid {
            grid-template-columns: 1fr !important;
            gap: 0.85rem !important;
          }
          .auth-form-card {
            padding: 1.75rem 1.25rem !important;
          }
        }
      `}</style>

      {/* Top Bar with Back Link */}
      <header style={{
        width: '100%',
        maxWidth: '1140px',
        margin: '0 auto',
        padding: '1.5rem 1.5rem 0.5rem',
        boxSizing: 'border-box'
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'transparent',
            border: 'none',
            color: '#475569',
            fontSize: '0.84rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '0.35rem 0.5rem',
            borderRadius: '6px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
        >
          <ArrowLeft size={15} />
          <span>Back to Home</span>
        </button>
      </header>

      {/* Split-Screen Main Surface */}
      <main className="auth-shell">

        {/* Left Column (40%): Brand, Headline, Benefits, Background Sketch */}
        <section className="auth-brand-col">
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* DhaaraAI Logo */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                background: '#1d4ed8',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(29, 78, 216, 0.25)'
              }}>
                <Scale size={18} />
              </div>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.35rem',
                fontWeight: '800',
                color: '#0b1329',
                letterSpacing: '-0.02em'
              }}>
                Dhaara<span style={{ color: '#1d4ed8' }}>AI</span>
              </span>
            </div>

            {/* Short Stately Headline */}
            <h1 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 'clamp(1.85rem, 2.6vw, 2.35rem)',
              fontWeight: '600',
              lineHeight: '1.25',
              color: '#0b1329',
              margin: '0 0 1.25rem 0',
              letterSpacing: '-0.02em'
            }}>
              India’s Legal Intelligence,<br />
              <span style={{ color: '#1d4ed8' }}>Built for Indian Law.</span>
            </h1>

            {/* 2-3 Short Benefit Points */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              marginTop: '1.5rem',
              maxWidth: '380px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  <Check size={12} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', fontWeight: '500' }}>
                  Native BNS 2023 & IPC statutory concordance
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  <Check size={12} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', fontWeight: '500' }}>
                  Supreme Court & High Court verified precedents
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  <Check size={12} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', fontWeight: '500' }}>
                  Private legal workspace with zero AI training retention
                </span>
              </div>
            </div>
          </div>

          {/* Background Illustration blended softly */}
          <div className="auth-bg-art" aria-hidden="true" />
        </section>

        {/* Right Column (60%): Clean White Signup Card */}
        <section className="auth-form-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: '1.75rem',
              fontWeight: '600',
              color: '#0b1329',
              margin: '0 0 0.35rem 0',
              letterSpacing: '-0.015em'
            }}>
              {isLogin ? 'Sign in to DhaaraAI' : 'Create your DhaaraAI account'}
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '0.84rem',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {isLogin
                ? 'Enter your credentials to access your legal workspace.'
                : 'Start your instant access to Indian statutory intelligence.'}
            </p>
          </div>

          {/* Google Single-Sign-On */}
          <button
            type="button"
            className="auth-google-button"
            onClick={handleGoogleAuth}
            style={{ marginBottom: '1.25rem' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{isLogin ? 'Sign in with Google' : 'Sign up with Google'}</span>
          </button>

          {/* Thin Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.25rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e7e3da' }} />
            <span style={{
              padding: '0 10px',
              color: '#94a3b8',
              fontSize: '0.74rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e7e3da' }} />
          </div>

          {/* Auth Error Banner */}
          {authError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '500',
              marginBottom: '1.25rem'
            }}>
              {authError}
            </div>
          )}

          {/* Signup / Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            {/* First + Last Name (Signup mode) */}
            {!isLogin && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem'
              }} className="auth-names-grid">
                <div>
                  <label className="auth-input-label">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Rajesh"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="auth-text-input"
                  />
                </div>
                <div>
                  <label className="auth-input-label">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Malhotra"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="auth-text-input"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="auth-input-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="advocate@chamber.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="auth-text-input"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="auth-input-label">Password</label>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="auth-text-input"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Signup mode) */}
            {!isLogin && (
              <div>
                <label className="auth-input-label">Confirm Password</label>
                <div className="auth-password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="auth-text-input"
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <div style={{ marginTop: '0.4rem' }}>
              <button type="submit" className="auth-primary-btn">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Sign In / Sign Up Toggle */}
          <div style={{
            textAlign: 'center',
            fontSize: '0.82rem',
            color: '#64748b',
            marginTop: '1.25rem',
            marginBottom: '0.75rem'
          }}>
            <span>{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setAuthError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#1d4ed8',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.82rem',
                textDecoration: 'underline',
                textUnderlineOffset: '2px'
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          {/* Terms & Privacy */}
          <p style={{
            textAlign: 'center',
            fontSize: '0.72rem',
            color: '#94a3b8',
            lineHeight: '1.5',
            margin: '0.75rem 0 0 0'
          }}>
            By continuing, you agree to DhaaraAI’s{' '}
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#475569', textDecoration: 'underline' }}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#475569', textDecoration: 'underline' }}>
              Privacy Policy
            </a>.
          </p>
        </section>

      </main>
    </div>
  );
}
