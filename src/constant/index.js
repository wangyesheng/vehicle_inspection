export const BUTTON_FLAGS = [
  {
    value: -1,
    label: "添加车辆",
  },
  {
    // 0 未到期，不可预约 || 2 已办理
    value: 0,
    label: "未到期，不可预约",
  },
  {
    // 已预约 is_pass = 1   当前日期 + 30 - days
    value: 1,
    label: "查看预约详情",
  },
  {
    // 3 可预约 || 4 已逾期
    value: 2,
    label: "立即免费预约",
  },
];

export const APPOINTMENT_TIMES = [
  { key: "1", value: "08:00-09:00" },
  { key: "2", value: "09:00-10:00" },
  { key: "3", value: "10:00-11:00" },
  { key: "4", value: "11:00-12:00" },
  { key: "5", value: "13:00-14:00" },
  { key: "6", value: "14:00-15:00" },
  { key: "7", value: "15:00-16:00" },
  { key: "8", value: "16:00-17:00" },
];
