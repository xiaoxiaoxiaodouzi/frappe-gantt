/* eslint-disable class-methods-use-this */
/* eslint-disable arrow-parens */
import axios from 'axios';
import { Notification, MessageBox } from 'element-ui';
import AuthService from '@/core/AuthService';
import webConfig from '@/config';
import RequestTools from './request-tools';
import { debounce } from 'lodash';

function setParam(target, key = 'options') {
  let params = target[key];
  if (typeof params === 'undefined') {
    // eslint-disable-next-line no-param-reassign
    params = target[key] = {};
  }
  return params;
}

/**
 * setHostKey
 * @param {*} key
 */
export function setHost(key) {
  // eslint-disable-next-line func-names
  return function(target) {
    const params = setParam(target.prototype);
    params.HostKey = key;
    return target;
  };
}

/**
 * setGlobalShowError
 * @param {*} isShow
 */
export function setShowError(isShow) {
  // eslint-disable-next-line func-names
  return function(target) {
    const params = setParam(target.prototype);
    params.isShowError = isShow;
    return target;
  };
}

export const ERROR_CODE = 500;

var LogOut = debounce(() => {
  AuthService.logout();
}, 1000);

class RequestService {
  /**
   * RequestService 默认配置，
   */
  defaultOptions = {
    isShowError: true, // 是否拦截器提示错误信息
    isSendToken: true // 是否请求头部带Token
  };

  methodConfig = {};

  constructor() {
    // this.options = { isShowError: true };
    // create an axios instance
    this.apiService = axios.create({
      timeout: 30000 // 30 s
    });
    this.setInterceptor();
  }

  /**
   * getOptions
   */
  getOptions() {
    const serviceOptions = setParam(this);
    // const data = setParam(serviceOptions);
    // console.log(data);
    return { ...this.defaultOptions, ...serviceOptions };
  }

  // checkMethodIsCache(
  //   config = { url: '', method: 'get', params: {}, data: {}, isCache: false }
  //   // callApi
  // ) {
  //   // 缓存处理
  //   const { isCache } = config;
  //   if (isCache) {
  //     // 需要缓存
  //     const cacheKey = RequestTools.generateKey(config);

  //     const cacheData = RequestTools.getCache(cacheKey);
  //     return cacheData;
  //   }
  //   return null;
  // }

  handleCacheRequest(_config, _requestFunc) {
    const cacheKey = RequestTools.generateKey(_config);

    if (!_config?.shouldRefreshCache) {
      const cacheData = RequestTools.getCache(cacheKey);
      if (cacheData) {
        return Promise.resolve(cacheData);
      }
    }

    return new Promise(resolve => {
      if (RequestTools.isExistsQueueKey(cacheKey)) {
        RequestTools.addQueue(cacheKey, resolve);
      } else {
        RequestTools.addQueue(cacheKey, resolve);
        return _requestFunc(_config.url, _config._origin).then(res => {
          RequestTools.callQueue(cacheKey, res);
        });
      }
    });
  }

