/**
 * Get data from cache (localStorage) or fetch from Firestore if stale/missing
 * @param {string} cacheKey - localStorage key
 * @param {Function} firebaseGetter - Async function to fetch from Firestore
 * @param {number} cacheDuration - How long to keep cache in ms (default: 5 minutes)
 * @returns {Promise<any>} Data from cache or Firestore
 */
export async function getCachedData(cacheKey, firebaseGetter, cacheDuration = 5 * 60 * 1000) {
    try {
        // Check if valid cache exists
        const cached = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_ts`);
        const now = Date.now();

        if (cached && cacheTimestamp) {
            try {
                const age = now - parseInt(cacheTimestamp);
                if (!isNaN(age) && age < cacheDuration) {
                    // Cache is still fresh
                    const parsedData = JSON.parse(cached);
                    return parsedData;
                }
            } catch (parseError) {
                console.warn(`Invalid cached data for key ${cacheKey}, clearing cache:`, parseError);
                localStorage.removeItem(cacheKey);
                localStorage.removeItem(`${cacheKey}_ts`);
            }
        }

        // Cache is stale or missing, fetch from Firestore
        const data = await firebaseGetter();
        
        // Update cache
        try {
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(`${cacheKey}_ts`, now.toString());
        } catch (storageError) {
            console.warn(`Could not save cache for key ${cacheKey}:`, storageError);
            // Continue anyway - just can't cache
        }
        
        return data;
    } catch (error) {
        console.error(`Error in getCachedData for key ${cacheKey}:`, error);
        
        // If Firestore fails, try to return stale cache as fallback
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                console.warn(`Returning stale cache for ${cacheKey}`);
                return JSON.parse(cached);
            }
        } catch (fallbackError) {
            console.warn(`Could not parse stale cache for ${cacheKey}:`, fallbackError);
        }
        
        throw error;
    }
}

/**
 * Save data to Firestore and update cache
 * @param {string} cacheKey - localStorage key
 * @param {any} data - Data to save
 * @param {Function} firebaseWriter - Async function to save to Firestore
 * @returns {Promise<any>} Saved data
 */
export async function setCachedData(cacheKey, data, firebaseWriter) {
    try {
        // Save to Firestore (source of truth)
        const result = await firebaseWriter(data);
        
        // Update cache
        try {
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(`${cacheKey}_ts`, Date.now().toString());
        } catch (storageError) {
            console.warn(`Could not save cache for key ${cacheKey}:`, storageError);
            // Continue anyway - just can't cache
        }
        
        return result;
    } catch (error) {
        console.error(`Error in setCachedData for key ${cacheKey}:`, error);
        
        // Still update cache locally so user doesn't lose work
        try {
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(`${cacheKey}_ts`, Date.now().toString());
        } catch (storageError) {
            console.warn(`Could not save cache for key ${cacheKey}:`, storageError);
        }
        
        throw error;
    }
}

/**
 * Clear cache for a specific key
 * @param {string} cacheKey - localStorage key
 */
export function clearCache(cacheKey) {
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(`${cacheKey}_ts`);
}

/**
 * Clear all app caches (useful on logout)
 * @param {string[]} keys - Array of cache keys to clear
 */
export function clearAllCaches(keys) {
    keys.forEach(key => clearCache(key));
}

/**
 * Get cache with custom expiry strategy
 * @param {string} cacheKey - localStorage key
 * @returns {{data: any | null, isStale: boolean, age: number}}
 */
export function inspectCache(cacheKey) {
    const cached = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(`${cacheKey}_ts`);
    const now = Date.now();

    if (!cached || !cacheTimestamp) {
        return { data: null, isStale: true, age: Infinity };
    }

    const age = now - parseInt(cacheTimestamp);
    return {
        data: JSON.parse(cached),
        isStale: age > 5 * 60 * 1000,
        age: age
    };
}
