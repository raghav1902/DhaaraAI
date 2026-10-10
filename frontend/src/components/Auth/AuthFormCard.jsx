import React from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthFormCard({
  isLogin,
  formData,
  touched,
  fieldErrors,
  pwdStrength,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  authError,
  isSubmitting,
  handleFieldChange,
  handleFieldBlur,
  handleSubmit,
  handleGoogleAuth,
  toggleAuthMode
}) {
  return (
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
  );
}
