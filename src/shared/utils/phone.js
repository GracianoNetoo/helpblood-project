export const normalizeAngolaPhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('244') && digits.length === 12) {
    return digits.slice(3);
  }
  return digits;
};

export const isValidAngolaPhone = (value) => {
  const normalized = normalizeAngolaPhone(value);
  if (!normalized) return false;
  return /^9[1-59]\d{7}$/.test(normalized);
};
