'use strict';
import dayjs from 'dayjs';
const YEAR = 'year';
const MONTH = 'month';
const DAY = 'day';
const HOUR = 'hour';
const MINUTE = 'minute';
const SECOND = 'second';
const MILLISECOND = 'millisecond';

var listeners = [];

const month_names = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  es: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  ru: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ],
  ptBr: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  fr: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ],
  tr: [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık'
  ],
  zh: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月'
  ]
};

var date_utils = {
  parse(date, date_separator = '-', time_separator = /[.:]/) {
    if (date instanceof Date) {
      return date;
    }
    return new Date(date)
    // if (typeof date === 'string') {
    //   const parts = date.split(' ');

    //   const date_parts = parts[0]
    //     .split(date_separator)
    //     .map((val) => parseInt(val, 10));
    //   const time_parts = parts[1] && parts[1].split(time_separator);

    //   // month is 0 indexed
    //   date_parts[1] = date_parts[1] - 1;

    //   let vals = date_parts;

    //   if (time_parts && time_parts.length) {
    //     if (time_parts.length === 4) {
    //       time_parts[3] = '0.' + time_parts[3];
    //       time_parts[3] = parseFloat(time_parts[3]) * 1000;
    //     }
    //     vals = vals.concat(time_parts);
    //   }

    //   return new Date(...vals);
    // }
  },

  to_string(date, with_time = false) {
    if (!(date instanceof Date)) {
      throw new TypeError('Invalid argument type');
    }
    const vals = this.get_date_values(date).map((val, i) => {
      if (i === 1) {
        // add 1 for month
        val = val + 1;
      }

      if (i === 6) {
        return padStart(val + '', 3, '0');
      }

      return padStart(val + '', 2, '0');
    });
    const date_string = `${vals[0]}-${vals[1]}-${vals[2]}`;
    const time_string = `${vals[3]}:${vals[4]}:${vals[5]}.${vals[6]}`;

    return date_string + (with_time ? ' ' + time_string : '');
  },

  format(date, format_string = 'YYYY-MM-DD HH:mm:ss.SSS', lang = 'en') {
    const values = this.get_date_values(date)
    // .map((d) => padStart(d, 2, 0));
    const format_map = {
      YYYY: values[0],
      MM: padStart(+values[1] + 1, 2, 0),
      DD: values[2],
      HH: values[3],
      mm: values[4],
      ss: values[5],
      SSS: values[6],
      D: values[2],
      MMMM: month_names[lang][+values[1]],
      MMM: month_names[lang][+values[1]]
    };

    let str = format_string;
    const formatted_values = [];

    Object.keys(format_map)
      .sort((a, b) => b.length - a.length) // big string first
      .forEach((key) => {
        if (str.includes(key)) {
          str = str.replace(key, `$${formatted_values.length}`);
          formatted_values.push(format_map[key]);
        }
      });

    formatted_values.forEach((value, i) => {
      str = str.replace(`$${i}`, value);
    });

    return str;
  },

  diff(date_a, date_b, scale = DAY) {
    const milliseconds = dayjs(date_a).diff(dayjs(date_b));
    const seconds = milliseconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const months = days / 30;
    const years = months / 12;

    if (!scale.endsWith('s')) {
      scale += 's';
    }

    return Math.floor(
      {
        milliseconds,
        seconds,
        minutes,
        hours,
        days,
        months,
        years
      }[scale]
    );
  },

  today() {
    const vals = this.get_date_values(new Date()).slice(0, 3);
    return new Date(...vals);
  },

  now() {
    return new Date();
  },

  add(date, qty, scale) {
    qty = parseInt(qty, 10);
    const vals = [
      date.getFullYear() + (scale === YEAR ? qty : 0),
      date.getMonth() + (scale === MONTH ? qty : 0),
      date.getDate() + (scale === DAY ? qty : 0),
      date.getHours() + (scale === HOUR ? qty : 0),
      date.getMinutes() + (scale === MINUTE ? qty : 0),
      date.getSeconds() + (scale === SECOND ? qty : 0),
      date.getMilliseconds() + (scale === MILLISECOND ? qty : 0)
    ];
    return new Date(...vals);
  },

  start_of(date, scale) {
    const scores = {
      [YEAR]: 6,
      [MONTH]: 5,
      [DAY]: 4,
      [HOUR]: 3,
      [MINUTE]: 2,
      [SECOND]: 1,
      [MILLISECOND]: 0
    };

    function should_reset(_scale) {
      const max_score = scores[scale];
      return scores[_scale] <= max_score;
    }

    const vals = [
      date.getFullYear(),
      should_reset(YEAR) ? 0 : date.getMonth(),
      should_reset(MONTH) ? 1 : date.getDate(),
      should_reset(DAY) ? 0 : date.getHours(),
      should_reset(HOUR) ? 0 : date.getMinutes(),
      should_reset(MINUTE) ? 0 : date.getSeconds(),
      should_reset(SECOND) ? 0 : date.getMilliseconds()
    ];

    return new Date(...vals);
  },

  clone(date) {
    return new Date(...this.get_date_values(date));
  },

  get_date_values(date) {
    return [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];
  },

  get_days_in_month(date) {
    const no_of_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const month = date.getMonth();

    if (month !== 1) {
      return no_of_days[month];
    }

    // Feb
    const year = date.getFullYear();
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return 29;
    }
    return 28;
  }
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
function padStart(str, targetLength, padString) {
  str = str + '';
  targetLength = targetLength >> 0;
  padString = String(typeof padString !== 'undefined' ? padString : ' ');
  if (str.length > targetLength) {
    return String(str);
  } else {
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length);
    }
    return padString.slice(0, targetLength) + String(str);
  }
}

function $(expr, con) {
  return typeof expr === 'string'
    ? (con || document).querySelector(expr)
    : expr || null;
}

function createSVG(tag, attrs) {
  const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const attr in attrs) {
    if (attr === 'append_to') {
      const parent = attrs.append_to;
      parent.appendChild(elem);
    } else if (attr === 'innerHTML') {
      elem.innerHTML = attrs.innerHTML;
    } else {
      elem.setAttribute(attr, attrs[attr]);
    }
  }
  return elem;
}

function animateSVG(svgElement, attr, from, to) {
  const animatedSvgElement = getAnimationElement(svgElement, attr, from, to);

  if (animatedSvgElement === svgElement) {
    // triggered 2nd time programmatically
    // trigger artificial click event
    const event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, true);
    event.eventName = 'click';
    animatedSvgElement.dispatchEvent(event);
  }
}

function getAnimationElement(
  svgElement,
  attr,
  from,
  to,
  dur = '0.4s',
  begin = '0.1s'
) {
  const animEl = svgElement.querySelector('animate');
  if (animEl) {
    $.attr(animEl, {
      attributeName: attr,
      from,
      to,
      dur,
      begin: 'click + ' + begin // artificial click
    });
    return svgElement;
  }

  const animateElement = createSVG('animate', {
    attributeName: attr,
    from,
    to,
    dur,
    begin,
    calcMode: 'spline',
    values: from + ';' + to,
    keyTimes: '0; 1',
    keySplines: cubic_bezier('ease-out')
  });
  svgElement.appendChild(animateElement);

  return svgElement;
}

function cubic_bezier(name) {
  return {
    ease: '.25 .1 .25 1',
    linear: '0 0 1 1',
    'ease-in': '.42 0 1 1',
    'ease-out': '0 0 .58 1',
    'ease-in-out': '.42 0 .58 1'
  }[name];
}

$.on = (element, event, selector, callback) => {
  if (!callback) {
    callback = selector;
    $.bind(element, event, callback);
  } else {
    $.delegate(element, event, selector, callback);
  }
};

$.off = (element, event, handler) => {
  element.removeEventListener(event, handler);
};

$.offAll = () => {
  listeners.forEach((item) => {
    item.ele.removeEventListener(item.e, item.callback);
  });
};

$.bind = (element, event, callback) => {
  event.split(/\s+/).forEach(function(event) {
    element.addEventListener(event, callback);
    listeners.push({
      ele: element,
      e: event,
      callback
    });
  });
};

$.delegate = (element, event, selector, callback) => {
  element.addEventListener(event, function(e) {
    const delegatedTarget = e.target.closest(selector);
    if (delegatedTarget) {
      e.delegatedTarget = delegatedTarget;
      callback.call(this, e, delegatedTarget);
    }
  });
};

$.closest = (selector, element) => {
  if (!element) return null;

  if (element.matches(selector)) {
    return element;
  }

  return $.closest(selector, element.parentNode);
};

$.attr = (element, attr, value) => {
  if (!value && typeof attr === 'string') {
    return element.getAttribute(attr);
  }

  if (typeof attr === 'object') {
    for (const key in attr) {
      $.attr(element, key, attr[key]);
    }
    return;
  }

  element.setAttribute(attr, value);
};

class Bar {
  constructor(gantt, task) {
    this.set_defaults(gantt, task);
    this.prepare();
    this.draw();
    this.bind();
  }

  set_defaults(gantt, task) {
    this.action_completed = false;
    this.gantt = gantt;
    this.task = task;
  }

  prepare() {
    this.prepare_values();
    this.prepare_helpers();
  }

