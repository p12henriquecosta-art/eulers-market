/**
 * Local-First Persistence Utility
 * Safeguards user data using LocalStorage for maximum privacy.
 */

export const Persistence = {
  save: (key: string, data: any) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (e) {
      console.error('Error saving to persistence:', e);
    }
  },

  load: (key: string) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading from persistence:', e);
      return null;
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  }
};
