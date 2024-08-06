import dayjs from 'dayjs';
import { strToBool } from './index';
export function formatToNow(val) {
  return val ? dayjs(val).toNow() : '';
}
export function formatDuration(date, maxDate) {
  if (!date) {
    return '--';
  }
  const _maxData = maxDate || dayjs();

  let ms = dayjs(_maxData) - dayjs(date);
  if (ms < 0) ms = -ms;
  const time = {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60
    // s: Math.floor(ms / 1000) % 60
    // millisecond: Math.floor(ms) % 1000
  };
  const str = Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}`)
    .join(', ');
  return str || 0;
}

export function formatDate(val, format = 'MM/DD/YYYY') {
  if (!val) {
    return '--';
  }
  if (format === 'TimeOffset') {
    return formatDuration(val);
  }
  return val ? dayjs(val).format(format) : '--';
}
export function formatBoolean(value) {
  if (value !== null && value !== '') {
    return strToBool(value) ? 'Yes' : 'No';
  }
  return 'None';
}
export function formatPrice(value, isNumber = false) {
  if (!value && value !== 0) {
    return '--';
  }
  if (isNaN(value)) {
    return value;
  }
  if (isNumber) {
    return `${Number(value).toLocaleString('en-US')}`;
  } else {
    return `$ ${Number(value).toLocaleString('en-US')}`;
  }
}

export function formatPhoneNumber(value, format) {
  if (value) {
    if (format === 'Phone1') {
      return value
        .replace(/[-,(,)\s]/gi, '')
        .replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/g, '($1) $2-$3');
    }
    if (format === 'Phone2') {
      return value
        .replace(/[-,(,)\s]/gi, '')
        .replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/g, '$1-$2-$3');
    }
    if (format === 'Phone3') {
      return value
        .replace(/[-,(,)\s]/gi, '')
        .replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/g, '$1 $2-$3');
    }
  }
  return '--';
}

export function formatPercentage(value, format, precision = 2) {
  if (!value) {
    return '--';
  }
  if (isNaN(value)) {
    return value;
  }
  const p = precision - 2;
  const pF = p <= 0 ? 0 : p;
  return `${(Number(value) * 100).toFixed(pF)} %`;
}
export const bytesToSize = bytes => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  // eslint-disable-next-line eqeqeq
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

export function controlValueFormat(value, formater, column) {
  // eslint-disable-next-line eqeqeq
  if (!value && value != 0) {
    return '';
  }
  if (formater && formater.length > 0) {
    const controlType = formater[0];
    const format = formater[1];
    try {
      switch (controlType) {
        case 'Date':
        case 'DateTime':
          // eslint-disable-next-line no-undef
          value = formatDate(value, format);
          break;
        case 'Price':
          // eslint-disable-next-line no-undef
          value = formatPrice(value);
          break;
        case 'Boolean':
          // eslint-disable-next-line no-undef
          value = formatBoolean(value);
          break;
        case 'Percentage':
          // eslint-disable-next-line no-undef
          // eslint-disable-next-line no-case-declarations
          const precision =
            column.precision !== null && column.precision !== undefined
              ? column.precision
              : 5;
          value = formatPercentage(value, format, precision);
          break;
        case 'Phone':
          // eslint-disable-next-line no-undef
          value = formatPhoneNumber(value, format);
          break;
        case 'BytesToSize':
          // eslint-disable-next-line no-undef
          value = bytesToSize(value);
          break;
      }
    } catch (error) {
      // eslint-disable-next-line no-self-assign
      console.error(`format error:${value} to ${format}`, value);
    }
  }
  return value;
}