  prepare_values() {
    this.invalid = this.task.invalid;
    this.height = this.gantt.options.bar_height;
    this.x = this.compute_x();
    this.warningX = this.compute_warning_x();
    this.y = this.compute_y();

    let task_end = this.task._end;
    this.corner_radius = this.gantt.options.bar_corner_radius;

    this.duration = Math.ceil(
      date_utils.diff(task_end, this.task._start, 'hour') /
      this.gantt.options.step
    )
    this.width = this.gantt.options.column_width * this.duration;

    if (this.task.isNeedWarning && this.task.ecd && dayjs(this.task.ecd).isAfter(dayjs(this.task._end))) {
      task_end = dayjs(this.task.ecd).format('YYYY-MM-DD HH:mm:ss');
    }

    this.warningDuration = Math.ceil(
      date_utils.diff(task_end, this.task._start, 'hour') /
      this.gantt.options.step
    )
    this.warningWidth = this.gantt.options.column_width * this.warningDuration;
    // this.progress_width =
    //   this.gantt.options.column_width *
    //     this.duration *
    //     (this.task.progress / 100) || 0;
    this.group = createSVG('g', {
      class: 'bar-wrapper ' + (this.task.custom_class || ''),
      'data-id': this.task.id
    });
    // <svg t="1717550602259" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="865" width="200" height="200">
    //   <path d="M872 32H152C88 32 32 88 32 152v480c0 64 56 120 120 120h720c64 0 120-56 120-120V152c0-64-56-120-120-120z m40 600c0 24-16 40-40 40H760V392c0-24-16-40-40-40s-40 16-40 40v280H552V288c0-24-16-40-40-40s-40 16-40 40v384H344V472c0-24-16-40-40-40s-40 16-40 40v200H152c-24 0-40-16-40-40V152c0-24 16-40 40-40h720c24 0 40 16 40 40v480z m-40 248H152c-24 0-40 16-40 40s16 40 40 40h720c24 0 40-16 40-40s-16-40-40-40z" p-id="866"></path>
    // </svg>
    // this.group.appendChild(ssss)
    // this.draw_hitach();
    this.bar_group = createSVG('g', {
      class: 'bar-group',
      append_to: this.group
    });
    this.handle_group = createSVG('g', {
      class: 'handle-group',
      append_to: this.group
    });
    // }
  }

  prepare_helpers() {
    SVGElement.prototype.getX = function() {
      return +this.getAttribute('x');
    };
    SVGElement.prototype.getY = function() {
      return +this.getAttribute('y');
    };
    SVGElement.prototype.getWidth = function() {
      return +this.getAttribute('width');
    };
    SVGElement.prototype.getHeight = function() {
      return +this.getAttribute('height');
    };
    SVGElement.prototype.getEndX = function() {
      return this.getX() + this.getWidth();
    };
  }

  draw() {
    this.draw_bar();
    this.draw_label();
    // this.draw_progress_bar();
    if (!this.task.custom_class || (this.task.custom_class && this.task.custom_class !== 'disabled-drag')) {
      this.draw_resize_handles();
    }
  }

  draw_hitach() {
    this.$defs = document.createElement('defs');
    this.$pattern = document.createElement('pattern');
    this.$pattern.setAttribute('id', 'diagonalHatch');
    this.$pattern.setAttribute('width', '20');
    this.$pattern.setAttribute('height', '20');
    this.$pattern.setAttribute('patternTransform', 'rotate(45 0 0)');
    this.$pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    this.$line = document.createElement('line');
    this.$line.setAttribute('x1', '0');
    this.$line.setAttribute('x2', '0');
    this.$line.setAttribute('y1', '0');
    this.$line.setAttribute('y2', '0');
    this.$line.setAttribute(
      'style',
      'stroke: rgba(255, 255, 255, 0.145); stroke-width: 20;'
    );
    this.$pattern.appendChild(this.$line);
    this.$defs.appendChild(this.$pattern);
    this.group.appendChild(this.$defs);
  }

  draw_link_icon() {
    const title = createSVG('title', { innerHTML: 'Click to set dependency' })
    this.group.appendChild(title)
    this.$bar_link_svg = createSVG('svg', {
      class: this.task.isClickLink ? 'icon_link bar-link-clicked' : 'icon_link',
      x: Math.max(this.warningX + this.warningWidth, this.x + this.width),
      y: this.y,
      opacity: this.task.hidden_dependency ? 0 : 1,
      'data-task-id': this.task.id,
      width: '20',
      height: '20',
      viewBox: '0 0 1024 1024',
      append_to: this.group
    })
    createSVG('path', {
      d: 'M377.6 473.6C377.6 448 384 422.4 403.2 403.2l70.4-70.4 57.6-57.6c19.2-19.2 38.4-25.6 64-25.6 25.6 0 44.8 6.4 64 25.6 38.4 38.4 38.4 89.6 0 128l-128 128C512 550.4 492.8 556.8 467.2 556.8L416 608C428.8 614.4 448 620.8 467.2 620.8 512 620.8 544 601.6 576 576l128-128c57.6-57.6 57.6-153.6 0-211.2-57.6-57.6-153.6-57.6-211.2 0l-128 128C320 403.2 307.2 467.2 326.4 524.8L377.6 473.6z',
      append_to: this.$bar_link_svg,
      fill: this.task.isClickLink ? '#409eff' : ''
    })
    createSVG('path', {
      d: 'M646.4 550.4c0 25.6-6.4 51.2-25.6 70.4l-128 128c-19.2 19.2-38.4 25.6-64 25.6-25.6 0-44.8-6.4-64-25.6-38.4-38.4-38.4-89.6 0-128l128-128c19.2-19.2 44.8-25.6 70.4-25.6l51.2-51.2C588.8 409.6 576 403.2 556.8 403.2 512 403.2 473.6 422.4 448 448L320 576c-57.6 57.6-57.6 153.6 0 211.2 57.6 57.6 153.6 57.6 211.2 0l128-128c44.8-44.8 57.6-108.8 32-160L646.4 550.4z',
      append_to: this.$bar_link_svg,
      fill: this.task.isClickLink ? '#409eff' : ''
    })
    this.$bar_link_rect = createSVG('rect', {
      append_to: this.group,
      x: Math.max(this.warningX + this.warningWidth, this.x + this.width),
      y: this.y,
      'data-task-id': this.task.id,
      width: '20',
      height: '20',
      class: 'icon_link icon-area'
    })
  }
  draw_warning_icon() {
    this.$bar_warning_svg = createSVG('svg', {
      class: 'icon_warning',
      x: Math.min(this.x, this.warningX) - 25,
      y: this.y,
      width: '20',
      height: '20',
      viewBox: '0 0 1024 1024',
      append_to: this.group
    })
    createSVG('path', {
      d: 'M465 220.1L161.7 745.6c-21.8 37.7 5.4 84.8 48.9 84.8h606.7c43.5 0 70.7-47.1 49-84.8L562.9 220.1c-21.7-37.7-76.1-37.7-97.9 0z m0 0',
      fill: '#F25A5A',
      append_to: this.$bar_warning_svg
    })
    createSVG('path', {
      d: 'M513.4 745.8c-21.6 0-36.6-15.6-36.6-38.3 0-21.6 15-38.3 36.6-38.3s37.8 16.8 37.8 38.3c-0.1 22.7-16.3 38.3-37.8 38.3z m-0.6-406.2c16.2 0 34.2 3.6 34.8 20.4-0.1 7.8-0.7 15.6-1.8 23.4-4.2 46.1-16.2 154-21 225.3h-23.4c-5.4-71.3-16.2-176.2-21-224.7-0.6-7.8-1.8-18.6-1.8-24.6 0-15.6 17.4-19.8 34.2-19.8z m0 0',
      fill: '#FFFFFF',
      append_to: this.$bar_warning_svg
    })
  }

  draw_bar() {
    if (this.task.isNeedWarning) {
      this.$warningBar = createSVG('rect', {
        x: this.warningX,
        y: this.y,
        width: this.warningWidth,
        height: this.height,
        rx: this.corner_radius,
        ry: this.corner_radius,
        class: `bar bar-exception`,
        append_to: this.bar_group
      });
    }

    this.$bar = createSVG('rect', {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: `bar bar-${this.task.status || 'info'}`,
      append_to: this.bar_group
    });

    animateSVG(this.$bar, 'width', 0, this.width);
    if (!this.task.isParent && ![25, 28, 30].includes(this.task.subStatus)) {
      this.draw_link_icon()
    }
    this.task.isNeedWarning && this.draw_warning_icon()
    // this.draw_warning_icon()
    if (this.invalid) {
      this.$bar_warning_svg && this.$bar_warning_svg.classList.add('bar-invalid');
      this.$bar_link_svg && this.$bar_link_svg.classList.add('bar-invalid');
      this.$bar.classList.add('bar-invalid');
    }
  }

