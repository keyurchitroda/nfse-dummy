import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  filterApplicationListByUserService,
  getAllAdminUserService,
  getApplicationDetails,
  getApplicationListByUserService,
  getApproveReasons,
  getProfileDetails,
  getRejectReasons,
  updateApplicationsStatus,
  updateProfileDetails,
} from "../../services/dashboardService";
import { setSingleApplicationFormValue } from "./appformSlice";

const initialState = {
  isLoading: false,
  isFormLoading: false,
  applicationlistByLoginUser: [],
  count: 0,
  currentPage: 1,
  profileDetails: {},
  applicationDetails: {},
  rejectReason: {},
  approveReason: {},
  allAdminUser: [],
  adminUserCount: 0,
  adminUserCurrentPage: 1,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    startFormLoading(state) {
      state.isFormLoading = true;
    },
    stopFormLoading(state) {
      state.isFormLoading = false;
    },
    ApplicationListByUserSuccess: (state, action) => {
      state.applicationlistByLoginUser = action.payload;
    },
    TotalCountSuccess: (state, action) => {
      state.count = action.payload;
    },
    CurrentPageSuccess: (state, action) => {
      state.currentPage = action.payload;
    },
    ProfileDetailsSuccess: (state, action) => {
      state.profileDetails = action.payload;
    },
    ApplicationDetailsSuccess: (state, action) => {
      state.applicationDetails = action.payload;
    },
    RejectReasonSuccess: (state, action) => {
      state.rejectReason = action.payload;
    },
    ApproveReasonSuccess: (state, action) => {
      state.approveReason = action.payload;
    },
    GetAllAdminUserSuccess: (state, action) => {
      state.allAdminUser = action.payload;
    },
    TotalCountAdminUserSuccess: (state, action) => {
      state.adminUserCount = action.payload;
    },
    CurrentPageAdminUserSuccess: (state, action) => {
      state.adminUserCurrentPage = action.payload;
    },
  },
});

// Reducer
export default dashboardSlice.reducer;

//Action
const {
  GetAllAdminUserSuccess,
  TotalCountAdminUserSuccess,
  CurrentPageAdminUserSuccess,
  ApplicationListByUserSuccess,
  TotalCountSuccess,
  CurrentPageSuccess,
  ProfileDetailsSuccess,
  startLoading,
  stopLoading,
  startFormLoading,
  stopFormLoading,
  ApplicationDetailsSuccess,
  RejectReasonSuccess,
  ApproveReasonSuccess,
} = dashboardSlice.actions;

export const getApplicationListByUser = (page) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const response = await getApplicationListByUserService(page);
    if (response) {
      await dispatch(ApplicationListByUserSuccess(response.results));
      await dispatch(TotalCountSuccess(response.count));
      await dispatch(CurrentPageSuccess(page));
      dispatch(stopLoading());
    } else {
      toast.error("error");
    }
  } catch (e) {
    dispatch(stopLoading());
    console.log("e", e);
    toast.error(e.message.error);
  }
};

export const filterApplicationListByUser =
  (page, data, startDate, endDate) => async (dispatch) => {
    try {
      dispatch(startLoading());
      const response = await filterApplicationListByUserService(
        page,
        data,
        startDate,
        endDate
      );
      if (response) {
        await dispatch(ApplicationListByUserSuccess(response.results));
        await dispatch(TotalCountSuccess(response.count));
        await dispatch(CurrentPageSuccess(page));
        dispatch(stopLoading());
      } else {
        toast.error("error");
      }
    } catch (e) {
      dispatch(stopLoading());
      console.log("e", e);
      toast.error(e.message.error);
    }
  };

export const getProfileValues = () => async (dispatch) => {
  try {
    dispatch(startLoading());
    dispatch(startFormLoading());
    const response = await getProfileDetails();
    const singleValue = {
      address: response.address,
      district: response.district,
      firstname: response.firstname,
      middlename: response.middlename,
      lastname: response.lastname,
      taluka: response.taluka,
      zone: response.zone,
    };
    if (response) {
      await dispatch(ProfileDetailsSuccess(response));
      await dispatch(setSingleApplicationFormValue(singleValue));

      dispatch(stopLoading());
      dispatch(stopFormLoading());
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    dispatch(stopLoading());
    dispatch(stopFormLoading());
    toast.error(e.message.error);
  }
};

export const updateProfileValues = (data, value) => async (dispatch) => {
  try {
    dispatch(startLoading());
    dispatch(startFormLoading());
    const response = await updateProfileDetails(data);
    const singleValue = {
      address: response.address,
      district: value.district,
      firstname: response.firstname,
      middlename: response.middlename,
      lastname: response.lastname,
      taluka: value.taluka,
      zone: value.zone,
    };
    if (response) {
      toast.success("Profile successfully updated..!");
      await dispatch(ProfileDetailsSuccess(response));
      await dispatch(setSingleApplicationFormValue(singleValue));
      dispatch(stopLoading());
      dispatch(stopFormLoading());
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    dispatch(stopLoading());
    dispatch(stopFormLoading());
    toast.error(e.message.error);
  }
};

export const getApplicationDetail = (id) => async (dispatch) => {
  try {
    console.log("id", id);
    dispatch(startLoading());
    dispatch(startFormLoading());
    const response = await getApplicationDetails(id);
    if (response) {
      await dispatch(ApplicationDetailsSuccess(response));
      dispatch(stopLoading());
      dispatch(stopFormLoading());
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    dispatch(stopLoading());
    dispatch(stopFormLoading());
    toast.error(e.message.error);
  }
};

export const getApproveReason = () => async (dispatch) => {
  try {
    dispatch(startLoading());
    dispatch(startFormLoading());
    const response = await getApproveReasons();
    const newresponse = response.map((item) => ({
      value: item.id,
      label: item.reason_text,
    }));
    if (response) {
      await dispatch(ApproveReasonSuccess(newresponse));
      dispatch(stopLoading());
      dispatch(stopFormLoading());
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    dispatch(stopLoading());
    dispatch(stopFormLoading());
    toast.error(e.message.error);
  }
};

export const getRejectReason = () => async (dispatch) => {
  try {
    dispatch(startLoading());
    dispatch(startFormLoading());
    const response = await getRejectReasons();
    const newresponse = response.map((item) => ({
      value: item.id,
      label: item.reason_text,
    }));
    if (response) {
      await dispatch(RejectReasonSuccess(newresponse));
      dispatch(stopLoading());
      dispatch(stopFormLoading());
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    dispatch(stopLoading());
    dispatch(stopFormLoading());
    toast.error(e.message.error);
  }
};

export const updateApplicationStatus = (id, data) => async (dispatch) => {
  try {
    dispatch(startLoading());
    dispatch(startFormLoading());
    const response = await updateApplicationsStatus(id, data);
    if (response) {
      dispatch(stopLoading());
      dispatch(stopFormLoading());
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    dispatch(stopLoading());
    dispatch(stopFormLoading());
    toast.error(e.message.error);
  }
};

export const getAllAdminUsers = (page) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const response = await getAllAdminUserService(page);
    if (response) {
      await dispatch(GetAllAdminUserSuccess(response.results));
      await dispatch(TotalCountAdminUserSuccess(response.count));
      await dispatch(CurrentPageAdminUserSuccess(page));
      dispatch(stopLoading());
    } else {
      toast.error("error");
    }
  } catch (e) {
    dispatch(stopLoading());
    console.log("e", e);
    toast.error(e.message.error);
  }
};
