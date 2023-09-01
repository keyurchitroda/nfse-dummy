import axiosInstance from "../config/axios";

export const getApplicationListByUserService = (page, data) => {
  return axiosInstance.get(`/nfsaform/applications/byrole/?page=${page}`);
};

export const filterApplicationListByUserService = (
  page,
  data,
  startDate,
  endDate
) => {
  console.log("data-=-=-=", data);
  const districtLabel = data?.district?.value || null;
  const talukaLabel = data?.taluka?.value || null;
  const zoneLabel = data?.zone?.value || null;
  const statusLabel = data?.status?.value || null;
  let url = `/nfsaform/applications/byrole/?page=${page}`;
  if (districtLabel !== null) {
    url += `&district=${encodeURIComponent(districtLabel)}`;
  }
  if (talukaLabel !== null) {
    url += `&taluka=${encodeURIComponent(talukaLabel)}`;
  }
  if (zoneLabel !== null) {
    url += `&zone=${encodeURIComponent(zoneLabel)}`;
  }
  if (statusLabel !== null) {
    if (statusLabel === "Approve") {
      url += `&is_approved=True`;
    } else {
      url += `&is_rejected=True`;
    }
  }
  if (startDate || endDate) {
    url += `&created_at=custom&start_date=${startDate}&end_date=${endDate}`;
  }
  return axiosInstance.get(`${url}`);
};

export const getProfileDetails = () => {
  return axiosInstance.get(`/accounts/profile/`);
};

export const updateProfileDetails = (data) => {
  return axiosInstance.patch(`/accounts/editprofile/`, data);
};

export const getApplicationDetails = (id) => {
  return axiosInstance.get(`/nfsaform/allapplications/${id}/`);
};

export const getTrackingStatusValues = (id) => {
  return axiosInstance.get(`/appmanagement/application/status/${id}/`);
};

export const getCardCounts = (id) => {
  return axiosInstance.get(`/nfsaform/application-count/`);
};

export const getRejectReasons = () => {
  return axiosInstance.get(`/appmanagement/reasons/?status=0`);
};

export const getApproveReasons = () => {
  return axiosInstance.get(`/appmanagement/reasons/?status=1`);
};

export const updateApplicationsStatus = (id, body) => {
  return axiosInstance.patch(
    `/appmanagement/applications/app-status/${id}/`,
    body
  );
};

export const addNewUserByAdmin = (body) => {
  return axiosInstance.post(`/accounts/adduser/`, body);
};

export const getAllAdminUserService = (page) => {
  return axiosInstance.get(`/accounts/nonuserlist/?page=${page}`);
};

export const getRejectReasonService = (id) => {
  return axiosInstance.get(`/appmanagement/applications/appstatus/${id}/`);
};
