// ** React Imports
import { Navigate } from "react-router-dom";
import { useContext, Suspense } from "react";

// ** Context Imports
import { AbilityContext } from "@src/utility/context/Can";

// ** Spinner Import
import Spinner from "../spinner/Loading-spinner";

const PrivateRoute = ({ children, route }) => {
  // ** Hooks & Vars
  const ability = useContext(AbilityContext);
  const user = JSON.parse(localStorage.getItem("userData"));
  const userDetails = useSelector((state) => state.authReducer.user_details);

  if (route) {
    let action = null;
    let resource = null;
    let restrictedRoute = false;

    if (route.meta) {
      action = route.meta.action;
      resource = route.meta.resource;
      restrictedRoute = route.meta.restricted;
    }
    if (!userDetails) {
      return <Navigate to="/login" />;
    }
    if (userDetails && restrictedRoute) {
      return <Navigate to="/dashboard" />;
    }
    if (userDetails && restrictedRoute && userDetails.role === "client") {
      return <Navigate to="/access-control" />;
    }
    if (userDetails && !ability.can(action || "read", resource)) {
      return <Navigate to="/misc/not-authorized" replace />;
    }
  }

  return (
    <Suspense fallback={<Spinner className="content-loader" />}>
      {children}
    </Suspense>
  );
};

export default PrivateRoute;
