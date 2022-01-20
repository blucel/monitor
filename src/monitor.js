import { JsError } from './error';

class MonitorJS {
  constructor() {
    this.jsError = true; // 默认true
    this.promiseError = true; // 默认true
    this.resourceError = true; // 默认true
    this.ajaxError = true; // 默认true
    this.consoleError = false; //console.error默认不处理
    this.vueError = false;
  }

  /**
     * 处理异常信息初始化
     * @param {*} options 
     */
  init (options) {
    options = options || {};
    this.jsError = !(options.jsError === false);
    this.promiseError = !(options.promiseError === false);
    this.resourceError = !(options.resourceError === false);
    this.ajaxError = !(options.ajaxError === false);
    this.consoleError = options.consoleError === true;  //显式配置
    this.vueError = options.vueError === true;  //显式配置
    let reportUrl = options.url;//上报错误地址
    let extendsInfo = options.extendsInfo || {};  //扩展信息（一般用于系统个性化分析）
    let param = { reportUrl, extendsInfo };
    if (this.jsError) {
      new JsError(param).handleError();
    }
  }
}

export default MonitorJS


// (function (w, d, s, q, i) {
//   w[q] = w[q] || [];
//   var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
//   j.async = true;
//   j.id = 'beacon-aplus';
//   j.src = 'https://d.alicdn.com/alilog/mlog/aplus/' + i + '.js';
//   f.parentNode.insertBefore(j, f);
// })(window, document, 'script', 'aplus_queue', '203467608');
/**
 * MonitorJS.init({appid:123})
 * appid: 区分哪个产品
 */