  draw_progress_bar() {
    if (this.invalid) return;
    // //TODO progress status
    let pro = 'default';
    if (this.task.progress === 100) {
      pro = 'success';
    }
    // else if (this.task.progress === 5) {
    //   pro = "exception";
    // } else if (this.task.progress === 10) {
    //   pro = "warning";
    // }
    this.$bar_progress = createSVG('rect', {
      x: this.x,
      y: this.y,
      width: this.progress_width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: 'bar-progress ' + pro,
      append_to: this.bar_group
    });

    animateSVG(this.$bar_progress, 'width', 0, this.progress_width);
  }

  draw_label() {
    this.$bar_label = createSVG('text', {
      x: Math.max(this.warningX + this.warningWidth / 2, this.x + this.width / 2),
      y: this.y + this.height / 2,
      innerHTML: this.task.name,
      class: `bar-label bar-label-${this.task.status || 'info'}`,
      append_to: this.bar_group
    });

    this.$bar_pop = createSVG('rect', {
      x: this.x + 8,
      y: this.y,
      width: this.width - 16,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: 'bar-popup',
      append_to: this.bar_group
    });
    // labels get BBox in the next tick
    requestAnimationFrame(() => this.update_label_position());
  }

  draw_resize_handles() {
    if (this.invalid) return;

    const bar = this.$bar;
    const handle_width = 6;

    createSVG('rect', {
      x: bar.getX() + bar.getWidth() - 7,
      y: bar.getY() + 1,
      width: handle_width,
      height: this.height - 2,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: 'handle right',
      append_to: this.handle_group
    });

    createSVG('rect', {
      x: bar.getX() + 1,
      y: bar.getY() + 1,
      width: handle_width,
      height: this.height - 2,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: 'handle left',
      append_to: this.handle_group
    });

    // if (this.task.progress && this.task.progress < 100) {
    //   this.$handle_progress = createSVG('polygon', {
    //     points: this.get_progress_polygon_points().join(','),
    //     class: 'handle progress',
    //     append_to: this.handle_group
    //   });
    // }
  }

  get_progress_polygon_points() {
    const bar_progress = this.$bar_progress;
    return [
      bar_progress.getEndX() - 5,
      bar_progress.getY() + bar_progress.getHeight(),
      bar_progress.getEndX() + 5,
      bar_progress.getY() + bar_progress.getHeight(),
      bar_progress.getEndX(),
      bar_progress.getY() + bar_progress.getHeight() - 8.66
    ];
  }

  bind() {
    if (this.invalid) return;
    this.setup_click_event();
  }

  setup_click_event() {
    const that = this;
    function clickFunction() {
      if (that.action_completed) {
        // just finished a move action, wait for a few seconds
        return;
      }
      // alert(that.task.name + 'has been clicked!');
      that.gantt.trigger_event('click', [that.task]);
    }

    function focusEvent(e) {
      if (that.action_completed) {
        // just finished a move action, wait for a few seconds
        return;
      }
      that.show_popup();
      that.gantt.unselect_all();
      that.group.classList.add('active');
    }
    function svgMouseClickFunction() {
      that.gantt.trigger_event('svg_click', [that.task]);
    }

    function svgLinkMouseClickFunction() {
      if (that.$bar_link_svg.classList.contains('bar-link-clicked')) {
        removeLinkClass(that.$bar_link_svg)
        that.gantt.showAllDependency()
        return
      }
      that.$bar_link_svg.classList.add('bar-link-clicked');
      const nodes = that.$bar_link_svg.childNodes
      nodes.forEach(node => {
        node.setAttribute('fill', '#409eff')
      })
      const doms = document.querySelectorAll('.bar-link-clicked')
      if (doms.length === 2) {
        const taskids = [that.task.id]
        doms.forEach(dom => {
          const id = dom.getAttribute('data-task-id')
          if (!taskids.includes(id)) {
            taskids.unshift(id)
          }
          removeLinkClass(dom)
        })
        that.gantt.showAllDependency()
        that.gantt.trigger_event('dependency_confirm_click', [taskids]);
        // that.gantt.trigger_event('svg_click', [that.task]);
        // todo alert(')
      } else {
        // that.gantt.trigger_event('dependency_click', [that.task]);
        that.gantt.hiddenDependency(that.task.nonDependentWorkorders, that.task.id)
      }
    }

    function removeLinkClass(dom) {
      dom.classList.remove('bar-link-clicked')
      const domChild = dom.childNodes
      domChild.forEach(chi => {
        chi.removeAttribute('fill')
      })
    }

    this.$bar_warning_svg && $.on(this.$bar_warning_svg, 'click', svgMouseClickFunction)
    this.$bar_link_rect && $.on(this.$bar_link_rect, 'click', svgLinkMouseClickFunction)
    $.on(this.$bar_pop, 'focus ' + this.gantt.options.popup_trigger, focusEvent);
    // $.on(this.$bar_label, 'focus ' + this.gantt.options.popup_trigger, focusEvent);

    // 双击是为了跟document的拖拽或者resize的鼠标事件区分出来。
    $.on(this.group, 'dblclick', clickFunction);
  }

  show_popup() {
    if (this.gantt.bar_being_dragged) return;

    const start_date = date_utils.format(
      this.task._start,
      'MMM D',
      this.gantt.options.language
    );
    const end_date = date_utils.format(
      date_utils.add(this.task._end, -1, 'second'),
      'MMM D',
      this.gantt.options.language
    );
    const subtitle = 'Target Timeline: ' + start_date + ' - ' + end_date ;
    const subchildTitle = this.task.actualCompletionDate ? `Actual Completion Date: ${date_utils.format(
      this.task._actualDate,
      'MMM D',
      this.gantt.options.language
    )}` : '';
    this.gantt.show_popup({
      target_element: this.$bar,
      title: this.task.id,
      subtitle: subtitle,
      subchildTitle,
      task: this.task
    });
  }

  update_bar_position({ x = null, width = null }) {
    const bar = this.$bar;
    if (x) {
      // get all x values of parent task
      const last_parent_id = this.gantt.get_last_parent_id(this.task.id)
      let xs = 0
      if (last_parent_id !== this.task.id) {
        const last_parent = this.gantt.get_bar(last_parent_id)
        xs = last_parent.$bar.getX() + last_parent.$bar.getWidth()
      }
      // console.log(last_parent_id, this.task.id, xs, x)
      // const xs = this.task.dependencies.map((dep) => {
      //   return this.gantt.get_bar(dep).$bar.getX() + this.gantt.get_bar(dep).$bar.getWidth();
      // });
      // console.log('xs', xs)
      // // child task must not go before parent
      // const valid_x = xs.reduce((prev, curr) => {
      //   return x >= curr;
      // }, x);
      if (x < xs) {
        width = null;
        return;
      }
      this.update_attr(bar, 'x', x);
    }
    if (width && width >= this.gantt.options.column_width) {
      this.update_attr(bar, 'width', width);
    }
    this.update_icon_position()
    this.update_label_position();
    this.update_handle_position();
    this.update_progressbar_position();
    this.update_arrow_position();
  }

  date_changed(trigger = true) {
    let changed = false;
    const { new_start_date, new_end_date } = this.compute_start_end_date();

    if (Number(this.task._start) !== Number(new_start_date)) {
      changed = true;
      this.task._start = new_start_date;
    }

    if (Number(this.task._end) !== Number(new_end_date)) {
      changed = true;
      this.task._end = new_end_date;
    }
    console.log(this.gantt.tasks)
    if (!changed) return;
    if (!trigger) return
    this.gantt.trigger_event('date_change', [
      this.task,
      new_start_date,
      date_utils.add(new_end_date, -1, 'second')
    ]);
  }

  progress_changed() {
    const new_progress = this.compute_progress();
    this.task.progress = new_progress;
    this.gantt.trigger_event('progress_change', [this.task, new_progress]);
  }

  set_action_completed() {
    this.action_completed = true;
    setTimeout(() => (this.action_completed = false), 1000);
  }

  compute_start_end_date() {
    const bar = this.$bar;
    const x_in_units = bar.getX() / this.gantt.options.column_width;
    const new_start_date = date_utils.add(
      this.gantt.gantt_start,
      x_in_units * this.gantt.options.step,
      'hour'
    );
    const width_in_units = bar.getWidth() / this.gantt.options.column_width;
    const new_end_date = date_utils.add(
      new_start_date,
      width_in_units * this.gantt.options.step,
      'hour'
    );

    return { new_start_date, new_end_date };
  }

  compute_progress() {
    const progress =
      (this.$bar_progress.getWidth() / this.$bar.getWidth()) * 100;
    return parseInt(progress, 10);
  }

  compute_warning_x() {
    const { step, column_width } = this.gantt.options;
    let task_start = this.task._start;
    const gantt_start = this.gantt.gantt_start;
    if (this.task.isNeedWarning && this.task.vendorScheduledVisitStartDate && dayjs(this.task.vendorScheduledVisitStartDate).isBefore(dayjs(task_start))) {
      task_start = dayjs(this.task.vendorScheduledVisitStartDate).format('YYYY-MM-DD HH:mm:ss');
    }
    const diff = date_utils.diff(task_start, gantt_start, 'hour');
    let x = (diff / step) * column_width;

    if (this.gantt.view_is('Month')) {
      const diff = date_utils.diff(task_start, gantt_start, 'day');
      x = (diff * column_width) / 30;
    }
    return x;
  }

