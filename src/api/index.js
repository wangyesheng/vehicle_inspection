import { request } from "../utils/request";

export function loginRes(data) {
  return request({
    url: "/api.php?p=/Member/xcx_login",
    method: "GET",
    data,
  });
}

export function bindMobileRes(data) {
  return request({
    url: "/api.php?p=/Member/updateMobile",
    method: "POST",
    data,
  });
}

/**
 * 新增
 * @param {*} data
 */
export function addCarRes(data) {
  return request({
    url: "/api.php?p=/Car/addCar",
    method: "POST",
    data,
  });
}

/**
 * 编辑
 * @param {*} data
 */
export function editCarRes(data) {
  return request({
    url: "/api.php?p=/Car/saveCar",
    method: "POST",
    data,
  });
}

export function getCarInfoRes(data) {
  return request({
    url: "/api.php?p=/Car/carInfo",
    method: "GET",
    data,
  });
}

export function getVerificationCodeRes(data) {
  return request({
    url: "/api.php?p=/Car/sendSms",
    method: "POST",
    data,
  });
}

export function getCarsRes(data) {
  return request({
    url: "/api.php?p=/Car/getCarList",
    method: "GET",
    data,
  });
}

export function getInspectionStationsRes(data) {
  return request({
    url: "/api.php?p=/Pigsar/getPigsarList",
    method: "GET",
    data,
  });
}

export function getInspectionStationInfoRes(data) {
  return request({
    url: "/api.php?p=/Pigsar/getPigsarInfo",
    method: "GET",
    data,
  });
}

export function saveAppointmentRes(data) {
  return request({
    url: "/api.php?p=/Pigsar/reservePigsar",
    method: "POST",
    data,
  });
}

export function getMyAppointmentsRes(data) {
  return request({
    url: "/api.php?p=/Pigsar/reserveList",
    method: "GET",
    data,
  });
}
