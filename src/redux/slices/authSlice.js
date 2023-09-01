import { createSlice } from "@reduxjs/toolkit";
import { signinService, signupService } from "../../services/authService";
import toast from "react-hot-toast";
import { removeCookie, setCookie } from "../../config/cookies";
// ** UseJWT import to get config
import useJwt from "@src/auth/jwt/useJwt";
import _ from "lodash";

const config = useJwt.jwtConfig;

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user_details: {},
  email: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    LoginSuccess: (state, action) => {
      state.user_details = action.payload;
    },
    RegisterSuccess: (state, action) => {
      state.email = action.payload;
    },
  },
});

// Reducer
export default authSlice.reducer;

//Action
const { LoginSuccess, RegisterSuccess, startLoading, stopLoading } =
  authSlice.actions;

export const LoginUser = (values, navigate, type) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const response = await signinService(values);
    if (response) {
      if (type === response?.role) {
        await dispatch(LoginSuccess(response));
        toast.success(
          "You have successfully logged in as an user to NFSA. Now you can start to explore. Enjoy!"
        );
        setCookie("token", response.access_token);
        setCookie("role", response.role);
        dispatch(stopLoading());
        // navigate("/dashboard");
        window.location.href = "/profile";
      } else {
        dispatch(stopLoading());
        toast.error(
          "You need to be required to visit the admin login page as your role is not user...!"
        );
        navigate("/admin-login");
      }
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    dispatch(stopLoading());
    toast.error(e.message.error);
  }
};

export const AdminLoginUser = (values, navigate, type) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const response = await signinService(values);
    if (response) {
      if (type !== response?.role) {
        await dispatch(LoginSuccess(response));
        toast.success(
          "You have successfully logged in as an user to NFSA. Now you can start to explore. Enjoy!"
        );
        setCookie("token", response.access_token);
        setCookie("role", response.role);
        dispatch(stopLoading());
        window.location.href = "/profile";
      } else {
        dispatch(stopLoading());
        toast.error(
          "You need to be required to visit the user login page as your role is not Admin/ZonalOfficer/Mamlatdar/DeputyMamlatdar...!"
        );
        navigate("/login");
      }
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    dispatch(stopLoading());
    toast.error(e.message.error);
  }
};

export const RegisterUser = (values, navigate) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const response = await signupService(values);
    console.log("response", response);
    if (response.status === 1) {
      await dispatch(RegisterSuccess(response.data.email));
      dispatch(stopLoading());
      toast.success(_.get(response, "message", ""));
      navigate("/otpverify");
    } else {
      dispatch(stopLoading());
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    dispatch(stopLoading());
    toast.error(e.message.error);
    // toast.error(e.message.error);
    // if (e.message.error.email) {
    //   return toast.error(e.message.error.email[0]);
    // }
    // if (e.message.error.mobile_number) {
    //   return toast.error(e.message.error.mobile_number[0]);
    // }
    // if (e.message.error.username) {
    //   return toast.error(e.message.error.username[0]);
    // }
  }
};

export const handleLogout = (navigate) => async (dispatch) => {
  try {
    await dispatch(LoginSuccess({}));
    await removeCookie("token");
    await removeCookie("role");
    navigate("/");
  } catch (e) {
    console.log("e", e);
  }
};
