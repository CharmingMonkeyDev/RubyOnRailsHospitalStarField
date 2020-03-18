export function truncateString(str, maxLength) {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.substring(0, maxLength) + "...";
  }
}

export const capitalize = (text: string) => {
  return (text && text[0].toUpperCase() + text.slice(1)) || "";
};

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

export const toClass = (text: string) => {
  return text.toLowerCase().replace(/\s+/g, '-');
};
