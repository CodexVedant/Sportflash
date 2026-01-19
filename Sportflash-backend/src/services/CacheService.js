const NodeCache = require('node-cache');

/**
 * CacheService - Centralized caching layer for API responses
 * Uses in-memory caching via node-cache
 */
class CacheService {
    constructor() {
        // Initialize cache with configuration from environment or defaults
        this.cache = new NodeCache({
            stdTTL: parseInt(process.env.CACHE_TTL_DEFAULT) || 3600, // Default 1 hour
            checkperiod: parseInt(process.env.CACHE_CHECK_PERIOD) || 600, // Check every 10 minutes
            useClones: false // Better performance, but be careful with object mutations
        });

        this.enabled = process.env.CACHE_ENABLED !== 'false'; // Enabled by default

        // Statistics tracking
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0
        };

        console.log(`[CacheService] Initialized - Enabled: ${this.enabled}`);
    }

    /**
     * Generate a cache key from components
     * @param {string} prefix - Key prefix (e.g., 'upcoming', 'standings')
     * @param {object} params - Parameters to include in key
     * @returns {string} Cache key
     */
    generateKey(prefix, params = {}) {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}:${params[key]}`)
            .join(':');

        return sortedParams ? `${prefix}:${sortedParams}` : prefix;
    }

    /**
     * Get value from cache
     * @param {string} key - Cache key
     * @returns {any|null} Cached value or null if not found
     */
    get(key) {
        if (!this.enabled) {
            return null;
        }

        const value = this.cache.get(key);

        if (value !== undefined) {
            this.stats.hits++;
            console.log(`[Cache HIT] ${key}`);
            return value;
        }

        this.stats.misses++;
        console.log(`[Cache MISS] ${key}`);
        return null;
    }

    /**
     * Set value in cache
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttl - Optional TTL in seconds (overrides default)
     * @returns {boolean} Success status
     */
    set(key, value, ttl = null) {
        if (!this.enabled) {
            return false;
        }

        try {
            const success = ttl
                ? this.cache.set(key, value, ttl)
                : this.cache.set(key, value);

            if (success) {
                this.stats.sets++;
                console.log(`[Cache SET] ${key} (TTL: ${ttl || 'default'}s)`);
            }

            return success;
        } catch (error) {
            console.error(`[Cache ERROR] Failed to set ${key}:`, error.message);
            return false;
        }
    }

    /**
     * Delete a specific key from cache
     * @param {string} key - Cache key to delete
     * @returns {number} Number of deleted entries
     */
    del(key) {
        if (!this.enabled) {
            return 0;
        }

        const deleted = this.cache.del(key);
        console.log(`[Cache DEL] ${key} (deleted: ${deleted})`);
        return deleted;
    }

    /**
     * Delete multiple keys matching a pattern
     * @param {string} pattern - Pattern to match (e.g., 'upcoming:*')
     * @returns {number} Number of deleted entries
     */
    delPattern(pattern) {
        if (!this.enabled) {
            return 0;
        }

        const keys = this.cache.keys();
        const regex = new RegExp(pattern.replace('*', '.*'));
        const matchingKeys = keys.filter(key => regex.test(key));

        if (matchingKeys.length > 0) {
            const deleted = this.cache.del(matchingKeys);
            console.log(`[Cache DEL Pattern] ${pattern} (deleted: ${deleted} keys)`);
            return deleted;
        }

        return 0;
    }

    /**
     * Flush all cache entries
     */
    flush() {
        if (!this.enabled) {
            return;
        }

        this.cache.flushAll();
        console.log('[Cache FLUSH] All entries cleared');
    }

    /**
     * Get cache statistics
     * @returns {object} Statistics object
     */
    getStats() {
        const hitRate = this.stats.hits + this.stats.misses > 0
            ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
            : 0;

        return {
            enabled: this.enabled,
            hits: this.stats.hits,
            misses: this.stats.misses,
            sets: this.stats.sets,
            hitRate: `${hitRate}%`,
            keys: this.cache.keys().length,
            size: this.cache.getStats()
        };
    }

    /**
     * Check if cache is enabled
     * @returns {boolean}
     */
    isEnabled() {
        return this.enabled;
    }
}

// Export singleton instance
module.exports = new CacheService();
