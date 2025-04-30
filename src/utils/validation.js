/**
 * Email validation - checks if email format is valid
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation - checks if password meets requirements
 * Minimum 6 characters, must contain letters and numbers
 * @param {string} password - Password to validate
 * @returns {boolean} Whether the password is valid
 */
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};

/**
 * Required field validation - checks if value is not empty
 * @param {string} value - Value to check
 * @returns {boolean} Whether the value is not empty
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.trim() !== "";
};

/**
 * Number validation - checks if value is a valid positive number
 * @param {any} value - Value to check
 * @param {number} min - Minimum allowed value (defaults to 0)
 * @returns {boolean} Whether the value is a valid number above min
 */
export const isValidNumber = (value, min = 0) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min;
};

/**
 * URL validation - checks if string is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether the URL is valid
 */
export const isValidUrl = (url) => {
  if (!url) return true; // Allow empty URLs (optional fields)
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Match validation - checks if two values match (e.g., for password confirmation)
 * @param {string} value1 - First value
 * @param {string} value2 - Second value to compare
 * @returns {boolean} Whether the values match
 */
export const doValuesMatch = (value1, value2) => {
  return value1 === value2;
};

/**
 * Length validation - checks if string is within length limits
 * @param {string} value - String to check
 * @param {object} options - Min and max length options
 * @returns {boolean} Whether the string length is valid
 */
export const isValidLength = (value, { min = 0, max = Infinity } = {}) => {
  return value.length >= min && value.length <= max;
};

/**
 * Validate form data with provided validation rules
 * @param {object} data - Form data object
 * @param {object} rules - Validation rules object where keys match data keys
 * @returns {object} Object with errors for each invalid field
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const fieldRules = rules[field];

    // Required field validation
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = fieldRules.requiredMessage || `${field} is required`;
      return; // Skip other validations if field is empty and required
    }

    // Only validate non-empty fields if field is optional
    if (value) {
      // Email validation
      if (fieldRules.isEmail && !isValidEmail(value)) {
        errors[field] = fieldRules.emailMessage || "Invalid email format";
      }

      // Password validation
      if (fieldRules.isPassword && !isValidPassword(value)) {
        errors[field] =
          fieldRules.passwordMessage ||
          "Password must be at least 6 characters with letters and numbers";
      }

      // Number validation
      if (fieldRules.isNumber && !isValidNumber(value, fieldRules.min)) {
        errors[field] =
          fieldRules.numberMessage ||
          `Must be a number ${
            fieldRules.min ? `at least ${fieldRules.min}` : ""
          }`;
      }

      // URL validation
      if (fieldRules.isUrl && !isValidUrl(value)) {
        errors[field] = fieldRules.urlMessage || "Invalid URL format";
      }

      // Match validation
      if (fieldRules.match && !doValuesMatch(value, data[fieldRules.match])) {
        errors[field] =
          fieldRules.matchMessage || `Does not match ${fieldRules.match}`;
      }

      // Length validation
      if (fieldRules.length && !isValidLength(value, fieldRules.length)) {
        const { min, max } = fieldRules.length;
        errors[field] =
          fieldRules.lengthMessage ||
          `Should be ${
            min && max
              ? `between ${min} and ${max}`
              : min
              ? `at least ${min}`
              : `no more than ${max}`
          } characters`;
      }

      // Custom validation
      if (fieldRules.custom && typeof fieldRules.custom === "function") {
        const customError = fieldRules.custom(value, data);
        if (customError) {
          errors[field] = customError;
        }
      }
    }
  });

  return errors;
};

/**
 * Check if form has any errors
 * @param {object} errors - Errors object from validateForm
 * @returns {boolean} Whether there are any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Example rule sets for common forms
 */
export const validationRules = {
  login: {
    email: {
      required: true,
      isEmail: true,
      requiredMessage: "Please enter your email",
      emailMessage: "Please enter a valid email address",
    },
    password: {
      required: true,
      requiredMessage: "Please enter your password",
    },
  },

  register: {
    name: {
      required: true,
      requiredMessage: "Please enter your name",
    },
    email: {
      required: true,
      isEmail: true,
      requiredMessage: "Please enter your email",
      emailMessage: "Please enter a valid email address",
    },
    password: {
      required: true,
      isPassword: true,
      requiredMessage: "Please create a password",
      passwordMessage:
        "Password must be at least 6 characters with at least one letter and one number",
    },
    confirmPassword: {
      required: true,
      match: "password",
      requiredMessage: "Please confirm your password",
      matchMessage: "Passwords do not match",
    },
  },

  item: {
    name: {
      required: true,
      requiredMessage: "Item name is required",
    },
    price: {
      required: true,
      isNumber: true,
      min: 0.01,
      requiredMessage: "Price is required",
      numberMessage: "Price must be a positive number",
    },
    storeId: {
      required: true,
      requiredMessage: "Please select a store",
    },
    imageUrl: {
      isUrl: true,
      urlMessage: "Please enter a valid image URL or leave empty",
    },
  },

  store: {
    name: {
      required: true,
      requiredMessage: "Store name is required",
    },
    address: {
      required: true,
      requiredMessage: "Store address is required",
    },
  },
};