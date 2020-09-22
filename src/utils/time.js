export function formatTime(timespan) {
  let dateTime = new Date(timespan * 1000);
  let year = dateTime.getFullYear();
  let month = dateTime.getMonth() + 1;
  let day = dateTime.getDate();
  let millisecond = dateTime.getTime();
  let now = new Date();
  let nowNew = now.getTime();
  let milliseconds = 0;
  let timeSpanStr;
  milliseconds = nowNew - millisecond;
  if (milliseconds <= 1000 * 60 * 1) {
    timeSpanStr = "刚刚";
  } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60)) + "分钟前";
  } else if (
    1000 * 60 * 60 * 1 < milliseconds &&
    milliseconds <= 1000 * 60 * 60 * 24
  ) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + "小时前";
  } else if (
    1000 * 60 * 60 * 24 < milliseconds &&
    milliseconds <= 1000 * 60 * 60 * 24 * 3
  ) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + "天前";
  } else if (
    milliseconds > 1000 * 60 * 60 * 24 * 3 &&
    year === now.getFullYear()
  ) {
    timeSpanStr = month + "月" + day + "日";
  } else {
    timeSpanStr = year + "年" + month + "月" + day + "日";
  }
  return timeSpanStr;
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;
const currentDay = currentDate.getDate();

export function getDateInterval(
  year = currentYear,
  month = currentMonth,
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
    label: '31',
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