  compute_x() {
    const { step, column_width } = this.gantt.options;
    const task_start = this.task._start;
    const gantt_start = this.gantt.gantt_start;
    const diff = date_utils.diff(task_start, gantt_start, 'hour');
    let x = (diff / step) * column_width;

    if (this.gantt.view_is('Month')) {
      const diff = date_utils.diff(task_start, gantt_start, 'day');
      x = (diff * column_width) / 30;
    }
    return x;
  }

  compute_y() {
    return (
      (this.gantt.options.padding / 2) +
      this.task._index * (this.height + this.gantt.options.padding + 1)
    );
  }

  get_snap_position(dx) {
    const odx = dx;
    let rem;
    let position;

    if (this.gantt.view_is('Week')) {
      rem = dx % (this.gantt.options.column_width / 7);
      position =
        odx -
        rem +
        (rem < this.gantt.options.column_width / 14
          ? 0
          : this.gantt.options.column_width / 7);
    } else if (this.gantt.view_is('Month')) {
      rem = dx % (this.gantt.options.column_width / 30);
      position =
        odx -
        rem +
        (rem < this.gantt.options.column_width / 60
          ? 0
          : this.gantt.options.column_width / 30);
    } else {
      rem = dx % this.gantt.options.column_width;
      position =
        odx -
        rem +
        (rem < this.gantt.options.column_width / 2
          ? 0
          : this.gantt.options.column_width);
    }
    return position;
  }

  update_attr(element, attr, value) {
    value = +value;
    if (!isNaN(value)) {
      element.setAttribute(attr, value);
    }
    return element;
  }

  update_progressbar_position() {
    this.$bar_progress?.setAttribute('x', this.$bar.getX());
    this.$bar_progress?.setAttribute(
      'width',
      this.$bar.getWidth() * (this.task.progress / 100)
    );
  }

  update_icon_position() {
    const bar = this.$bar;

    const iconLinks = this.group.querySelectorAll('.icon_link');
    const iconWarning = this.group.querySelector('.icon_warning');
    if (iconLinks && iconLinks.length > 0) {
      iconLinks.forEach(iconLink => {
        iconLink && iconLink.setAttribute('x', bar.getX() + bar.getWidth());
      });
    }
    iconWarning && iconWarning.setAttribute('x', bar.getX() - 25);
  }

  update_label_position() {
    const warningBar = this.$warningBar
    const oriBar = this.$bar
    const bar = warningBar ? (warningBar.getWidth() + warningBar.getX() > oriBar.getWidth() + oriBar.getX() ? warningBar : oriBar) : oriBar;
    const label = this.group.querySelector('.bar-label');

    if (label.getBBox().width > bar.getWidth()) {
      label.classList.add('big');
      label.setAttribute('x', bar.getX() + bar.getWidth() + 20);
    } else {
      label.classList.remove('big');
      label.setAttribute('x', bar.getX() + bar.getWidth() / 2);
    }
  }

  update_handle_position() {
    const bar = this.$bar;
    this.handle_group
      .querySelector('.handle.left')
      ?.setAttribute('x', bar.getX() + 1);
    this.handle_group
      .querySelector('.handle.right')
      ?.setAttribute('x', bar.getEndX() - 9);
    const handle = this.group.querySelector('.handle.progress');
    handle && handle.setAttribute('points', this.get_progress_polygon_points());
  }

  update_arrow_position() {
    this.arrows = this.arrows || [];
    for (const arrow of this.arrows) {
      arrow.update();
    }
  }
}
class Arrow {
  constructor(gantt, from_task, to_task) {
    this.gantt = gantt;
    this.from_task = from_task;
    this.to_task = to_task;

    this.calculate_path();
    this.draw();
  }

  calculate_path() {
    let start_x =
      this.from_task.$bar.getX() + this.from_task.$bar.getWidth() - 10;
    const condition = () =>
      this.to_task.$bar.getX() < start_x &&
      start_x > this.from_task.$bar.getX();

    while (condition()) {
      start_x -= 20;
    }

    // this.gantt.options.header_height +
    const start_y = this.from_task.$bar.getY();
    // this.gantt.options.bar_height +
    // (this.gantt.options.padding + this.gantt.options.bar_height) *
    //   this.from_task.task._index +
    // this.gantt.options.padding;
    const end_x =
      this.to_task.$bar.getX();
    const end_y = (this.gantt.options.bar_height / 2) + this.to_task.$bar.getY();
    // this.gantt.options.header_height +
    // this.gantt.options.bar_height / 2 +
    // (this.gantt.options.padding + this.gantt.options.bar_height) *
    //   this.to_task.task._index +
    // this.gantt.options.padding;

    const from_is_below_to =
      this.from_task.task._index > this.to_task.task._index;
    const curve = this.gantt.options.arrow_curve;
    const clockwise = from_is_below_to ? 1 : 0;
    const curve_y = from_is_below_to ? -curve : curve;
    const offset = from_is_below_to
      ? end_y + this.gantt.options.arrow_curve
      : end_y - this.gantt.options.arrow_curve;

    this.path = `
            M ${start_x} ${start_y}
            V ${offset}
            a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
            L ${end_x} ${end_y}
            m -5 -5
            l 5 5
            l -5 5`;

    if (
      this.to_task.$bar.getX() <
      this.from_task.$bar.getX() + this.gantt.options.padding
    ) {
      const down_1 = this.gantt.options.padding / 2 - curve;
      const down_2 =
        this.to_task.$bar.getY() + this.to_task.$bar.getHeight() / 2 - curve_y;
      const left = this.to_task.$bar.getX() - this.gantt.options.padding;

      this.path = `
                M ${start_x} ${start_y}
                v ${down_1}
                a ${curve} ${curve} 0 0 1 -${curve} ${curve}
                H ${left}
                a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curve_y}
                V ${down_2}
                a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
                L ${end_x} ${end_y}
                m -5 -5
                l 5 5
                l -5 5`;
    }
  }

  draw() {
    this.element = createSVG('path', {
      d: this.path,
      class: 'path-line',
      'data-from': this.from_task.task.id,
      'data-to': this.to_task.task.id
    });
    const that = this;

    function focusEvent() {
      if (that.action_completed) {
        // just finished a move action, wait for a few seconds
        return;
      }
      // that.show_popup();
    }

    function clickArrow() {
      that.gantt.trigger_event('arrow_line_click', [
        that.from_task.task.id,
        that.to_task.task.id
      ]);
    }

    $.on(this.element, 'focus ' + this.gantt.options.popup_trigger, focusEvent);
    $.on(this.element, 'click', clickArrow)
  }

  update() {
    this.calculate_path();
    this.element.setAttribute('d', this.path);
  }

  /**
   * Arrow popup
   * @param
   * @returns
   */
  show_popup() {
    if (this.gantt.bar_being_dragged) return;

    this.gantt.show_popup({
      target_element: this.element,
      task: {},
      title:
        this.from_task.task.name +
        ` ${this.from_task.task.progress}% completed!`,
      subtitle:
        this.to_task.task.name + ` ${this.to_task.task.progress}% completed!`
    });
  }
}

class Popup {
  constructor(parent, custom_html) {
    this.parent = parent;
    this.custom_html = custom_html;
    this.make();
  }

