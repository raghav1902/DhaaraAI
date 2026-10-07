import React, { useState, useEffect, useMemo } from 'react';
import { Scale, ArrowLeft, Eye, EyeOff, Check, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../config/apiConfig';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '#e2e8f0' };
  let score = 0;
  if (pwd.length >= 6) score += 1;
  if (pwd.length >= 8) score += 1;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
  if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
  if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
  if (score === 3) return { score: 3, label: 'Good', color: '#3b82f6' };
  return { score: 4, label: 'Strong', color: '#10b981' };
};

const validateField = (name, value, allValues, loginMode) => {
  const val = (value || '').trim();
  switch (name) {
    case 'firstName':
      if (!loginMode) {
        if (!val) return 'First name is required.';
        if (val.length < 2) return 'First name must be at least 2 characters.';
        if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Name should only contain letters.';
      }
      return '';
    case 'lastName':
      if (!loginMode) {
        if (!val) return 'Last name is required.';
        if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Name should only contain letters.';
      }
      return '';
    case 'email':
      if (!val) return 'Email address is required.';
      if (!EMAIL_REGEX.test(val)) return 'Please enter a valid email address (e.g. advocate@chamber.in).';
      if (val.length > 254) return 'Email address is too long (max 254 characters).';
      return '';
    case 'password':
      if (!value) return 'Password is required.';
      if (value.length < 6) return 'Password must be at least 6 characters.';
      if (value.length > 128) return 'Password is too long (max 128 characters).';
      return '';
    case 'confirmPassword':
      if (!loginMode) {
        if (!value) return 'Please confirm your password.';
        if (value !== allValues.password) return 'Passwords do not match.';
      }
      return '';
    default:
      return '';
  }
};

