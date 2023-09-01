// ** Reducers Imports
import navbar from "./navbar";
import layout from "./layout";
import auth from "./authentication";
import users from "@src/views/apps/user/store";
import authReducer from "./slices/authSlice";
import appformSlice from "./slices/appformSlice";
import dashboardSlice from "./slices/dashboardSlice";
import draftSlice from "./slices/draftSlice";

const rootReducer = {
  // auth,
  users,
  navbar,
  layout,
  authReducer,
  appformSlice,
  dashboardSlice,
  draftSlice,
};

export default rootReducer;
