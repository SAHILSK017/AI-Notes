const crypto = require('crypto');

const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 minutes
const MAX_SIZE = 200;

function getCacheKey(content, action) {
  const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
  return `${action}:${hash}`;
}

function get(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function set(key, data) {
  if (cache.size >= MAX_SIZE) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

module.exports = { getCacheKey, get, set };
