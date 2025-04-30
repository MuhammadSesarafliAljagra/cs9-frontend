/**
 * Format a number as currency (USD)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "USD") => {
  if (amount === null || amount === undefined) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "-";
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(
    new Date(date)
  );
};

/**
 * Format a timestamp to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return "-";

  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;

  // Convert to seconds
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`;

  // Convert to minutes
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;

  // Convert to hours
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;

  // Convert to days
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;

  // Use standard date format for older dates
  return formatDate(date);
};

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @param {string} suffix - Suffix to add after truncated text
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = "...") => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Format stock status into a user-friendly string
 * @param {number} stock - The stock quantity
 * @returns {string} Formatted stock status
 */
export const formatStockStatus = (stock) => {
  if (stock === null || stock === undefined) return "Unknown";
  if (stock <= 0) return "Out of Stock";
  if (stock < 5) return "Low Stock";
  if (stock < 20) return "In Stock";
  return "Well Stocked";
};

/**
 * Format a transaction status to a user-friendly status
 * @param {string} status - The transaction status
 * @returns {string} User-friendly status text
 */
export const formatTransactionStatus = (status) => {
  const statusMap = {
    pending: "Pending",
    paid: "Paid",
    cancelled: "Cancelled",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
  };

  return statusMap[status?.toLowerCase()] || status || "Unknown";
};

/**
 * Format item or store name for URL (slug)
 * @param {string} name - The name to format
 * @returns {string} URL-friendly string
 */
export const formatSlug = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single one
};