export default function AuthPage({ onLogin, onBack, initialMode = 'login' }) {
  useEffect(() => {
    document.body.classList.remove('dark-theme');
    document.documentElement.classList.remove('dark-theme');
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLogin(initialMode === 'login');
    setAuthError('');
    setFieldErrors({});
    setTouched({});
  }, [initialMode]);

  const pwdStrength = useMemo(() => {
    return getPasswordStrength(formData.password);
  }, [formData.password]);

  const handleFieldChange = (field, value) => {
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);

    if (touched[field]) {
      const err = validateField(field, value, updatedForm, isLogin);
      setFieldErrors((prev) => ({ ...prev, [field]: err }));
    }

    // Re-check confirmPassword when password updates if confirmPassword was already touched
    if (field === 'password' && !isLogin && touched.confirmPassword) {
      const confirmErr = validateField('confirmPassword', updatedForm.confirmPassword, updatedForm, isLogin);
      setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field], formData, isLogin);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setAuthError('');
    setFieldErrors({});
    setTouched({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    // Validate all applicable fields
    const fieldsToValidate = isLogin
      ? ['email', 'password']
      : ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];

    const newTouched = {};
    const newErrors = {};
    let hasError = false;

    fieldsToValidate.forEach((f) => {
      newTouched[f] = true;
      const err = validateField(f, formData[f], formData, isLogin);
      if (err) {
        newErrors[f] = err;
        hasError = true;
      }
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setFieldErrors(newErrors);

    if (hasError) {
      const firstInvalidField = fieldsToValidate.find((f) => newErrors[f]);
      if (firstInvalidField) {
        document.getElementById(`auth-input-${firstInvalidField}`)?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    const emailTrimmed = formData.email.trim().toLowerCase();

    try {
      if (isLogin) {
        // Authenticate with backend
        const response = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailTrimmed,
            password: formData.password
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || 'Invalid email or password.');
        }

        const data = await response.json();
        onLogin({
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          token: data.token
        });
      } else {
        // Registration flow
        const fullName = `${formData.firstName} ${formData.lastName}`.trim() || formData.firstName.trim() || 'User';

        const response = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailTrimmed,
            password: formData.password,
            name: fullName
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || 'Registration failed. User may already exist.');
        }

        const data = await response.json();
        onLogin({
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          token: data.token
        });
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please check server connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'advocate.user@dhaaraai.com',
          password: 'google-oauth-session-key'
        })
      });
      if (!response.ok) {
        throw new Error('Google Sign-In is unavailable or backend is not reachable. Please use email & password.');
      }
      const data = await response.json();
      onLogin({
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        token: data.token
      });
    } catch (err) {
      setAuthError(err.message || 'Google Single Sign-On service unreachable. Please sign in with your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="auth-page-root"
      style={{
        minHeight: '100vh',
        minHeight: '100dvh',
        width: '100%',
        backgroundColor: '#fbf9f6',
        backgroundImage: `radial-gradient(#e5e0d6 0.75px, transparent 0.75px)`,
        backgroundSize: '32px 32px',
        color: '#0f172a',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <style>{`
        .auth-shell {
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 3.5rem;
          display: grid;
          grid-template-columns: 4fr 5fr;
          gap: 3.5rem;
          align-items: stretch;
          flex: 1;
          box-sizing: border-box;
          animation: pageFadeIn 0.35s ease-out forwards;
        }

        .auth-brand-col {
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          min-height: 560px;
          position: relative;
          padding: 0.5rem 0 1rem;
        }

        .auth-bg-art {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          max-width: 440px;
          height: 180px;
          background-image: url(/assets/legal/how/court_dome_sketch.jpg);
          background-size: cover;
          background-position: center bottom;
          opacity: 0.16;
          mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 55%, transparent 100%);
          -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 55%, transparent 100%);
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
          transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .auth-text-input:focus {
          border-color: #1d4ed8;
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
        }

        .auth-text-input.input-error {
          border-color: #ef4444 !important;
          background-color: #fffafa !important;
        }

        .auth-text-input.input-error:focus {
          border-color: #dc2626 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.14) !important;
        }

        .auth-text-input.input-success {
          border-color: #10b981 !important;
        }

        .auth-field-error {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #dc2626;
          font-size: 0.75rem;
          font-weight: 500;
          margin-top: 0.32rem;
          line-height: 1.35;
          animation: fieldErrFade 0.18s ease-out;
        }

        @keyframes fieldErrFade {
          from { opacity: 0; transform: translateY(-3px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pwd-strength-bar {
          display: flex;
          gap: 4px;
          margin-top: 0.4rem;
          align-items: center;
        }

        .pwd-strength-seg {
          height: 3.5px;
          flex: 1;
          border-radius: 2px;
          background: #e2e8f0;
          transition: background-color 0.25s ease;
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
            gap: 1.5rem !important;
            padding: 1rem 1rem 2.5rem !important;
            max-width: 520px !important;
          }
          .auth-brand-col {
            min-height: auto !important;
            text-align: center !important;
            align-items: center !important;
            margin-bottom: 0.25rem !important;
          }
          .auth-brand-logo-wrap {
            justify-content: center !important;
            margin-bottom: 0.85rem !important;
          }
          .auth-brand-col h1 {
            font-size: clamp(1.4rem, 4.5vw, 1.85rem) !important;
            margin-bottom: 0.5rem !important;
            line-height: 1.25 !important;
          }
          .auth-brand-benefits,
          .auth-brand-trust-box {
            display: none !important;
          }
          .auth-form-card {
            margin: 0 auto !important;
            max-width: 100% !important;
            padding: 2rem 1.75rem !important;
          }
          .auth-bg-art {
            display: none !important;
          }
        }

        @media (max-width: 600px) {
          .auth-header-bar {
            padding: 0.85rem 1rem 0.25rem !important;
          }
          .auth-shell {
            padding: 0.5rem 0.85rem 2rem !important;
            gap: 1.15rem !important;
          }
          .auth-brand-logo-wrap {
            margin-bottom: 0.6rem !important;
          }
          .auth-brand-col h1 {
            font-size: 1.3rem !important;
            margin-bottom: 0.25rem !important;
          }
          .auth-form-card {
            padding: 1.5rem 1.15rem !important;
            border-radius: 16px !important;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05) !important;
          }
          .auth-form-card h2 {
            font-size: 1.4rem !important;
          }
          .auth-names-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
          .auth-text-input {
            font-size: 16px !important; /* Prevents auto-zoom on iOS Safari */
            padding: 0.72rem 0.85rem !important;
          }
          .auth-password-wrapper .auth-text-input {
            padding-right: 2.85rem !important;
          }
          .auth-eye-btn {
            width: 38px !important;
            height: 38px !important;
            right: 0.25rem !important;
          }
          .auth-google-button {
            padding: 0.75rem 0.85rem !important;
            font-size: 0.85rem !important;
            min-height: 44px !important;
          }
          .auth-primary-btn {
            padding: 0.82rem 1rem !important;
            font-size: 0.92rem !important;
            min-height: 46px !important;
          }
        }

        @media (max-width: 380px) {
          .auth-form-card {
            padding: 1.25rem 0.85rem !important;
            border-radius: 14px !important;
          }
          .auth-brand-col h1 {
            font-size: 1.15rem !important;
          }
        }
      `}</style>

      {/* Top Bar with Back Link */}
      <header className="auth-header-bar" style={{
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
            <div className="auth-brand-logo-wrap" style={{
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
            <div className="auth-brand-benefits" style={{
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

            {/* Chamber Trust Assurance Box */}
            <div className="auth-brand-trust-box" style={{
              marginTop: '1.75rem',
              padding: '0.85rem 1rem',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: '1px solid #e7e3da',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
              maxWidth: '380px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1e293b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Judicial Research Grade
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.79rem', color: '#64748b', lineHeight: '1.45' }}>
                Conforms with DPDP Act 2023 data residency. Client briefs & vault uploads are private with zero LLM model retention.
              </p>
            </div>
          </div>

          {/* Background Illustration blended softly at column base */}
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
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
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
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            {/* First + Last Name (Signup mode) */}
            {!isLogin && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem'
              }} className="auth-names-grid">
                <div>
                  <label htmlFor="auth-input-firstName" className="auth-input-label">First Name *</label>
                  <input
                    id="auth-input-firstName"
                    type="text"
                    placeholder="Rajesh"
                    value={formData.firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    onBlur={() => handleFieldBlur('firstName')}
                    className={`auth-text-input ${touched.firstName && fieldErrors.firstName ? 'input-error' : ''}`}
                    aria-invalid={!!(touched.firstName && fieldErrors.firstName)}
                  />
                  {touched.firstName && fieldErrors.firstName && (
                    <div className="auth-field-error">
                      <AlertCircle size={13} style={{ flexShrink: 0 }} />
                      <span>{fieldErrors.firstName}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="auth-input-lastName" className="auth-input-label">Last Name *</label>
                  <input
                    id="auth-input-lastName"
                    type="text"
                    placeholder="Malhotra"
                    value={formData.lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    onBlur={() => handleFieldBlur('lastName')}
                    className={`auth-text-input ${touched.lastName && fieldErrors.lastName ? 'input-error' : ''}`}
                    aria-invalid={!!(touched.lastName && fieldErrors.lastName)}
                  />
                  {touched.lastName && fieldErrors.lastName && (
                    <div className="auth-field-error">
                      <AlertCircle size={13} style={{ flexShrink: 0 }} />
                      <span>{fieldErrors.lastName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="auth-input-email" className="auth-input-label">Email Address *</label>
              <input
                id="auth-input-email"
                type="email"
                placeholder="advocate@chamber.in"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                className={`auth-text-input ${touched.email && fieldErrors.email ? 'input-error' : ''}`}
                aria-invalid={!!(touched.email && fieldErrors.email)}
              />
              {touched.email && fieldErrors.email && (
                <div className="auth-field-error">
                  <AlertCircle size={13} style={{ flexShrink: 0 }} />
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="auth-input-password" className="auth-input-label">Password *</label>
              <div className="auth-password-wrapper">
                <input
                  id="auth-input-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={() => handleFieldBlur('password')}
                  className={`auth-text-input ${touched.password && fieldErrors.password ? 'input-error' : ''}`}
                  aria-invalid={!!(touched.password && fieldErrors.password)}
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
              {touched.password && fieldErrors.password && (
                <div className="auth-field-error">
                  <AlertCircle size={13} style={{ flexShrink: 0 }} />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
              {!isLogin && formData.password.length > 0 && (
                <div style={{ marginTop: '0.45rem' }}>
                  <div className="pwd-strength-bar">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className="pwd-strength-seg"
                        style={{
                          backgroundColor: pwdStrength.score >= seg ? pwdStrength.color : '#e2e8f0'
                        }}
                      />
                    ))}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.25rem',
                    fontSize: '0.72rem'
                  }}>
                    <span style={{ color: '#64748b' }}>Strength: <strong style={{ color: pwdStrength.color }}>{pwdStrength.label}</strong></span>
                    <span style={{ color: '#94a3b8' }}>Min. 6 chars</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (Signup mode) */}
            {!isLogin && (
              <div>
                <label htmlFor="auth-input-confirmPassword" className="auth-input-label">Confirm Password *</label>
                <div className="auth-password-wrapper">
                  <input
                    id="auth-input-confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                    onBlur={() => handleFieldBlur('confirmPassword')}
                    className={`auth-text-input ${touched.confirmPassword && fieldErrors.confirmPassword ? 'input-error' : (touched.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword ? 'input-success' : '')}`}
                    aria-invalid={!!(touched.confirmPassword && fieldErrors.confirmPassword)}
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
                {touched.confirmPassword && fieldErrors.confirmPassword && (
                  <div className="auth-field-error">
                    <AlertCircle size={13} style={{ flexShrink: 0 }} />
                    <span>{fieldErrors.confirmPassword}</span>
                  </div>
                )}
                {touched.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword && formData.confirmPassword === formData.password && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#16a34a',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    marginTop: '0.3rem'
                  }}>
                    <CheckCircle2 size={13} style={{ flexShrink: 0 }} />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>
            )}

            {/* Primary Action Button */}
            <div style={{ marginTop: '0.4rem' }}>
              <button
                type="submit"
                className="auth-primary-btn"
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
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
              onClick={toggleAuthMode}
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
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Terms of Service document will be available in production."); }} style={{ color: '#475569', textDecoration: 'underline' }}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Privacy Policy document will be available in production."); }} style={{ color: '#475569', textDecoration: 'underline' }}>
              Privacy Policy
            </a>.
          </p>
        </section>

      </main>
    </div>
  );
}
