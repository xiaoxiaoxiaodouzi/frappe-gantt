
class RequestTools {
  constructor() {
    this.requestCaches = new Map();
    this.requestQueues = new Map();
  }
  isExistsQueueKey(key) {
    return this.requestQueues.has(key);
  }
  addQueue(key, callback) {
    const _callbacks = this.requestQueues.get(key) || [];
    if (callback) {
      _callbacks?.push(callback);
    }
    this.requestQueues.set(key, _callbacks);
  }
  removeQueue(key) {
    this.requestQueues.delete(key);
  }
  callQueue(key, data) {
    const callbacks = this.requestQueues.get(key);
    // console.log(callbacks);

    callbacks.forEach(callback => {
      callback && callback(data);
    });
    this.removeQueue(key);
  }

  isExistsCacheKey(key) {
    return this.requestCaches.has(key);
  }
  setCache(key, value = null, refresh = false) {
    if (refresh || !this.isExistsCacheKey(key)) {
      this.requestCaches.set(key, value);
    }
  }

  getCache(key, defaultValue = null) {
    return this.requestCaches.get(key) || defaultValue;
  }

  generateKey(config) {
    const { url, method, params, data } = config;
    let newParams = {};
    if (method === 'get') {
      newParams = params;
    } else {
      newParams = data;
    }
    const sortedParams = Object.keys(newParams ?? {})
      .sort()
      .reduce((result, key) => {
        // eslint-disable-next-line no-param-reassign
        result[key] = newParams[key];
        return result;
      }, {});

    // eslint-disable-next-line no-param-reassign
    const _url = url + `?${JSON.stringify(sortedParams)}`;
    return `${_url}-data:`;
  }
}

export default new RequestTools();
