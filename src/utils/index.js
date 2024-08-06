export const pictureExt = ['gif', 'png', 'jpeg', 'jpg'];
export const videoExt = ['mp4', 'webm', 'ogg'];
export const officeExt = ['doc', 'xls', 'ppt', 'docx', 'xlss', 'pptx'];
export const pdfExt = ['pdf'];
export const codeExt = ['js', 'php', 'jave', 'c#'];

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf('?') + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

export async function copyText(text) {
  if (window.clipboardData) {
    window.clipboardData.setData('text/plain', text)
  } else {
    await navigator.clipboard.writeText(text)
  }
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}
/**
 * string to bool
 * strToBool("False")==false  strToBool("false")==false  strToBool("0")=false
 * strToBool("True")==true  strToBool("true")==true  strToBool("1")=true
 * @param {*} value
 */
export const strToBool = (value) => {
  if (['null', null, undefined, 'undefined'].includes(value)) {
    return null;
  }
  const regex = /^\s*(true|1|on|yes)\s*$/i;
  return regex.test(value);
};

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + '';
  const randomNum = parseInt((1 + Math.random()) * 65536) + '';
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * get first letter by string
 * @param {*} str
 * @returns  ab cd => AC
 */
export const getFirstLetteByStr = str => {
  if (!str || str.trim() === '') {
    return str;
  }
  const matches = str.match(/\b(\w)/g);
  return matches.join('').toLocaleUpperCase();
};

export const getFileTypeIcon = type => {
  const value = (type && type.toLocaleLowerCase()) || null;

  if (pictureExt.includes(value)) {
    return 'iconfont icon-Picture';
  }
  if (videoExt.includes(value)) {
    return 'iconfont icon-film';
  }
  if (officeExt.includes(value)) {
    if (['xls', 'xlss'].includes(value)) {
      return 'iconfont icon-Excel';
    }
    if (['doc', 'docs'].includes(value)) {
      return 'iconfont icon-Word';
    }
    if (['ppt', 'pptx'].includes(value)) {
      return 'iconfont icon-powerpoint';
    }
    return 'iconfont icon-file';
  }
  if (pdfExt.includes(value)) {
    return 'iconfont icon-file-pdf';
  }
  if (codeExt.includes(value)) {
    return 'iconfont icon-codes';
  }
  return 'iconfont icon-file';
};

/**
 * check the object array whether to has particular property
 * params:arr<Array>,property<String>
 * return:res<Boolean>
 */
export function hasPropertyOfArray(arr, prop) {
  if (!arr) return false;
  let res = false;
  arr.map(item => {
    if (item.constructor === Object && Object.keys(item).indexOf(prop) > -1) {
      res = true;
    }
  });
  return res;
}

export const generateUUID = (prefix = null) => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // eslint-disable-next-line eqeqeq
      return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16);
    }
  );
  if (prefix) {
    return `${prefix}-${uuid}`;
  }
  return uuid;
};
