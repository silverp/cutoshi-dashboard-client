export const getColorStatus = (status?: string) => {
  if (!status) return '';
  if (['expired', 'invalid_currency', 'failed'].includes(status)) {
    return '#f6465d';
  }
  if (['refunded'].includes(status)) {
    return '#758696';
  }
  if (['waiting', 'partially_paid'].includes(status)) {
    return '#f7931a';
  }
  return '#51b383';
};
