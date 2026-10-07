/**
 * General Frontend Utilities
 */

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  try {
    const isInteger = amount % 1 === 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: isInteger ? 0 : 2,
      maximumFractionDigits: isInteger ? 0 : 2,
    }).format(amount);
  } catch {
    const isInteger = amount % 1 === 0;
    return `${currency} ${isInteger ? amount.toLocaleString() : amount.toFixed(2)}`;
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
