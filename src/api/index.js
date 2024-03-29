import {
  request
} from '../utils/request';

export function loginRes(data) {
  return request({
    url: '/api.php?p=/Member/xcx_login',
    method: 'GET',
    data,
  });
}

export function bindMobileRes(data) {
  return request({
    url: '/api.php?p=/Member/updateMobile',
    method: 'POST',
    data,
  });
}

export function autoBindMobileRes(data) {
  return request({
    url: '/api.php?p=/Member/wxUpdateMobile',
    method: 'GET',
    data,
  });
}

/**
 * 新增
 * @param {*} data
 */
export function addCarRes(data) {
  return request({
    url: '/api.php?p=/Car/addCar',
    method: 'POST',
    data,
  });
}

/**
 * 编辑
 * @param {*} data
 */
export function editCarRes(data) {
  return request({
    url: '/api.php?p=/Car/saveCar',
    method: 'POST',
    data,
  });
}

export function deleteCarRes(data) {
  return request({
    url: '/api.php?p=/Car/delCar',
    method: 'GET',
    data,
  });
}

export function getCarInfoRes(data) {
  return request({
    url: '/api.php?p=/Car/carInfo',
    method: 'GET',
    data,
  });
}

export function getVerificationCodeRes(data) {
  return request({
    url: '/api.php?p=/Car/sendSms',
    method: 'POST',
    data,
  });
}

export function getCarsRes(data) {
  return request({
    url: '/api.php?p=/Car/getCarList',
    method: 'GET',
    data,
  });
}

export function getStationsRes(data) {
  return request({
    url: '/api.php?p=/Pigsar/getPigsarList',
    method: 'GET',
    data,
  });
}

export function getInspectionStationInfoRes(data) {
  return request({
    url: '/api.php?p=/Pigsar/getPigsarInfo',
    method: 'GET',
    data,
  });
}

export function saveAppointmentRes(data) {
  return request({
    url: '/api.php?p=/Pigsar/reservePigsar',
    method: 'POST',
    data,
  });
}

export function getMyAppointmentsRes(data) {
  return request({
    url: '/api.php?p=/Pigsar/reserveList',
    method: 'GET',
    data,
  });
}

export function getNoticesRes(data) {
  return request({
    url: '/api.php?p=/Notice/getNoticeList',
    method: 'GET',
    data,
  });
}

export function cancelAppointmentRes(data) {
  return request({
    url: '/api.php?p=/Pigsar/cancelReserve',
    method: 'GET',
    data,
  });
}

export function deleteAppointmentRes(data) {
  return request({
    url: '/api.php?p=/Pigsar/deleteReserve',
    method: 'GET',
    data,
  });
}

export function getMyCustomersRes(data) {
  return request({
    url: '/api.php?p=/Member/myOfflineList',
    method: 'GET',
    data,
  });
}

export function getMyCompaniesRes(data) {
  return request({
    url: '/api.php?p=/Member/myCompanyList',
    method: 'GET',
    data,
  });
}

export function getEmployeesByCIdRes(data) {
  return request({
    url: '/api.php?p=/Member/companyMemberList',
    method: 'GET',
    data,
  });
}

export function setCarDealRes(data) {
  return request({
    url: '/api.php?p=/Car/setCarDeal',
    method: 'GET',
    data,
  });
}

export function getCustomerRes(data) {
  return request({
    url: '/api.php?p=/Notice/getCustomer',
    method: 'GET',
    data,
  });
}

export function bindCodeCarRes(data) {
  return request({
    url: '/api.php?p=/code/bindCodeCar',
    method: 'GET',
    data,
  });
}

export function getCodeInfoRes(data) {
  return request({
    url: '/api.php?p=/code/getCodeInfo',
    method: 'GET',
    data,
  });
}

export const getMyCodesRes = data =>
  request({
    url: '/api.php?p=/code/getMyCodeList',
    method: 'GET',
    data,
  });

export const unbindCodeCarRes = data =>
  request({
    url: '/api.php?p=/code/unbindCodeCar',
    method: 'GET',
    data,
  });

export const updateCodeStateRes = data =>
  request({
    url: '/api.php?p=/code/updateCodeState',
    method: 'GET',
    data,
  });

export const getVirtualMobileRes = data =>
  request({
    url: '/api.php?p=/Code/scanCode',
    method: 'GET',
    data,
  });

export const getMyCodeCountRes = data =>
  request({
    url: '/api.php?p=/code/getMyCodeCount',
    method: 'GET',
    data,
  });

export const addCarAgencyRes = data =>
  request({
    url: '/api.php?p=/car/addCarAgency',
    method: 'POST',
    data,
  });

export const getCarAgencies = data =>
  request({
    url: '/api.php?p=/car/carAgencyList',
    method: 'GET',
    data,
  });

export const cancelCarAgency = data =>
  request({
    url: '/api.php?p=/car/cancelCarAgency',
    method: 'GET',
    data,
  });

export const deleteCarAgency = data =>
  request({
    url: '/api.php?p=/car/delAgency',
    method: 'GET',
    data,
  });

export const bindInviterCodeRes = data =>
  request({
    url: '/api.php?p=/code/bindInviterCode',
    method: 'GET',
    data,
  });

export const bindInviterRes = data =>
  request({
    url: '/api.php?p=/code/bindInviter',
    method: 'GET',
    data,
  });

export const callVirtualMobileRes = data =>
  request({
    url: '/api.php?p=/Code/callVirtualMobile',
    method: 'GET',
    data,
  });

export const getLatestActivityRes = data =>
  request({
    url: '/api.php?p=/pigsar/getActivityInfo',
    method: 'GET',
    data,
  });

export const getIsCheckRes = data =>
  request({
    url: '/api.php?p=/member/getIsCheck',
    method: 'GET',
    data,
  });

export const getUserinfoRes = data =>
  request({
    url: '/api.php?p=/member/getUserInfo',
    method: 'GET',
    data,
  });

export const getMyActivityRes = data =>
  request({
    url: '/api.php?p=/Member/getMyActivity',
    method: 'GET',
    data,
  });