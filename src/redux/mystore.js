import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import rootReducer from "./rootReducer";
import navbar from "./navbar";
import layout from "./layout";
import auth from "./authentication";

const reducers = combineReducers(rootReducer);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authReducer"], // only these reducers will be persisted
  blacklist: ["navbar", "layout", "auth", "appformSlice", "dashboardSlice"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
