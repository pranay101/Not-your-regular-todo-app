const isValidString = (str: unknown): boolean => {
  if (typeof str !== 'string') {
    return false;
  }
  return str.trim().length > 0;
};

export { isValidString };   