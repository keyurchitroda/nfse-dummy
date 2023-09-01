import guestAxiosInstance from "../config/guestAxios";
import axios from "../config/axios";

export const getAllDistrictService = () => {
  return guestAxiosInstance.get("/nfsaform/districts/");
};

export const getAllTalukaService = (id) => {
  return guestAxiosInstance.get(`/nfsaform/talukas/${id}/`);
};

export const getAllZoneService = (id) => {
  return guestAxiosInstance.get(`/nfsaform/zones/${id}/`);
};

export const getAllZonalOfficersService = (id) => {
  return guestAxiosInstance.get(`/accounts/zonalofficers/?zone=${id}`);
};

export const getSingleApplicationService = (id) => {
  return guestAxiosInstance.get(`/nfsaform/allapplications/${id}/`);
};

export const createApplicationFormService = (data) => {
  return axios.post(`/nfsaform/applications/`, data);
};

export const editApplicationFormService = (data, id) => {
  return axios.patch(`/nfsaform/applications/${id}/`, data);
};
