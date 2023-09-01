import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  createApplicationFormService,
  editApplicationFormService,
  getAllDistrictService,
  getAllTalukaService,
  getAllZonalOfficersService,
  getAllZoneService,
  getSingleApplicationService,
} from "../../services/appformService";

const initialState = {
  isLoading: false,
  isFormLoading: false,
  districts: [],
  talukas: [],
  zones: [],
  zonelOfficers: [],
  createAppForm: {},
  singleApplication: {},
  isModalOpen: false,
  displayImageView: {
    incomeCertificate: "",
    uploadAadharCard: "",
    disabilityCertificate: "",
    rentAgreement: "",
    lightBill: "",
  },
};

const appformSlice = createSlice({
  name: "auth",
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
    modalOpen(state) {
      state.isModalOpen = true;
    },
    modalclose(state) {
      state.isModalOpen = false;
    },
    DistirctSuccess: (state, action) => {
      state.districts = action.payload;
    },
    TalukaSuccess: (state, action) => {
      state.talukas = action.payload;
    },
    ZoneSuccess: (state, action) => {
      state.zones = action.payload;
    },
    ZonelOfficerSuccess: (state, action) => {
      state.zonelOfficers = action.payload;
    },
    CreateAppFormSuccess: (state, action) => {
      state.createAppForm = action.payload;
    },
    SignleAppFormListSuccess: (state, action) => {
      state.singleApplication = action.payload;
    },
    displayBlobUrlSuccess: (state, action) => {
      return {
        ...state,
        displayImageView: {
          ...state.displayImageView,
          ...action.payload,
        },
      };
    },
    clearViewImage: (state, action) => {
      state.displayImageView = {
        incomeCertificate: "",
        uploadAadharCard: "",
        disabilityCertificate: "",
        rentAgreement: "",
        lightBill: "",
      };
    },
  },
});

// Reducer
export default appformSlice.reducer;

//Action
const {
  DistirctSuccess,
  TalukaSuccess,
  ZoneSuccess,
  ZonelOfficerSuccess,
  CreateAppFormSuccess,
  SignleAppFormListSuccess,
  startLoading,
  stopLoading,
  modalOpen,
  modalclose,
  startFormLoading,
  stopFormLoading,
  displayBlobUrlSuccess,
  clearViewImage,
} = appformSlice.actions;

export const getDistrictList = () => async (dispatch) => {
  try {
    const response = await getAllDistrictService();
    const newresponse = response.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    if (newresponse) {
      await dispatch(DistirctSuccess(newresponse));
    } else {
      toast.error("error");
    }
  } catch (e) {
    toast.error(e.message.error);
  }
};

export const getTalukaList = (id) => async (dispatch) => {
  try {
    const response = await getAllTalukaService(id);
    const newresponse = response.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    if (newresponse) {
      await dispatch(TalukaSuccess(newresponse));
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    toast.error(e.message.error);
  }
};

export const getZonesList = (id) => async (dispatch) => {
  try {
    const response = await getAllZoneService(id);
    const newresponse = response.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    if (response) {
      await dispatch(ZoneSuccess(newresponse));
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    toast.error(e.message.error);
  }
};

export const getZonelOfficerList = (id) => async (dispatch) => {
  try {
    const response = await getAllZonalOfficersService(id);
    const newresponse = response.map((item) => ({
      value: item.id,
      label: `${item.firstname} ${item.middlename} ${item.lastname}`,
    }));
    if (response) {
      await dispatch(ZonelOfficerSuccess(newresponse));
    } else {
      toast.error("error");
    }
  } catch (e) {
    console.log("e", e);
    toast.error(e.message.error);
  }
};

export const createApplicationForm =
  (data, stepper, isLast, navigate) => async (dispatch) => {
    try {
      dispatch(startLoading());
      dispatch(startFormLoading());
      const response = await createApplicationFormService(data);
      console.log("response", response);
      if (response.status === 1) {
        await dispatch(CreateAppFormSuccess(response.data));
        dispatch(stopLoading());
        dispatch(stopFormLoading());
        if (isLast) {
          navigate("/dashboard");
        } else {
          stepper.next();
        }
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

export const editApplicationForm =
  (data, stepper, isLast, navigate, id) => async (dispatch) => {
    try {
      dispatch(startLoading());
      dispatch(startFormLoading());
      const response = await editApplicationFormService(data, id);
      if (response.status === 1) {
        await dispatch(CreateAppFormSuccess(response.data));
        dispatch(stopLoading());
        dispatch(stopFormLoading());
        if (isLast) {
          dispatch(modalOpen());
          // navigate("/dashboard");
        } else {
          stepper.next();
        }
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

export const getSingleApplicationList = (id) => async (dispatch) => {
  try {
    dispatch(startLoading());
    dispatch(startFormLoading());
    const response = await getSingleApplicationService(id);
    const viewImage = {
      incomeCertificate: response?.incomecerty_upload,
      uploadAadharCard: response?.adharcard_upload,
      disabilityCertificate: response?.disabilitycerty_upload,
      rentAgreement: response?.rentagreement,
      lightBill: response?.lightbill,
    };
    if (response) {
      await dispatch(SignleAppFormListSuccess(response));
      await dispatch(CreateAppFormSuccess(response));
      await dispatch(displayBlobUrlSuccess(viewImage));
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

export const setSingleApplicationFormValue = (values) => async (dispatch) => {
  await dispatch(SignleAppFormListSuccess(values));
};

export const OpneModal = () => async (dispatch) => {
  try {
    dispatch(modalOpen());
  } catch (e) {}
};
export const CloseModal = () => async (dispatch) => {
  try {
    dispatch(modalclose());
  } catch (e) {}
};

export const clearFormValueOnUnmout = () => async (dispatch) => {
  try {
    await dispatch(SignleAppFormListSuccess({}));
    await dispatch(CreateAppFormSuccess({}));
    await dispatch(clearViewImage());
  } catch (e) {}
};

export const displayImageOrPdfUrl =
  (url, key) => async (dispatch, getState) => {
    try {
      const oldDisplayImageView = getState().displayImageView;
      const updatedDisplayImageView = { ...oldDisplayImageView, [key]: url };
      await dispatch(displayBlobUrlSuccess(updatedDisplayImageView));
    } catch (e) {}
  };
