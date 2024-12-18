export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const logError = (e: unknown, message: string = '') => {
  if (e instanceof Error) {
    console.error(`❌ ${message}`, e.message);
  } else {
    console.error(`❌ ${message}`, e);
  }
};