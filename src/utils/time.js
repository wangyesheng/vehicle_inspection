const weekdays = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
const holidays = ["2021-01-01"];

const currentDate = new Date();
export const currentYear = currentDate.getFullYear();
export const currentMonth = currentDate.getMonth();
export const currentDay = currentDate.getDate();
export const currentHours = currentDate.getHours();
export const currentMinutes = currentDate.getMinutes();
export const currentFormatDate = `${currentYear}-${zeroPadding(
  currentMonth + 1
)}-${zeroPadding(currentDay)}`;

export function getDateInterval(
  year = currentYear,
  month = currentMonth + 1,
  day = currentDay
) {
  const years = [];
  const months = [];
  const days = [];
  const defaultDate = [];
  for (let i = 0; i < 31; i++) {
    let _year = currentYear - i;
    if (_year === year) {
      defaultDate[0] = i;
    }
    years.push({
      value: _year,
      label: _year + "",
    });
    if (i > 0) {
      days.push({
        value: i,
        label: zeroPadding(i) || i + "",
      });
      if (i < 13) {
        months.push({
          value: i,
          label: zeroPadding(i) || i + "",
        });
      }
      if (i === month) {
        defaultDate[1] = i - 1;
      }
      if (i === day) {
        defaultDate[2] = i - 1;
      }
    }
  }
  days.push({
    value: 31,
    label: "31",
  });
  return {
    years,
    months,
    days,
    defaultDate,
  };
}

export function getMaxDay(year, month) {
  let _year = year;
  let _month = month++;
  if (month > 12) {
    _month -= 12;
    _year++;
  }
  const fullDate = new Date(_year, _month, 1).getTime() - 1000 * 60 * 60 * 24;
  return new Date(fullDate).getDate();
}

export function zeroPadding(value) {
  let label;
  if (value / 10 < 1) {
    label = `0${value}`;
  }
  return label || value;
}

/**
 * 天数差
 * @param {*} startDate 2020-09-01
 * @param {*} endDate 2020-09-10
 */
export function diffDays(startDate, endDate) {
  startDate = Date.parse(startDate);
  endDate = Date.parse(endDate);
  const dateSpan = Math.abs(endDate - startDate);
  return Math.floor(dateSpan / (24 * 3600 * 1000));
}

/**
 * 月数差
 * @param {*} startDate 2019-09-01
 * @param {*} endDate  2020-09-01
 */
export function diffMonths(startDate, endDate) {
  startDate = startDate.split("-");
  startDate = parseInt(startDate[0]) * 12 + parseInt(startDate[1]);
  endDate = endDate.split("-");
  endDate = parseInt(endDate[0]) * 12 + parseInt(endDate[1]);
  return Math.abs(startDate - endDate);
}

function getDate(dateStr) {
  var temp = dateStr.split("-");
  if (temp[1] === "01") {
    temp[0] = parseInt(temp[0], 10) - 1;
    temp[1] = "12";
  } else {
    temp[1] = parseInt(temp[1], 10) - 1;
  }
  var date = new Date(temp[0], temp[1], temp[2]);
  return date;
}

export function getDiffDate(start, end) {
  var startTime = getDate(start);
  var endTime = getDate(end);
  var dates = [];
  while (endTime.getTime() - startTime.getTime() > 0) {
    var year = startTime.getFullYear();
    var month = startTime.getMonth();
    var day = startTime.getDate();

    if (year > currentYear) {
      walk();
    } else if (year === currentYear) {
      if (month > currentMonth) {
        walk();
      } else if (month === currentMonth) {
        if (day > currentDay) {
          walk();
        } else if (day === currentDay) {
          if (currentHours < 16) {
            walk();
          } else if (currentHours === 16 && currentMinutes < 1) {
            walk();
          }
        }
      }
    }

    function walk() {
      month = month < 9 ? "0" + (month + 1) : month + 1;
      day = day < 10 ? "0" + day : day;
      var date = year + "-" + month + "-" + day;
      var transformDate = new Date(Date.parse(date));
      var weekday = weekdays[transformDate.getDay()];
      if (weekday !== "星期日" && !holidays.includes(date)) {
        dates.push({ value: date, label: date + " " + weekday });
      }
    }

    startTime.setDate(startTime.getDate() + 1);
  }
  return dates;
}

/**
 * 根据当前时间往后推多少天之后的日期
 * @param {*} days
 */
export function getDateByDays(days) {
  var date1 = new Date();
  var date2 = new Date(date1);
  date2.setDate(date1.getDate() + days);
  var year = date2.getFullYear();
  var month = zeroPadding(date2.getMonth() + 1);
  var day = zeroPadding(date2.getDate());
  return `${year}-${month}-${day}`;
}
