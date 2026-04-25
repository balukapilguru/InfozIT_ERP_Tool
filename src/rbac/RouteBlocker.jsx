import { Outlet, Navigate } from "react-router-dom";
import usePermissionCheck from "./usePermissionCheck.jsx";
import { usePermissionsProvider } from "../dataLayer/hooks/usePermissionsProvider.jsx";

const RouteBlocker = ({
  requiredModule,
  requiredPermission,
  submenumodule,
  submenuReqiredPermission,
}) => {
  const { permission } = usePermissionsProvider();

  if (!permission) {
    throw new Error("permission context not provided");
  }

  if (permission?.permissions?.length > 0 && permission?.role) {
    const { allowed } = usePermissionCheck(
      requiredModule,
      requiredPermission,
      submenumodule,
      submenuReqiredPermission
    );
    return allowed ? <Outlet /> : <Navigate to="/422" replace />;
  }
};
export default RouteBlocker;
