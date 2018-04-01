const request = require('request-promise');

export class Utils {
  matchUrl(str) {
    console.log(str);
    if (!str) return false;
    let urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    let url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
  }

  checkLatency(URI) {
    return new Promise((resolve, reject) => {
      let timeNow = Date.now();
      request.get(URI)
             .then((...args) => {
               resolve(Date.now() - timeNow);
             })
             .catch(e => {reject(e)});
    });
  }

  checkUsername(str) {
    return new Promise((resolve, reject) => {
      if (!str) {
        return reject(false)
      }
      if (this.validatePhonenumber(str)) {
        return resolve('phone');
      } else {
        return (this.validateEmail(str)) ? resolve('email') : reject(false);
      }
    });
  }

  validatePhonenumber(str) {
    let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return re.test(str);
  }

  sanitizePhone(phone) {
    return phone.replace(/\D/ig, '')
  }

  validateEmail(str) {
    if (!str) return false;
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(str);
  }
}
