/**
 * Utility function to debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Validation rules for todo fields
 */
export const validationRules = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^(?!\s*$).+/, // Not just whitespace
    messages: {
      required: 'Title is required',
      minLength: 'Title must be at least 1 character',
      maxLength: 'Title must be 100 characters or less',
      pattern: 'Title cannot be empty or just spaces',
    },
  },
  description: {
    required: false,
    maxLength: 500,
    messages: {
      maxLength: 'Description must be 500 characters or less',
    },
  },
};

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field
 * @param {string} value - Value to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (fieldName, value) => {
  const rules = validationRules[fieldName];
  if (!rules) return null;

  // Required check
  if (rules.required && (!value || !value.trim())) {
    return rules.messages.required;
  }

  // Skip other validations if not required and empty
  if (!rules.required && !value) {
    return null;
  }

  // Pattern check
  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.messages.pattern;
  }

  // Min length check
  if (rules.minLength && value.length < rules.minLength) {
    return rules.messages.minLength;
  }

  // Max length check
  if (rules.maxLength && value.length > rules.maxLength) {
    return rules.messages.maxLength;
  }

  return null;
};

/**
 * Validate all form fields
 * @param {Object} formData - Form data object
 * @returns {Object} Errors object
 */
export const validateForm = (formData) => {
  const errors = {};
  
  Object.keys(formData).forEach((fieldName) => {
    const error = validateField(fieldName, formData[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Format error message from API response
 * @param {Error} error - Error object from API call
 * @returns {string} Formatted error message
 */
export const formatApiError = (error) => {
  if (!error.response) {
    // Network error or server not responding
    return 'Unable to connect to server. Please check your internet connection and ensure the server is running.';
  }

  const status = error.response.status;
  const data = error.response.data;

  switch (status) {
    case 400:
      return data.message || 'Invalid request. Please check your input.';
    case 404:
      return 'Resource not found. It may have been deleted.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return data.message || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Sanitize user input
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove leading/trailing whitespace
  let sanitized = input.trim();
  
  // Replace multiple spaces with single space
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  return sanitized;
};
