import Cookies from "js-cookie";

export const setCookie = (name, token, expireTime) => {
  Cookies.set(name, token, { expires: expireTime });
};

export const getCookie = (name) => {
  return Cookies.get(name);
};

export const removeCookie = (name) => {
  return Cookies.remove(name);
};
