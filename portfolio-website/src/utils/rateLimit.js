/**
 * rateLimit.js 
 * ===========
 * 
 * Rate limiting utility for API endpoints.
 * Uses in-memory storage to track request frequency by IP address.
 * 
 * Features:
 * - Configurable time window and request limits
 * - Automatic cache cleanup
 * - IP-based tracking
 * 
 * Note: For production, consider using Redis or a database instead
 * of in-memory storage for better scalability and persistence.
 */

/**
 * Configuration for rate limiting
 */
const RATE_LIMIT_CONFIG = {
  INTERVAL: 3600000,  // 1 hour in milliseconds
  MAX_REQUESTS: 3,    // Maximum requests per interval
  CLEANUP_PROBABILITY: 0.1  // 10% chance of cleanup per request
};

const rateLimit = {
  // In-memory storage for IP tracking
  tokenCache: new Map(),

  /**
   * Checks if a request from an IP should be rate limited
   * @param {string} ip - IP address of the requester
   * @returns {boolean} true if request should be blocked
   */
  isRateLimited(ip) {
    const now = Date.now();
    const timestamps = this.tokenCache.get(ip) || [];

    // Filter valid timestamps within current interval
    const validTimestamps = this._getValidTimestamps(timestamps, now);

    // Check against rate limit
    if (validTimestamps.length >= RATE_LIMIT_CONFIG.MAX_REQUESTS) {
      return true;
    }

    // Update IP records
    this._updateIpRecord(ip, validTimestamps, now);

    // Periodic cleanup
    this._attemptCleanup();

    return false;
  },

  /**
   * Filters timestamps within the current interval
   * @param {number[]} timestamps - Array of timestamp records
   * @param {number} now - Current timestamp
   * @returns {number[]} Valid timestamps
   */
  _getValidTimestamps(timestamps, now) {
    return timestamps.filter(timestamp => 
      now - timestamp < RATE_LIMIT_CONFIG.INTERVAL
    );
  },

  /**
   * Updates the record for an IP address
   * @param {string} ip - IP address to update
   * @param {number[]} validTimestamps - Current valid timestamps
   * @param {number} now - Current timestamp
   */
  _updateIpRecord(ip, validTimestamps, now) {
    validTimestamps.push(now);
    this.tokenCache.set(ip, validTimestamps);
  },

  /**
   * Attempts cleanup based on probability
   */
  _attemptCleanup() {
    if (Math.random() < RATE_LIMIT_CONFIG.CLEANUP_PROBABILITY) {
      this._cleanup();
    }
  },

  /**
   * Removes expired entries from the cache
   */
  _cleanup() {
    const now = Date.now();

    for (const [ip, timestamps] of this.tokenCache.entries()) {
      const validTimestamps = this._getValidTimestamps(timestamps, now);

      if (validTimestamps.length === 0) {
        this.tokenCache.delete(ip);
      } else {
        this.tokenCache.set(ip, validTimestamps);
      }
    }
  }
};

export default rateLimit;

/**
 * Note on Method Naming Convention:
 * ===============================
 * Methods prefixed with underscore (_) indicate "private" methods intended
 * for internal use only. While JavaScript doesn't enforce true privacy for
 * these methods, the underscore is a convention that signals to other
 * developers:
 * 
 * 1. These are internal implementation details
 * 2. They shouldn't be called from outside the object
 * 3. They may change without warning as they're internal utilities
 * 
 * Example:
 * - isRateLimited() - Public method, stable API
 * - _cleanup() - Private method, internal implementation
 */