/**
 * Validation utilities for form inputs
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 8 characters, at least one uppercase, one number)
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Full name validation
export const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().split(/\s+/).length >= 2;
};

// Phone number validation (basic)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  return phoneRegex;
};

// Budget validation
export const validateBudget = (budget: number, min: number = 100, max: number = 1000000): boolean => {
  return budget >= min && budget <= max && !isNaN(budget);
};

// Date validation
export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Date range validation
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end && validateDate(startDate) && validateDate(endDate);
};

// Required field validation
export const validateRequired = (value: string | undefined | null): boolean => {
  return Boolean(value && value.trim().length > 0);
};

// Login form validation
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(email)) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!validateRequired(password)) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Signup form validation
export const validateSignupForm = (
  email: string,
  password: string,
  confirmPassword: string,
  fullName: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(email)) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!validateRequired(fullName)) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  } else if (!validateFullName(fullName)) {
    errors.push({ field: 'fullName', message: 'Please enter your first and last name' });
  }

  if (!validateRequired(password)) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (!validatePassword(password)) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters with uppercase letter and number',
    });
  }

  if (password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Onboarding form validation
export const validateOnboardingForm = (
  data: Record<string, unknown>
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(data.country as string)) {
    errors.push({ field: 'country', message: 'Country is required' });
  }

  if (!data.vibeTags || (Array.isArray(data.vibeTags) && data.vibeTags.length === 0)) {
    errors.push({ field: 'vibeTags', message: 'Select at least one travel vibe' });
  } else if (Array.isArray(data.vibeTags) && data.vibeTags.length > 6) {
    errors.push({ field: 'vibeTags', message: 'Select maximum 6 travel vibes' });
  }

  if (!data.travelStyle || (Array.isArray(data.travelStyle) && data.travelStyle.length === 0)) {
    errors.push({ field: 'travelStyle', message: 'Select at least one travel style' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Plan form validation
export const validatePlanForm = (
  data: Record<string, unknown>
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(data.destination as string)) {
    errors.push({ field: 'destination', message: 'Destination is required' });
  }

  if (!validateRequired(data.origin as string)) {
    errors.push({ field: 'origin', message: 'Origin is required' });
  }

  if (!validateDate(data.startDate as string)) {
    errors.push({ field: 'startDate', message: 'Start date is required' });
  }

  if (!validateDate(data.endDate as string)) {
    errors.push({ field: 'endDate', message: 'End date is required' });
  }

  if (data.startDate && data.endDate) {
    if (!validateDateRange(data.startDate as string, data.endDate as string)) {
      errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
  }

  if (!validateRequired(data.budgetPerPerson as string)) {
    errors.push({ field: 'budgetPerPerson', message: 'Budget is required' });
  } else if (!validateBudget(parseFloat(data.budgetPerPerson as string))) {
    errors.push({ field: 'budgetPerPerson', message: 'Budget must be between $100 and $1,000,000' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Checkout form validation
export const validateCheckoutForm = (
  data: Record<string, unknown>
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!validateRequired(data.firstName as string)) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!validateRequired(data.lastName as string)) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!validateRequired(data.email as string)) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email as string)) {
    errors.push({ field: 'email', message: 'Please enter a valid email' });
  }

  if (!validateRequired(data.phone as string)) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!validatePhone(data.phone as string)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  if (!validateRequired(data.address as string)) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  if (!validateRequired(data.city as string)) {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (!validateRequired(data.postalCode as string)) {
    errors.push({ field: 'postalCode', message: 'Postal code is required' });
  }

  if (!validateRequired(data.country as string)) {
    errors.push({ field: 'country', message: 'Country is required' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Get error message for a field
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find((e) => e.field === fieldName);
  return error ? error.message : null;
};

// Check if field has error
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some((e) => e.field === fieldName);
};
