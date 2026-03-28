// src/utils/storage.js

/**
 * LocalStorage management and data persistence for Fittrackr.
 */

class StorageManager {
    static setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getItem(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    static removeItem(key) {
        localStorage.removeItem(key);
    }

    static clear() {
        localStorage.clear();
    }
}

export default StorageManager;
