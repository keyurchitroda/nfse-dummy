import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  getApplicationDraftListService,
} from "../../services/draftService";

const initialState = {
  isLoading: false,
  applicationDraftList: [],
  count: 0,
  currentPage: 1,
  profileDetails: {},
};

const draftSlice = createSlice({
  name: "draft",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    ApplicationDraftListBySuccess: (state, action) => {
      state.applicationDraftList = action.payload;
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
  },
});

// Reducer
export default draftSlice.reducer;

//Action
const {
  ApplicationDraftListBySuccess,
  TotalCountSuccess,
  CurrentPageSuccess,
  ProfileDetailsSuccess,
  startLoading, stopLoading
} = draftSlice.actions;

export const getApplicationDraftList = (page) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const response = await getApplicationDraftListService(page);
    if (response) {
      await dispatch(ApplicationDraftListBySuccess(response.results));
      await dispatch(TotalCountSuccess(response.count));
      await dispatch(CurrentPageSuccess(page));
      dispatch(stopLoading());
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    dispatch(stopLoading());
    toast.error(e.message.error);
  }
};