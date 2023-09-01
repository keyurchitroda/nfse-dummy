// ** React Imports
import { Suspense } from "react";
import { Navigate } from "react-router-dom";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "@utils";
import { useSelector } from "react-redux";

const PublicRoute = ({ children, route }) => {
  const userDetails = useSelector((state) => state.authReducer.user_details);
  if (route) {
    const user = getUserData();

    const restrictedRoute = route.meta && route.meta.restricted;

    if (userDetails && restrictedRoute) {
      return <Navigate to={getHomeRouteForLoggedInUser(userDetails.role)} />;
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>;
};

export default PublicRoute;
