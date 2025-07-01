export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `$${amount.toFixed(2)}`;
  }
};

export const parseCurrency = (value: string): number => {
  try {
    // Remove currency symbol and commas
    const cleanValue = value.replace(/[^0-9.-]+/g, '');
    return parseFloat(cleanValue) || 0;
  } catch (error) {
    console.error('Currency parsing error:', error);
    return 0;
  }
};

export const calculateTotal = (items: { price: number; quantity: number }[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const calculateDiscount = (total: number, discountPercentage: number): number => {
  return total * (discountPercentage / 100);
};

export const calculateTax = (total: number, taxRate: number): number => {
  return total * (taxRate / 100);
}; 