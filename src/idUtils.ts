import { Customer, User } from './types';

/**
 * Formats a Customer/Shopper ID to the format: #182001, #182002, etc.
 * Uses a consistent sequence based on the registered list or extracts the number automatically.
 */
export function formatCustomerId(id: string, customersList: Customer[]): string {
  if (!id) return '#182001';
  const clean = id.replace('c_', '');
  if (clean.startsWith('18200') && clean.length > 5) {
    return '#' + clean;
  }
  // Try to find the 1-based index in the customer list
  if (customersList && customersList.length > 0) {
    const idx = customersList.findIndex(c => c.id === id);
    if (idx >= 0) {
      return `#18200${idx + 1}`;
    }
  }
  // Fallback to numeric parsing or default
  const numericOnly = clean.replace(/\D/g, '');
  if (numericOnly && numericOnly.length < 6) {
    return `#18200${numericOnly}`;
  }
  return '#182001';
}

/**
 * Formats a Reseller Code to #001, #010, #100, etc.
 * Pads with zeros to maintain at least 3 digits.
 */
export function formatResellerId(user: User, usersList: User[]): string {
  if (!user) return '#001';
  // If already formatted, use it
  if (user.idCode && user.idCode.startsWith('#') && !user.idCode.startsWith('#180')) {
    return user.idCode;
  }
  // Filter all resellers (role is 'user')
  if (usersList && usersList.length > 0) {
    const resellers = usersList.filter(u => u.role === 'user');
    const idx = resellers.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      return `#${String(idx + 1).padStart(3, '0')}`;
    }
  }
  // Extract number from idCode if possible
  const numericOnly = user.idCode ? user.idCode.replace(/\D/g, '') : '';
  if (numericOnly) {
    return `#${String(numericOnly).padStart(3, '0')}`;
  }
  return '#001';
}

/**
 * Formats a Seller Code to #1801, #1802, #1803, etc.
 */
export function formatSellerId(user: User, usersList: User[]): string {
  if (!user) return '#1801';
  if (user.idCode && user.idCode.startsWith('#180')) {
    return user.idCode;
  }
  // Filter all sellers (role is 'seller')
  if (usersList && usersList.length > 0) {
    const sellers = usersList.filter(u => u.role === 'seller');
    const idx = sellers.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      return `#180${idx + 1}`;
    }
  }
  // Extract number from idCode if possible
  const numericOnly = user.idCode ? user.idCode.replace(/\D/g, '') : '';
  if (numericOnly) {
    return `#180${numericOnly}`;
  }
  return '#1801';
}
