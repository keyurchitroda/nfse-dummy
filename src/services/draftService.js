import axiosInstance from "../config/axios";

export const getApplicationDraftListService = (page) => {
  return axiosInstance.get(`/nfsaform/draftapplications/?page=${page}`);
};
