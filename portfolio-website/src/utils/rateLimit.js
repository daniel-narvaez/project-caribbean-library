const rateLimit = {
  // Store IP addresses and their timestamps
  // In production, consider using Redis or a database
  tokenCache: new Map(),

  // Configuration
  interval: 3600000, // 1 hour in milliseconds
  maxRequests: 20,    // Maximum requests per interval

  /**
   * Check if the request should be rate limited
   * @param {string} ip - IP address of the requester
   * @returns {boolean} - true if request should be blocked
   */
  isRateLimited(ip) {
    const now = Date.now();
    const timestamps = this.tokenCache.get(ip) || [];
    
    // Remove timestamps outside current interval
    const validTimestamps = timestamps.filter(
      timestamp => now - timestamp < this.interval
    );

    // Check if number of requests exceeds limit
    if (validTimestamps.length >= this.maxRequests) {
      return true;
    }

    // Update timestamps for IP
    validTimestamps.push(now);
    this.tokenCache.set(ip, validTimestamps);

    // Cleanup old entries periodically
    if (Math.random() < 0.1) { // 10% chance to cleanup on each request
      this.cleanup();
    }

    return false;
  },

  /**
   * Remove expired entries from cache
   */
  cleanup() {
    const now = Date.now();
    for (const [ip, timestamps] of this.tokenCache.entries()) {
      const validTimestamps = timestamps.filter(
        timestamp => now - timestamp < this.interval
      );
      if (validTimestamps.length === 0) {
        this.tokenCache.delete(ip);
      } else {
        this.tokenCache.set(ip, validTimestamps);
      }
    }
  }
};

export default rateLimit;