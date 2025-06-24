/**
 * Format a phone number to (XXX) XXX-XXXX format
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Handle different lengths
  if (cleaned.length === 10) {
    // Format as (XXX) XXX-XXXX
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    // Handle US numbers with country code
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length > 10) {
    // Handle international numbers
    return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }

  // Return as-is if it doesn't match expected patterns
  return phoneNumber;
}

/**
 * Validate if a phone number is in a valid format
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidPhoneNumber(phoneNumber) {
  if (!phoneNumber) return true; // Allow empty phone numbers

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if it's a valid length (10 digits for US, or 11 with country code)
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Clean phone number for storage (remove formatting)
 * @param {string} phoneNumber - The phone number to clean
 * @returns {string} - Cleaned phone number
 */
export function cleanPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/\D/g, '');
}
