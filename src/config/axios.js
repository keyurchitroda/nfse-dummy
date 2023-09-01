import axios from "axios";
import { config } from "./config";
import { getCookie } from "./cookies";
import _ from "lodash";
// passing full url to axios overwrite baseUrl

var axiosInstance = axios.create({
  baseURL: config.API_URL,
});
axiosInstance.interceptors.request.use((request) => {
  const token = getCookie("token");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const errorObject = {
      code: 500,
      message: "Server not responding",
    };
    if (_.get(error, "response", "")) {
      return Promise.reject(errorObject);
    } else if (error.request) {
      return Promise.reject(errorObject);
    } else {
      errorObject.message = "Something went wrong";
      return Promise.reject(errorObject);
    }
  }
);

export default axiosInstance;