  make() {
    this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="sub-child-title"></div>
            <div class="pointer"></div>
        `;

    this.hide();

    this.title = this.parent.querySelector('.title');
    this.subtitle = this.parent.querySelector('.subtitle');
    this.subchildTitle = this.parent.querySelector('.sub-child-title');
    this.pointer = this.parent.querySelector('.pointer');
  }

  show(options) {
    // if (!options.target_element) {
    //   throw new Error('target_element is required to show popup');
    // }
    // if (!options.position) {
    //   options.position = 'left';
    // }
    // const target_element = options.target_element;
    // if (this.custom_html && options.task) {
    //   // let html = this.custom_html(options.task);
    //   const html = '<div class="pointer"></div>';
    //   this.parent.innerHTML = html;
    //   // const el = create(ProjectCost, { text: 'This is a custom popup, please check the source code for more details.' })

    //   // this.parent.appendChild(ssss)
    //   this.pointer = this.parent.querySelector('.pointer');
    // } else {
    //   // set data
    //   this.title.innerHTML = options.title;
    //   this.subtitle.innerHTML = options.subtitle;
    //   this.subchildTitle.innerHTML = options.subchildTitle
    //   this.parent.style.whiteSpace = 'nowrap';
    //   // this.parent.style.width = this.parent.clientWidth + "px";
    // }

    // const divHeight = options.subchildTitle ? 107 : 89

    // // set position
    // let position_meta;
    // if (target_element instanceof HTMLElement) {
    //   position_meta = target_element.getBoundingClientRect();
    // } else if (target_element instanceof SVGElement) {
    //   position_meta = options.target_element.getBBox();
    // }

    // // let popup to up
    // const isPopupDown = [0, 1].includes(options.task._index)
    // if (options.position === 'left') {
    //   this.parent.style.left =
    //     position_meta.x + (position_meta.width + 10) + 'px';
    //   this.parent.style.top = isPopupDown ? position_meta.y + 'px' : (position_meta.y + position_meta.height - divHeight) + 'px';

    //   this.pointer.style.transform = 'rotateZ(90deg)';
    //   this.pointer.style.left = '-7px';
    //   this.pointer.style.top = isPopupDown ? '2px' : divHeight - 10 + 'px';
    // }

    // // show
    // this.parent.style.opacity = 1;
  }

  hide() {
    this.parent.style.opacity = 0;
    this.parent.style.left = 0;
  }
}

const VIEW_MODE = {
  QUARTER_DAY: 'Quarter Day',
  HALF_DAY: 'Half Day',
  DAY: 'Day',
  WEEK_DAY: 'WEEK_DAY',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year'
};
export class Gantt {
  constructor(wrapper, tasks, options) {
    this.setup_wrapper(wrapper);
    this.setup_options(options);
    this.setup_tasks(tasks);
    // initialize with default view mode
    this.change_view_mode();
    this.bind_bar_hover_events()
    if (!options.previewMode) {
      this.bind_events();
    }
  }

  setup_wrapper(element) {
    listeners = [];
    let svg_element, wrapper_element;

    // CSS Selector is passed
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }

    // get the SVGElement
    if (element instanceof HTMLElement) {
      wrapper_element = element;
      svg_element = element.querySelector('svg');
    } else if (element instanceof SVGElement) {
      svg_element = element;
    } else {
      throw new TypeError(
        'Frappé Gantt only supports usage of a string CSS selector,' +
          " HTML DOM element or SVG DOM element for the 'element' parameter"
      );
    }

    // svg element
    if (!svg_element) {
      // create it
      this.$svg_date = createSVG('svg', {
        append_to: wrapper_element,
        class: 'gantt-date'
      });
      this.$svg = createSVG('svg', {
        append_to: wrapper_element,
        class: 'gantt'
      });
    } else {
      this.$svg = svg_element;
      this.$svg.classList.add('gantt');
    }

    // wrapper element
    this.$container = document.createElement('div');
    this.$date_container = document.createElement('div');
    this.$container.classList.add('gantt-container');

    this.$date_container.classList.add('gantt-date-container');

    const parent_element = this.$svg.parentElement;
    parent_element.appendChild(this.$date_container)
    this.$date_container.appendChild(this.$svg_date)
    parent_element.appendChild(this.$container);
    this.$container.appendChild(this.$svg);

    // popup wrapper
    this.popup_wrapper = document.createElement('div');
    this.popup_wrapper.classList.add('popup-wrapper');
    this.$container.appendChild(this.popup_wrapper);
  }

  setup_options(options) {
    const default_options = {
      header_height: 75,
      column_width: 30,
      step: 24,
      view_modes: [...Object.values(VIEW_MODE)],
      bar_height: 20,
      bar_corner_radius: 7,
      arrow_curve: 5,
      padding: 18,
      view_mode: 'Day',
      date_format: 'YYYY-MM-DD',
      popup_trigger: 'click',
      custom_popup_html: null,
      language: 'en'
    };
    this.options = Object.assign({}, default_options, options);
  }

  setup_tasks(tasks) {
    // prepare tasks
    this.tasks = tasks.map((task, i) => {
      // convert to Date objects
      task._start = date_utils.parse(task.start);
      task._end = date_utils.parse(task.end);
      task._actualDate = task.actualCompletionDate && date_utils.parse(task.actualCompletionDate);

      // make task invalid if duration too large
      if (date_utils.diff(task._end, task._start, 'year') > 10) {
        task.end = null;
      }

      // cache index
      task._index = i;

      // invalid dates
      if (!task.start && !task.end) {
        const today = date_utils.today();
        task._start = today;
        task._end = date_utils.add(today, 2, 'day');
      }

      if (!task.start && task.end) {
        task._start = date_utils.add(task._end, -2, 'day');
      }

      if (task.start && !task.end) {
        task._end = date_utils.add(task._start, 2, 'day');
      }

      // if hours is not set, assume the last day is full day
      // e.g: 2018-09-09 becomes 2018-09-09 23:59:59
      const task_end_values = date_utils.get_date_values(task._end);
      if (task_end_values.slice(3).every((d) => d === 0)) {
        task._end = date_utils.add(task._end, 24, 'hour');
      }

      // invalid flag
      // if (!task.start || !task.end) {
      //   task.invalid = true;
      // } else {
      //   task.invalid = false;
      // }

      // dependencies
      if (typeof task.dependencies === 'string' || !task.dependencies) {
        let deps = [];
        if (task.dependencies) {
          deps = task.dependencies
            .split(',')
            .map((d) => d.trim())
            .filter((d) => d);
        }
        task.dependencies = deps;
      }

      // uids
      if (!task.id) {
        task.id = generate_id(task);
      }

      return task;
    });
    this.setup_dependencies();
  }

  setup_dependencies() {
    this.dependency_map = {};
    for (const t of this.tasks) {
      for (const d of t.dependencies) {
        this.dependency_map[d] = this.dependency_map[d] || [];
        this.dependency_map[d].push(t.id);
      }
    }
  }

  compute_height() {
    return (this.options.bar_height + this.options.padding + 1) * this.tasks.length
  }

  refresh(tasks) {
    if (Array.isArray(tasks)) {
      if (tasks.length === 0) {
        this.clearBar();
        return
      }
      this.setup_tasks(tasks);
      this.change_view_mode();
    }
  }

  showAllDependency() {
    const linkList = document.querySelectorAll('.icon_link')
    linkList.forEach(link => {
      link.classList.remove('icon_link_hidden')
    })
  }

  hiddenDependency(tasks, taskId) {
    // hidden other dependency
    const linkList = document.querySelectorAll('.icon_link')
    linkList.forEach(link => {
      if (![...tasks, taskId].includes(link.getAttribute('data-task-id'))) {
        link.classList.add('icon_link_hidden')
      }
    })
    // this.tasks = this.tasks.map((task) => {
    //   if (![...tasks, taskId].includes(task.id)) {
    //     task.hidden_dependency = true;
    //   }
    //   if (task.id === taskId) {
    //     task.isClickLink = true
    //   }
    //   return task
    // })
    // this.change_view_mode()
  }

  change_view_mode(mode = this.options.view_mode, isRefresh = false) {
    this.update_view_scale(mode);
    this.setup_dates();
    this.render(isRefresh);
    // fire viewmode_change event
    this.trigger_event('view_change', [mode]);
  }

  // 预览模式，true为编辑，false为预览
  change_preview_mode(mode = false) {
    if (mode) {
      this.destroy();
    } else {
      this.bind_events();
    }
  }

  update_view_scale(view_mode) {
    this.options.view_mode = view_mode;
    if (view_mode === VIEW_MODE.WEEK_DAY) {
      this.options.step = 24 / 7;
      this.options.column._width = 18;
    } else if (view_mode === VIEW_MODE.DAY) {
      this.options.step = 24;
      this.options.column_width = 18;
    } else if (view_mode === VIEW_MODE.HALF_DAY) {
      this.options.step = 24 / 2;
      this.options.column_width = 38;
    } else if (view_mode === VIEW_MODE.QUARTER_DAY) {
      this.options.step = 24 / 4;
      this.options.column_width = 38;
    } else if (view_mode === VIEW_MODE.WEEK) {
      this.options.step = 24 * 7;
      this.options.column_width = 140;
    } else if (view_mode === VIEW_MODE.MONTH) {
      this.options.step = 24 * 30;
      this.options.column_width = 120;
    } else if (view_mode === VIEW_MODE.YEAR) {
      this.options.step = 24 * 365;
      this.options.column_width = 120;
    }
  }

  setup_dates() {
    this.setup_gantt_dates();
    this.setup_date_values();
  }

  setup_gantt_dates() {
    this.gantt_start = this.gantt_end = null;

    for (const task of this.tasks) {
      // set global start and end date
      if (!this.gantt_start || task._start < this.gantt_start) {
        this.gantt_start = task._start;
      }
      if (!this.gantt_end || task._end > this.gantt_end) {
        this.gantt_end = task._end;
      }
    }
    if (this.gantt_start && this.gantt_end) {
      this.gantt_start = date_utils.start_of(this.gantt_start, 'day');
      this.gantt_end = date_utils.start_of(this.gantt_end, 'day');

      // add date padding on both sides
      if (this.view_is([VIEW_MODE.QUARTER_DAY, VIEW_MODE.HALF_DAY])) {
        this.gantt_start = date_utils.add(this.gantt_start, -7, 'day');
        this.gantt_end = date_utils.add(this.gantt_end, 7, 'day');
      } else if (this.view_is(VIEW_MODE.MONTH)) {
        this.gantt_start = date_utils.start_of(this.gantt_start, 'year');
        this.gantt_end = date_utils.add(this.gantt_end, 1, 'year');
      } else if (this.view_is(VIEW_MODE.YEAR)) {
        this.gantt_start = date_utils.add(this.gantt_start, -2, 'year');
        this.gantt_end = date_utils.add(this.gantt_end, 2, 'year');
      } else {
        this.gantt_start = date_utils.add(this.gantt_start, -1, 'month');
        this.gantt_end = date_utils.add(this.gantt_end, 1, 'month');
      }
    }
  }

  setup_date_values() {
    this.dates = [];
    let cur_date = null;
    if (this.gantt_start) {
      while (cur_date === null || cur_date < this.gantt_end) {
        if (!cur_date) {
          cur_date = date_utils.clone(this.gantt_start);
        } else {
          if (this.view_is(VIEW_MODE.YEAR)) {
            cur_date = date_utils.add(cur_date, 1, 'year');
          } else if (this.view_is(VIEW_MODE.MONTH)) {
            cur_date = date_utils.add(cur_date, 1, 'month');
          } else {
            cur_date = date_utils.add(cur_date, this.options.step, 'hour');
          }
        }
        this.dates.push(cur_date);
      }
    }
  }

  bind_events() {
    this.bind_grid_click();
    this.bind_bar_events();
  }

  render(isRefresh = false) {
    this.clear();
    this.setup_layers();
    this.make_grid();
    this.make_dates();
    this.make_bars();
    this.make_arrows();
    this.map_arrows_on_bars();
    this.set_width();
    if (!isRefresh) {
      this.set_scroll_position()
    }
  }

  setup_layers() {
    this.layers = {};
    const layers = ['grid', 'date', 'arrow', 'progress', 'bar', 'details'];
    // make group layers
    for (const layer of layers) {
      this.layers[layer] = createSVG('g', {
        class: layer,
        append_to: this.$svg
      });
    }

    this.dateLayers = {};
    const dateLayers = ['grid', 'date'];
    // make group layers
    for (const layer of dateLayers) {
      this.dateLayers[layer] = createSVG('g', {
        class: layer,
        append_to: this.$svg_date
      });
    }
  }

  make_grid() {
    this.make_grid_background();
    this.make_grid_rows();
    this.make_grid_header();
    this.make_grid_ticks();
    this.make_grid_columns();
    this.make_grid_highlights();
  }

  make_grid_background() {
    const grid_width = this.dates.length * this.options.column_width;
    const grid_height =
      // this.options.header_height +
      // this.options.padding +
      this.compute_height()

    createSVG('rect', {
      x: 0,
      y: 0,
      width: grid_width,
      height: grid_height,
      class: 'grid-background',
      append_to: this.layers.grid
    });

    $.attr(this.$svg, {
      // ::-webkit-scrollbar height
      height: grid_height, // scrollbar height,
      width: '100%'
    });

    $.attr(this.$svg_date, {
      height: this.options.header_height,
      width: '100%'
    });
  }

  make_grid_rows() {
    const rows_layer = createSVG('g', { append_to: this.layers.grid });
    const lines_layer = createSVG('g', { append_to: this.layers.grid });

    const row_width = this.dates.length * this.options.column_width;
    const row_height = this.options.bar_height + this.options.padding ;

    const row_y = this.options.padding / 2;

    // date background color
    createSVG('rect', {
      x: 0,
      y: row_y,
      width: row_width,
      height: 50,
      class: 'grid-row',
      style: 'fill:#F2F3F5',
      append_to: this.dateLayers.grid
    });

    // week background color
    createSVG('rect', {
      x: 0,
      y: row_y + 50,
      width: row_width,
      height: 25,
      class: 'grid-row',
      style: 'fill:#D9DCE0',
      append_to: this.dateLayers.grid
    });
    //
    createSVG('line', {
      x1: 0,
      y1: row_y + 25,
      x2: row_width,
      y2: row_y + 26,
      class: 'row-line',
      append_to: this.dateLayers.grid
    });

    createSVG('line', {
      x1: 0,
      y1: row_y + 50,
      x2: row_width,
      y2: row_y + 51,
      class: 'row-line',
      append_to: this.dateLayers.grid
    });
    let grid_row_y = 0
    for (const task of this.tasks) {
      createSVG('rect', {
        x: 0,
        y: grid_row_y,
        'data-task-id': task.id,
        width: row_width,
        height: row_height,
        class: 'grid-row',
        append_to: rows_layer
      });

      createSVG('line', {
        x1: 0,
        y1: grid_row_y + row_height,
        x2: row_width,
        y2: grid_row_y + row_height + 1,
        class: 'row-line',
        append_to: lines_layer
      });
      grid_row_y += row_height + 1 ;
    }
  }

  make_grid_header() {
    // const header_width = this.dates.length * this.options.column_width;
    // const header_height = this.options.header_height + 9;
    // createSVG("rect", {
    //   x: 0,
    //   y: 0,
    //   width: header_width,
    //   height: header_height,
    //   class: "grid-header",
    //   append_to: this.layers.grid,
    // });
  }

  make_grid_ticks() {
    let tick_x = 0;
    const tick_y = (this.options.padding / 2) + 1;
    const tick_height = this.compute_height()
    for (const date of this.dates) {
      let tick_class = 'tick';
      // thick tick for monday
      if (this.view_is(VIEW_MODE.DAY) && date.getDate() === 1) {
        tick_class += ' thick';
      }
      // thick tick for first week
      if (
        this.view_is(VIEW_MODE.WEEK) &&
        date.getDate() >= 1 &&
        date.getDate() < 8
      ) {
        tick_class += ' thick';
      }
      // thick ticks for quarters
      if (this.view_is(VIEW_MODE.MONTH) && (date.getMonth() + 1) % 3 === 0) {
        tick_class += ' thick';
      }

      createSVG('path', {
        d: `M ${tick_x} 0 v ${tick_height}`,
        class: tick_class,
        append_to: this.layers.grid
      });

      // if (this.view_is(VIEW_MODE.DAY) && date.getDay() === 1) {
      //   tick_class += ' new_week';
      // }

      createSVG('path', {
        d: `M ${tick_x} ${tick_class.includes('thick') ? tick_y : tick_y + 25} v ${tick_class.includes('thick') ? this.options.header_height - 2 : this.options.header_height - 27}`,
        class: tick_class,
        append_to: this.dateLayers.grid
      });

      if (this.view_is(VIEW_MODE.MONTH)) {
        tick_x +=
          (date_utils.get_days_in_month(date) * this.options.column_width) / 30;
      } else {
        tick_x += this.options.column_width;
      }
    }
  }

  make_grid_columns() {
    if (this.view_is(VIEW_MODE.DAY)) {
      const total =
        date_utils.diff(this.gantt_end, this.gantt_start, 'hour') /
        this.options.step;
      for (let i = 0; i < total; i++) {
        const x = i * this.options.column_width;
        const y = 0;

        const width = this.options.column_width;
        const height = this.compute_height()
        // +this.options.padding / 2;

        createSVG('rect', {
          x,
          y,
          width,
          height,
          class: 'columns-highlight',
          append_to: this.layers.grid
        });
      }
    }
  }

  make_grid_highlights() {
    // highlight today's date
    if (this.view_is(VIEW_MODE.DAY)) {
      const x =
        (date_utils.diff(date_utils.today(), this.gantt_start, 'hour') /
          this.options.step) *
        this.options.column_width;
      const y = 0;

      const width = this.options.column_width;
      const height = this.compute_height()
      // +this.options.header_height +
      // this.options.padding / 2;

      createSVG('rect', {
        x,
        y,
        width,
        height,
        class: 'today-highlight',
        append_to: this.layers.grid
      });
    }
  }

  make_dates() {
    for (const date of this.get_dates_to_draw()) {
      createSVG('text', {
        x: date.lower_x,
        y: date.lowest_y,
        innerHTML: date.day_week,
        class: 'lower-text',
        append_to: this.dateLayers.date
      });

      createSVG('text', {
        x: date.lower_x,
        y: date.lower_y,
        innerHTML: date.lower_text,
        class: 'lower-text',
        append_to: this.dateLayers.date
      });

      if (date.upper_text) {
        const $upper_text = createSVG('text', {
          x: date.upper_day_week_x,
          y: date.upper_y,
          innerHTML: date.upper_text + ' ' + date.year_text,
          class: 'upper-text',
          append_to: this.dateLayers.date
        });

        // remove out-of-bound dates
        if ($upper_text.getBBox().x2 > this.dateLayers.date.getBBox().width) {
          $upper_text.remove();
        }
      }
    }
  }

  get_dates_to_draw() {
    let last_date = null;
    const dates = this.dates.map((date, i) => {
      const d = this.get_date_info(date, last_date, i);
      last_date = date;
      return d;
    });
    return dates;
  }

  get_date_info(date, last_date, i) {
    const weekAry = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    if (!last_date) {
      last_date = date_utils.add(date, 1, 'year');
    }
    const date_text = {
      'Quarter Day_lower': date_utils.format(date, 'HH', this.options.language),
      'Half Day_lower': date_utils.format(date, 'HH', this.options.language),
      Day_lower:
        date.getDate() !== last_date.getDate()
          ? date_utils.format(date, 'D', this.options.language)
          : '',
      Week_lower:
        date.getMonth() !== last_date.getMonth()
          ? date_utils.format(date, 'D MMM', this.options.language)
          : date_utils.format(date, 'D', this.options.language),
      Month_lower: date_utils.format(date, 'MMMM', this.options.language),
      Year_lower: date_utils.format(date, 'YYYY', this.options.language),
      'Quarter Day_upper':
        date.getDate() !== last_date.getDate()
          ? date_utils.format(date, 'D MMM', this.options.language)
          : '',
      'Half Day_upper':
        date.getDate() !== last_date.getDate()
          ? date.getMonth() !== last_date.getMonth()
            ? date_utils.format(date, 'D MMM', this.options.language)
            : date_utils.format(date, 'D', this.options.language)
          : '',
      Day_upper:
        date.getMonth() !== last_date.getMonth()
          ? date_utils.format(date, 'MMMM', this.options.language)
          : '',
      Week_upper:
        date.getMonth() !== last_date.getMonth()
          ? date_utils.format(date, 'MMMM', this.options.language)
          : '',
      Month_upper:
        date.getFullYear() !== last_date.getFullYear()
          ? date_utils.format(date, 'YYYY', this.options.language)
          : '',
      Year_upper:
        date.getFullYear() !== last_date.getFullYear()
          ? date_utils.format(date, 'YYYY', this.options.language)
          : ''
    };

    const base_pos = {
      x: i * this.options.column_width,
      lowest_y: this.options.header_height,
      lower_y: this.options.header_height - 25,
      upper_y: this.options.header_height - 50
    };

    const x_pos = {
      'Quarter Day_lower': (this.options.column_width * 4) / 2,
      'Quarter Day_upper': 0,
      'Half Day_lower': (this.options.column_width * 2) / 2,
      'Half Day_upper': 0,
      Day_lower: this.options.column_width / 2,
      Day_upper: (this.options.column_width * 30) / 2,
      Week_lower: 0,
      Week_upper: (this.options.column_width * 4) / 2,
      Month_lower: this.options.column_width / 2,
      Month_upper: (this.options.column_width * 12) / 2,
      Year_lower: this.options.column_width / 2,
      Year_upper: (this.options.column_width * 30) / 2
    };

    return {
      upper_text: date_text[`${this.options.view_mode}_upper`],
      lower_text: date_text[`${this.options.view_mode}_lower`],
      upper_x: base_pos.x + x_pos[`${this.options.view_mode}_upper`],
      upper_y: base_pos.upper_y,
      lower_x: base_pos.x + x_pos[`${this.options.view_mode}_lower`],
      lower_y: base_pos.lower_y,
      lowest_y: base_pos.lowest_y,
      year_text: date.getFullYear(),
      day_week: weekAry[date.getDay()],
      upper_day_week_x: base_pos.x + x_pos.Week_upper + 10,
      upper_day_week:
        weekAry[date.getDay()] === 'M'
          ? date_utils.format(date, 'MMMM DD YYYY', this.options.language)
          : ''
    };
  }

  make_bars() {
    this.bars = this.tasks.map((task) => {
      const bar = new Bar(this, task);
      this.layers.bar.appendChild(bar.group);
      return bar;
    });
  }

  make_arrows() {
    this.arrows = [];
    for (const task of this.tasks) {
      let arrows = [];
      arrows = task.dependencies
        .map((task_id) => {
          const dependency = this.get_task(task_id);
          if (!dependency) return;
          if (task.invalid || dependency.invalid) return
          const arrow = new Arrow(
            this,
            this.bars[dependency._index], // from_task
            this.bars[task._index] // to_task
          );
          const title = createSVG('title', { innerHTML: 'Click to delete dependency' })
          this.layers.arrow.appendChild(title);
          this.layers.arrow.appendChild(arrow.element);
          return arrow;
        })
        .filter(Boolean); // filter falsy values
      this.arrows = this.arrows.concat(arrows);
    }
  }

  map_arrows_on_bars() {
    for (const bar of this.bars) {
      bar.arrows = this.arrows.filter((arrow) => {
        return (
          arrow.from_task.task.id === bar.task.id ||
          arrow.to_task.task.id === bar.task.id
        );
      });
    }
  }

  set_width() {
    const cur_width = this.$svg.getBoundingClientRect().width;
    const actual_width = this.$svg
      .querySelector('.grid .grid-row')
      ?.getAttribute('width');
    if (cur_width < actual_width) {
      this.$svg.setAttribute('width', actual_width);
      this.$svg_date.setAttribute('width', actual_width)
    }
  }

  set_scroll_position() {
    const parent_element = this.$svg.parentElement;
    if (!parent_element) return;

    let scroll_pos
    const scrollToMainObj = this.tasks.find((task) => task.id.includes('Maintenanc'))
    if (scrollToMainObj) {
      const bar = this.get_bar(scrollToMainObj.id)
      scroll_pos = bar?.$bar?.getX() - 200
    } else {
      const hours_before_first_task = date_utils.diff(
        this.get_oldest_starting_date(),
        this.gantt_start,
        'hour'
      );

      scroll_pos =
        (hours_before_first_task / this.options.step) *
          this.options.column_width -
        this.options.column_width;
    }

    parent_element.scrollLeft = scroll_pos;
    this.$svg_date.parentElement.scrollLeft = scroll_pos
  }

  bind_grid_click() {
    $.on(
      this.$svg,
      this.options.popup_trigger,
      '.grid-row, .grid-header',
      popupTriggerFunction
    );
    const that = this;
    function popupTriggerFunction() {
      that.unselect_all();
      that.hide_popup();
    }
  }

  bind_bar_hover_events() {
    const that = this
    let parent_bar_id = null

    function mouseoutFunction() {
      that.hide_popup()
    }

    function mouseoverFunction(e, element) {
      const bar_wrapper = $.closest('.bar-wrapper', element);
      parent_bar_id = bar_wrapper.getAttribute('data-id');
      const barResult = {};
      const arrowResult = {}
      that.get_up_down_dependent_tasks_arrows(parent_bar_id, barResult, arrowResult)

      const barResultAry = Object.values(barResult)
      const arrowResultAry = Object.values(arrowResult)

      barResultAry.forEach(bar => {
        bar.$bar.classList.add('bar-dependency-hover')
      })

      arrowResultAry.forEach(item => {
        item.element.classList.add('bar-dependency-hover')
      })
    }
    function barMouseoutFunction() {
      const barResult = {};
      const arrowResult = {}
      that.get_up_down_dependent_tasks_arrows(parent_bar_id, barResult, arrowResult)

      const barResultAry = Object.values(barResult)
      const arrowResultAry = Object.values(arrowResult)
      barResultAry.forEach(bar => {
        bar.$bar.classList.remove('bar-dependency-hover')
      })

      arrowResultAry.forEach(item => {
        item.element.classList.remove('bar-dependency-hover')
      })
    }
    $.on(this.$svg, 'mouseover', '.bar-wrapper', mouseoverFunction)
    $.on(this.$svg, 'mouseout', '.bar-wrapper', barMouseoutFunction)

    $.on(this.$svg, 'mouseout', mouseoutFunction);
  }

  bind_bar_events() {
    let is_dragging = false;
    let x_on_start = 0;
    // let y_on_start = 0;
    let is_resizing_left = false;
    let is_resizing_right = false;
    let parent_bar_id = null;
    let isMoved = false;
    let bars = []; // instanceof Bar
    this.bar_being_dragged = null;

    const that = this;
    function action_in_progress() {
      return is_dragging || is_resizing_left || is_resizing_right;
    }

    function mousedownFunction(e, element) {
      isMoved = false;
      const bar_wrapper = $.closest('.bar-wrapper', element);

      if (element.classList.contains('left')) {
        is_resizing_left = true;
      } else if (element.classList.contains('right')) {
        is_resizing_right = true;
      } else if (element.classList.contains('bar-wrapper') && !element.classList.contains('disabled-drag')) {
        is_dragging = true;
      }

      bar_wrapper.classList.add('active');

      x_on_start = e.offsetX;
      // y_on_start = e.offsetY;

      parent_bar_id = bar_wrapper.getAttribute('data-id');
      const ids = [
        parent_bar_id,
        ...that.get_all_dependent_tasks(parent_bar_id)
      ];
      bars = ids.map((id) => that.get_bar(id));

      that.bar_being_dragged = parent_bar_id;

      bars.forEach((bar) => {
        const $bar = bar.$bar;
        $bar.ox = $bar.getX();
        $bar.oy = $bar.getY();
        $bar.owidth = $bar.getWidth();
        $bar.finaldx = 0;
      });
    }

    function set_bar_to_last_parent_position(bar) {
      const $bar = bar.$bar
      if (bar.task.requestType === 9) {
        bar.update_bar_position({ x: $bar.ox + $bar.finaldx});
      } else {
        const last_parent_id = that.get_last_parent_id(bar.task.id)
        const last_parent = that.get_bar(last_parent_id)
        // const parent = that.get_bar(parent_bar_id)
        let moveX = 0
        // if (last_parent.$bar.ox) {
        //   moveX = last_parent.$bar.getX() - last_parent.$bar.ox
        // } else {
        //   moveX = (parent.$bar.getX() + parent.$bar.getWidth() - (last_parent.$bar.getX() + last_parent.$bar.getWidth()))
        // }
        moveX = last_parent.$bar.getX() + last_parent.$bar.getWidth() - $bar.getX()
        console.log(moveX, last_parent_id, last_parent, bar)
        // }
        if (bar.task.id === 'WO-0000089498') {
          console.log(last_parent_id, last_parent, bar, moveX)
        }
        if (moveX >= 0) {
          bar.update_bar_position({ x: $bar.getX() + moveX});
        }
      }
    }

    function mousemoveFunction(e) {
      if (!action_in_progress()) return;
      const dx = e.offsetX - x_on_start;
      bars.forEach((bar) => {
        const $bar = bar.$bar;
        $bar.finaldx = that.get_snap_position(dx);
        if (
          (is_dragging || is_resizing_left || is_resizing_right) &&
          $bar.finaldx !== 0
        ) {
          isMoved = true;
        } else {
          isMoved = false;
        }
        that.hide_popup();
        if (is_resizing_left) {
          if (parent_bar_id === bar.task.id) {
            bar.update_bar_position({
              x: $bar.ox + $bar.finaldx,
              width: $bar.owidth - $bar.finaldx
            });
          }
          // else {
          //   set_bar_to_last_parent_position(bar)
          // }
          // else {
          //   bar.update_bar_position({
          //     x: $bar.ox + $bar.finaldx
          //   });
          // }
        } else if (is_resizing_right) {
          if (parent_bar_id === bar.task.id) {
            bar.update_bar_position({
              width: $bar.owidth + $bar.finaldx
            });
          } else {
            set_bar_to_last_parent_position(bar)
          }
        } else if (is_dragging) {
          if (parent_bar_id === bar.task.id) {
            bar.update_bar_position({ x: $bar.ox + $bar.finaldx })
          } else {
            set_bar_to_last_parent_position(bar)
          }
        }
      });
    }

    function mouseupFunction() {
      if (is_dragging || is_resizing_left || is_resizing_right) {
        bars.forEach((bar) => bar.group.classList.remove('active'));
      }
      isMoved = false;
      is_dragging = false;
      is_resizing_left = false;
      is_resizing_right = false;
    }

    function svgMouseUpFunction() {
      if (isMoved) {
        console.log('moved')
        // alert('something has changed,would you like to save this?');
      }
      that.bar_being_dragged = null;
      bars.forEach((bar) => {
        const $bar = bar.$bar;
        if (!$bar.finaldx) return;
        bar.date_changed(bar.task.id === parent_bar_id);
        bar.set_action_completed();
        // $bar.ox = null;
        // $bar.oy = null;
        // $bar.owidth = null;
        // $bar.finaldx = null;
      });
    }

    $.on(this.$svg, 'mousedown', '.bar-wrapper, .handle', mousedownFunction);

    $.on(this.$svg, 'mousemove', mousemoveFunction);

    $.on(document, 'mouseup', mouseupFunction);

    $.on(this.$svg, 'mouseup', svgMouseUpFunction);

    this.bind_bar_progress();
  }

  bind_bar_progress() {
    let x_on_start = 0;
    // let y_on_start = 0;
    let is_resizing = null;
    let bar = null;
    let $bar_progress = null;
    let $bar = null;

    const that = this;
    function mousedownFunction(e, handle) {
      is_resizing = true;
      x_on_start = e.offsetX;
      // y_on_start = e.offsetY;

      const $bar_wrapper = $.closest('.bar-wrapper', handle);
      const id = $bar_wrapper.getAttribute('data-id');
      bar = that.get_bar(id);

      $bar_progress = bar.$bar_progress;
      $bar = bar.$bar;

      $bar_progress.finaldx = 0;
      $bar_progress.owidth = $bar_progress.getWidth();
      $bar_progress.min_dx = -$bar_progress.getWidth();
      $bar_progress.max_dx = $bar.getWidth() - $bar_progress.getWidth();
    }

    function mousemoveFunction(e) {
      if (!is_resizing) return;
      let dx = e.offsetX - x_on_start;
      $.attr($bar_progress, 'style', 'fill:$bar-wrapper-progress-color');
      if (dx > $bar_progress.max_dx) {
        dx = $bar_progress.max_dx;
        // 完成了 赋予完成的颜色
        $.attr(
          $bar_progress,
          'style',
          'fill:$bar-wrapper-progress-success-color'
        );
      }
      if (dx < $bar_progress.min_dx) {
        dx = $bar_progress.min_dx;
      }

      // const $handle = bar.$handle_progress;
      $.attr($bar_progress, 'width', $bar_progress.owidth + dx);
      // $.attr($handle, 'points', bar.get_progress_polygon_points());
      $bar_progress.finaldx = dx;
    }

    function mouseupFunction() {
      is_resizing = false;
      if (!($bar_progress && $bar_progress.finaldx)) return;
      bar.progress_changed();
      bar.set_action_completed();
    }

    $.on(this.$svg, 'mousedown', '.handle.progress', mousedownFunction);

    $.on(this.$svg, 'mousemove', mousemoveFunction);

    $.on(this.$svg, 'mouseup', mouseupFunction);
  }

  get_up_down_dependent_tasks_arrows(task_id, barResult = {}, arrowResult = {}) {
    const bar = this.get_bar(task_id)
    barResult[task_id] = bar
    if (bar.arrows && bar.arrows.length > 0) {
      // push arrows
      let fromId = ''
      let toId = ''
      bar.arrows.forEach(arrow => {
        fromId = arrow.from_task.task.id
        toId = arrow.to_task.task.id
        if (!barResult[fromId]) {
          barResult[fromId] = arrow.from_task
          this.get_up_down_dependent_tasks_arrows(fromId, barResult, arrowResult)
        }
        if (!barResult[toId]) {
          barResult[toId] = arrow.to_task
          this.get_up_down_dependent_tasks_arrows(toId, barResult, arrowResult)
        }
        if (!arrowResult[fromId + '_' + toId]) {
          arrowResult[fromId + '_' + toId] = arrow
        }
      })
    }
  }

  // todo
  get_last_parent_id(task_id) {
    const task = this.get_task(task_id)
    const parents = task.dependencies
    if (parents && parents.length > 0) {
      return parents.reduce((acc, curr) => {
        const currTask = this.get_bar(curr)
        if (acc) {
          const accTask = this.get_bar(acc)
          return accTask.$bar.getX() + accTask.$bar.getWidth() < currTask.$bar.getX() + currTask.$bar.getWidth() ? curr : acc
        } else {
          return curr
        }
      }, '')
    }
    return task_id
  }

  get_all_dependent_tasks(task_id) {
    let out = [];
    let to_process = [task_id];
    while (to_process.length) {
      const deps = to_process.reduce((acc, curr) => {
        acc = acc.concat(this.dependency_map[curr]);
        return acc;
      }, []);

      out = out.concat(deps);
      to_process = deps.filter((d) => !to_process.includes(d));
    }

    return out.filter(Boolean);
  }

  get_snap_position(dx) {
    const odx = dx;
    let rem;
    let position;

    if (this.view_is(VIEW_MODE.WEEK)) {
      rem = dx % (this.options.column_width / 7);
      position =
        odx -
        rem +
        (rem < this.options.column_width / 14
          ? 0
          : this.options.column_width / 7);
    } else if (this.view_is(VIEW_MODE.MONTH)) {
      rem = dx % (this.options.column_width / 30);
      position =
        odx -
        rem +
        (rem < this.options.column_width / 60
          ? 0
          : this.options.column_width / 30);
    } else {
      rem = dx % this.options.column_width;
      position =
        odx -
        rem +
        (rem < this.options.column_width / 2 ? 0 : this.options.column_width);
    }
    return position;
  }

  unselect_all() {
    [...this.$svg.querySelectorAll('.bar-wrapper')].forEach((el) => {
      el.classList.remove('active');
    });
  }

  view_is(modes) {
    if (typeof modes === 'string') {
      return this.options.view_mode === modes;
    }

    if (Array.isArray(modes)) {
      return modes.some((mode) => this.options.view_mode === mode);
    }

    return false;
  }

  get_task(id) {
    return this.tasks.find((task) => {
      return task.id === id;
    });
  }

  get_bar(id) {
    return this.bars.find((bar) => {
      return bar.task.id === id;
    });
  }

  show_popup(options) {
    if (!this.popup) {
      this.popup = new Popup(
        this.popup_wrapper,
        this.options.custom_popup_html
      );
    }
    this.popup.show(options);
  }

  hide_popup() {
    this.popup && this.popup.hide();
  }

  trigger_event(event, args) {
    if (this.options['on_' + event]) {
      this.options['on_' + event].apply(null, args);
    }
  }

  /**
   * Gets the oldest starting date from the list of tasks
   *
   * @returns Date
   * @memberof Gantt
   */
  get_oldest_starting_date() {
    return this.tasks
      .map((task) => task._start)
      .reduce((prev_date, cur_date) =>
        cur_date <= prev_date ? cur_date : prev_date
      );
  }

  /**
   * Clear all elements from the parent svg element
   *
   * @memberof Gantt
   */
  clear() {
    this.$svg.innerHTML = '';
  }

  clearBar() {
    this.bars.forEach(item => {
      item.bar_group.remove()
    })
  }

  destroy() {
    $.offAll();
  }
}

Gantt.VIEW_MODE = VIEW_MODE;

function generate_id(task) {
  return task.name + '_' + Math.random().toString(36).slice(2, 12);
}
