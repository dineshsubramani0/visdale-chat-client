export const LocalStorageUtils = {
  setItem: (key: string, value: unknown) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(
        `Error saving data to localStorage: ${JSON.stringify(error)}`
      );
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      console.error(
        `Error reading data from localStorage: ${JSON.stringify(error)}`
      );
      return null;
    }
  },

  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(
        `Error removing data from localStorage: ${JSON.stringify(error)}`
      );
    }
  },
};