  /**
   * interceptors
   */
  setInterceptor() {
    // request interceptors
    this.apiService.interceptors.request.use(
      async config => {
        const serviceOptions = this.getOptions();
        if (webConfig.evn !== 'yapi' && serviceOptions.isSendToken) {
          const { access_token: accessToken, token_type: tokenType } =
            (await AuthService.getUser()) || {};
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${tokenType} ${accessToken}`;
        }
        // const cacheKey = RequestTools.generateKey(config);
        // if (!RequestTools.isExistsQueueKey(cacheKey)) {
        //   RequestTools.addQueue(cacheKey);
        // }
        return config;
      },
      error => {
        console.log('request error====================================', error); // for debugger
        Promise.reject(error);
      }
    );

    // response interceptors
    this.apiService.interceptors.response.use(
      res => {
        const resData = res.data;
        const { url, method } = res.config;
        const methodConfig = this.methodConfig[url];
        // cache process
        if (method === 'get' && methodConfig?.isCache) {
          const cacheKey = RequestTools.generateKey(res.config);
          RequestTools.setCache(
            cacheKey,
            resData,
            methodConfig?.shouldRefreshCache
          );
        }
        let errorMsg = '';
        if (resData.errors && resData.errors.length > 0) {
          errorMsg = resData.errors.map(item => item.message);
          Notification.error({ title: `Tips:`, message: errorMsg });
          return Promise.reject(res);
          // eslint-disable-next-line no-throw-literal
          // throw '';
        }
        if (
          ['application/octet-stream', 'application/pdf'].includes(
            res?.headers['content-type']
          )
        ) {
          resData.headers = { ...res.headers };
        }
        return resData;
      },
      ({ response, message }) => {
        if (!response && message) {
          // Notification.info({ title: `Tips:`, message: `The Request has been cancelled` });
          return Promise.reject();
        }
        if (!response) {
          Notification.error({ title: `Tips:`, message: `Network Error` });
          return Promise.reject();
        }
        if (response.status === 401) {
          return new Promise((resolve, reject) => {
            MessageBox({
              title: 'Tips',
              message: '[UnAuthenticate] - Whether to log in again? ',
              showCancelButton: true,
              confirmButtonText: 'confirm',
              cancelButtonText: 'cancel'
            }).then(() => {
              LogOut();
              reject(null);
            });
          });
        }
        const serviceOptions = this.getOptions();
        const { url } = response.config;
        const methodConfig = this.methodConfig[url];
        let isShowMethodError = true;
        if (methodConfig) {
          isShowMethodError = methodConfig.isShowError !== false;
        }
        const { data } = response;
        if (response.status === 400 && response.data.code === 131027) {
          console.log(`error code = 131027`);
          data.message = 'Submitted failed as there is a bid that is pending approval.';
        }
        let errorMsg = null;
        if (data?.errors?.length > 0 && Array.isArray(data.errors)) {
          errorMsg = data.errors.map(item => item.message);
        }
        if (serviceOptions.isShowError && isShowMethodError) {
          Notification.error({
            title: `Tips`,
            message: `${data.message ||
              data.msg ||
              data.error ||
              errorMsg ||
              response.statusText ||
              data}`
          });
        }
        return Promise.reject(response);
      }
    );
  }

  /**
   * 处理URL
   * @param {*} url
   * @param {*} config
   */
  handlerUrl(url, config) {
    let newUrl = url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      const serviceOptions = this.getOptions();
      const hostKey = serviceOptions.HostKey;
      if (!hostKey) {
        throw new Error('please set service hostKey');
      }
      const urlKey = this.options.urlKey || 'url';
      const baseUrl = webConfig[hostKey][urlKey];
      newUrl = `${baseUrl}${url}`;
    }

    this.methodConfig[newUrl] = config;
    return newUrl;
  }

  request(config) {
    // eslint-disable-next-line no-param-reassign
    config.url = this.handlerUrl(config.url, config);

    return this.apiService.request(config);
  }

  /**
   * 处理GET
   * @param {*} url URL
   * @param {*} config 配置
   */
  get(url, data, config) {
    config = config || {};
    config.params = data;
    const _config = {
      _origin: config,
      method: 'get',
      url: this.handlerUrl(url, config),
      params: data,
      data,
      isCache: config?.isCache || false,
      signal: config?.signal,
      shouldRefreshCache: config?.shouldRefreshCache || false
    };
    // const cacheData = this.checkMethodIsCache(_config);
    const requestFunc = this.apiService.get;
    if (config?.isCache) {
      return this.handleCacheRequest(_config, requestFunc);
    }
    return requestFunc(_config.url, config);
  }

  /**
   * 处理POST
   * @param {*} url URL
   * @param {*} data 参数
   * @param {*} config 配置
   */
  post(url, data, config) {
    return this.apiService.post(this.handlerUrl(url, config), data, config);
  }

  /**
   * delete
   * @param {*} url
   * @param {*} config
   */
  delete(url, config) {
    return this.apiService.delete(this.handlerUrl(url, config), config);
  }

  /**
   * head
   * @param {*} url
   * @param {*} config
   */
  head(url, config) {
    return this.apiService.head(this.handlerUrl(url, config), config);
  }

  /**
   * put
   * @param {*} url
   * @param {*} data
   * @param {*} config
   */
  put(url, data, config) {
    return this.apiService.put(this.handlerUrl(url, config), data, config);
  }

  /**
   * patch
   * @param {*} url
   * @param {*} data
   * @param {*} config
   */
  patch(url, data, config) {
    return this.apiService.patch(this.handlerUrl(url, config), data, config);
  }
}
export default RequestService;
