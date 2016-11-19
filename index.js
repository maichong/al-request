/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-11-19
 * @author Liang <liang@maichong.it>
 */

import wx from 'labrador';
import qs from 'qs';

/**
 * 默认获取SessionID方法
 * @returns {string}
 */
function defaultGetSession() {
  return wx.app.sessionId;
}

/**
 * 默认设置SessionID方法
 * @param {string} sessionId
 */
function defaultSetSession(sessionId) {
  wx.app.sessionId = sessionId;
}

// 有效HTTP方法列表
const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT'];

/**
 * 创建API Request客户端
 * @param {Object} options 选项
 * @returns {Function}
 */
function create(options) {
  options = options || {};

  /**
   * 通用Alaska RESTFUL风格API请求,如果alaska接口返回错误,则抛出异常
   * @param {string} [method] 请求方法,可选默认GET,有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
   * @param {string} apiName  API名称,必选
   * @param {object} [data]   数据,可选,如果方法为GET或DELETE,则此对象中的所有数据将传入URL query
   * @param {object} [header] HTTP头对象,可选
   * @returns {*}
   */
  async function request(method, apiName, data, header) {
    const apiRoot = options.apiRoot || {};
    const updateKey = options.updateKey || '_session';
    const headerKey = options.headerKey || 'Session';
    const getSession = options.getSession || defaultGetSession;
    const setSession = options.setSession || defaultSetSession;

    if (methods.indexOf(method) === -1) {
      header = data;
      data = apiName;
      apiName = method;
      method = 'GET';
    }

    let url = apiRoot + apiName;

    if (['GET', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'].indexOf(method) > -1 && data) {
      let querystring = qs.stringify(data);
      if (url.indexOf('?') > -1) {
        url += '&' + querystring;
      } else {
        url += '?' + querystring;
      }
      data = undefined;
    }

    header = header || {};

    let sessionId = getSession();
    if (sessionId) {
      header[headerKey] = sessionId;
    }

    let res = await wx.request({
      method,
      url,
      data,
      header
    });

    if (res.data && res.data[updateKey]) {
      setSession(res.data[updateKey]);
    }

    if (res.data && res.data.error) {
      throw new Error(res.data.error);
    }

    return res.data;
  }

  methods.forEach((method) => {
    request[method.toLowerCase()] = function (...args) {
      return request(method, ...args);
    };
  });

  request.setOptions = function (newOptions) {
    options = newOptions || {};
  };
}

/**
 * 导出默认API客户端
 */
export default create({
  apiRoot: typeof API_ROOT === 'undefined' ? '' : API_ROOT
});
