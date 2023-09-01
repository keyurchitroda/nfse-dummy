// ** React Imports
import { lazy } from "react";
import { Navigate } from "react-router-dom";
const UserList = lazy(() => import("../../views/apps/user/list"));
const WizardForm = lazy(() => import("../../views/apps/wizard"));
const ApplicationDetail = lazy(() =>
  import("../../views/apps/application-detail")
);
const Profile = lazy(() => import("../../views/apps/profile"));
const Mamlatdar = lazy(() => import("../../views/apps/mamlatdar/list"));
const Draft = lazy(() => import("../../views/apps/draft/list"));
const Home = lazy(() => import("../../views/pages/home/Home"));

const AppRoutes = [
  {
    element: <UserList />,
    path: "/dashboard",
    meta: {
      publicRoute: true,
      layout: "vertical",
    },
  },
  {
    element: <WizardForm />,
    path: "/add",
    meta: {
      publicRoute: true,
      layout: "vertical",
    },
  },
  {
    element: <ApplicationDetail />,
    path: "/application-detail/:id",
    meta: {
      publicRoute: true,
      layout: "vertical",
    },
  },
  {
    element: <Profile />,
    path: "/profile",
    meta: {
      publicRoute: true,
      layout: "vertical",
    },
  },
  {
    element: <Mamlatdar />,
    path: "/adduser",
    meta: {
      publicRoute: true,
      layout: "vertical",
    },
  },
  {
    element: <Draft />,
    path: "/draft",
    meta: {
      publicRoute: true,
      layout: "vertical",
    },
  },
  {
    element: <Home />,
    path: "/home",
    meta: {
      publicRoute: true,
      layout: "blank",
    },
  },
];

export default AppRoutes;
