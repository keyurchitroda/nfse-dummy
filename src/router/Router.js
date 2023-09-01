// ** Router imports
import { lazy } from "react";

// ** Router imports
import { useRoutes, Navigate } from "react-router-dom";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "../utility/Utils";

// ** GetRoutes
import { getRoutes } from "./routes";
import Register from "../views/pages/authentication/Register";
import TwoStepsBasic from "../views/pages/authentication/TwoStepsBasic";

// ** Components
const Error = lazy(() => import("../views/pages/misc/Error"));
const Login = lazy(() => import("../views/pages/authentication/Login"));
const Home = lazy(() => import("../views/pages/home/Home"));
const AdminLogin = lazy(() =>
  import("../views/pages/authentication/LoginBasic")
);
const NotAuthorized = lazy(() => import("../views/pages/misc/NotAuthorized"));
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "../config/cookies";

const Router = () => {
  // ** Hooks
  const { layout } = useLayout();

  const userDetails = useSelector((state) => state.authReducer.user_details);

  const token = getCookie("token");

  const allRoutes = getRoutes(layout);
  const getHomeRoute = () => {
    // const user = getUserData();
    if (token) {
      return getHomeRouteForLoggedInUser(userDetails.role);
    } else {
      return "/home";
    }
  };

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    {
      path: "/login",
      element: <BlankLayout />,
      children: [{ path: "/login", element: <Login /> }],
    },
    {
      path: "/home",
      element: <BlankLayout />,
      children: [{ path: "/home", element: <Home /> }],
    },
    {
      path: "/admin-login",
      element: <BlankLayout />,
      children: [{ path: "/admin-login", element: <AdminLogin /> }],
    },
    {
      path: "/register",
      element: <BlankLayout />,
      children: [{ path: "/register", element: <Register /> }],
    },
    {
      path: "/otpverify",
      element: <BlankLayout />,
      children: [{ path: "/otpverify", element: <TwoStepsBasic /> }],
    },
    {
      path: "/auth/not-auth",
      element: <BlankLayout />,
      children: [{ path: "/auth/not-auth", element: <NotAuthorized /> }],
    },
    {
      path: "*",
      element: <BlankLayout />,
      children: [{ path: "*", element: <Error /> }],
    },
    // ...allRoutes,
  ]);

  const routeNew = useRoutes([...allRoutes]);

  let finalRoute;
  if (token) {
    finalRoute = routeNew;
  } else {
    finalRoute = routes;
  }

  return finalRoute;
};

export default Router;
