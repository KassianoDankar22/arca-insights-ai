
// Format value as US currency
export const formatCurrency = (value: string): string => {
  // Remove any existing formatting
  const numericValue = value.replace(/[^0-9.]/g, '');
  
  if (!numericValue) return '';
  
  // Parse to number and format
  const number = parseFloat(numericValue);
  
  if (isNaN(number)) return '';
  
  // Format the number with thousands separators
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Return with dollar sign
  return '$' + parts.join('.');
};
