import guestAxiosInstance from "../config/guestAxios";

export const signupService = (data) => {
  return guestAxiosInstance.post("/accounts/signup/", data);
};

export const signinService = (data) => {
  return guestAxiosInstance.post("/accounts/login/", data);
};

export const otpVerifyService = (data) => {
  return guestAxiosInstance.post("/accounts/verify-otp/", data);
};
