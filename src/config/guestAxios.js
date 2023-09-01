/* This instance of Axios will be used for those APIs which doesn't require authorization */
import axios from "axios";
import { config } from "./config";

var guestAxiosInstance = axios.create({
  baseURL: config.API_URL,
});

guestAxiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorObject = {
      code: 500,
      message: "Server not responding",
    };
    if (error.response) {
      errorObject.code = error.response.status;
      errorObject.message = error.response.data;
      return Promise.reject(errorObject);
    } else if (error.request) {
      return Promise.reject(errorObject);
    } else {
      errorObject.message = "Something went wrong";
      return Promise.reject(errorObject);
    }
  }
);

export default guestAxiosInstance;
