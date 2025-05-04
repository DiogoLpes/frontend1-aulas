
export const storage = {
    save: (key, obj) => {
      try {
        localStorage.setItem(key, JSON.stringify(obj));
        return true;
      } catch (error) {
        console.error("Storage save error:", error);
        return false;
      }
    },
    
    load: (key) => {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error("Storage load error:", error);
        return null;
      }
    },
    
    remove: (key) => {
      localStorage.removeItem(key);
    }
  };