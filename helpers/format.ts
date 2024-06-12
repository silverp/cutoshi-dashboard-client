export const moneyFormat = (money?: string | number) => {
  if (money === 0) return '$0';
  if (!money) return '';
  let converted = typeof money === 'string' ? parseFloat(money) : money;
  let formattedMoney = '';

  if (converted < 1) {
    return `$${converted.toFixed(6)}`;
  } else if (converted < 1000) {
    formattedMoney = converted.toFixed(2);
  } else {
    formattedMoney = converted.toFixed(0);
  }
  return `$${new Intl.NumberFormat().format(parseFloat(formattedMoney))}`;
};

export const thousandsFormat = (num?: string | number) => {
  if (num === 0) return '0';
  if (!num) return '';
  let converted = typeof num === 'string' ? parseFloat(num) : num;
  let maximumFractionDigits = 0;
  if (converted < 1) {
    maximumFractionDigits = 6;
  } else if (converted < 1000) {
    maximumFractionDigits = 2;
  }
  const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits });
  return formatter.format(converted);
};
