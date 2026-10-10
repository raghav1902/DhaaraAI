export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const getPasswordStrength = (pwd) => {
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

export const validateField = (name, value, allValues, loginMode) => {
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
