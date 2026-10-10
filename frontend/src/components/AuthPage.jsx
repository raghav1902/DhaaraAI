import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { API_BASE } from '../config/apiConfig';
import './Auth/AuthPage.css';
import { getPasswordStrength, validateField } from './Auth/authValidation';
import AuthBrandColumn from './Auth/AuthBrandColumn';
import AuthFormCard from './Auth/AuthFormCard';

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
          token: data.token,
          plan: data.plan || 'plus'
        });
      } else {
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
          token: data.token,
          plan: data.plan || 'plus'
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
      const response = await fetch(`${API_BASE}/api/auth/sync-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'advocate.user@dhaaraai.com'
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
        token: data.token,
        plan: data.plan || 'plus'
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
        <AuthBrandColumn />
        <AuthFormCard
          isLogin={isLogin}
          formData={formData}
          touched={touched}
          fieldErrors={fieldErrors}
          pwdStrength={pwdStrength}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          authError={authError}
          isSubmitting={isSubmitting}
          handleFieldChange={handleFieldChange}
          handleFieldBlur={handleFieldBlur}
          handleSubmit={handleSubmit}
          handleGoogleAuth={handleGoogleAuth}
          toggleAuthMode={toggleAuthMode}
        />
      </main>
    </div>
  );
}
