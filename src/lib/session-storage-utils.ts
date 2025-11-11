export const SessionStorageUtils = {
  setItem: (key: string, value: unknown) => {
    try {
      // If value is a string, store directly
      const serializedValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(
        `Error saving data to sessionStorage: ${JSON.stringify(error)}`
      );
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      const value = sessionStorage.getItem(key);
      if (!value) return null;

      // If expected type is string, return as-is
      if (typeof ('' as T) === 'string') return value as unknown as T;

      return JSON.parse(value) as T;
    } catch (error) {
      console.error(
        `Error reading data from sessionStorage: ${JSON.stringify(error)}`
      );
      return null;
    }
  },

  removeItem: (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(
        `Error removing data from sessionStorage: ${JSON.stringify(error)}`
      );
    }
  },

  clear: () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error(`Error clearing sessionStorage: ${JSON.stringify(error)}`);
    }
  },
};
