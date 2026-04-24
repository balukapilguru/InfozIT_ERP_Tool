import React from "react";
import BackButton from "../../../../components/backbutton/BackButton";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const StudentViewTabs = () => {
  // views

  const location = useLocation();
  const currentPath = location.pathname;

  const searchParams = new URLSearchParams(location.search);
  const studentId = searchParams.get("studentId");


  return (
    <div className="">
      <BackButton heading="Student Details" content="Back" />
      <div className="container-fluid ">
        <div className="card  mb-0">
          <div className="d-flex border-bottom">
            <ul className="d-flex flex-row m-3" id="pills-tab" role="tablist">
              {/* View Tab */}
              <li role="presentation" className="me-2">
                <NavLink
                  to={`/student/views?studentId=${studentId}`}
                  className={({ isActive }) =>
                    `fw-medium px-3 py-2 rounded-3 ${
                      isActive || currentPath === "/student/views"
                        ? "active-tab"
                        : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    color:
                      isActive && currentPath === "/student/views"
                        ? "#405189"
                        : "#878a99",
                  })}
                >
                  View
                </NavLink>
              </li>
                      
              {/* Activity Tab */}
              <li role="presentation" className="me-2">
                <NavLink
                  to={`/student/views/activity?studentId=${studentId}&page=1&pageSize=10`}
                  className={({ isActive }) =>
                    `fw-medium px-3 py-2 rounded-3 ${
                      isActive || currentPath === "/student/views/activity"
                        ? "active-tab"
                        : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    color:
                      isActive || currentPath === "/student/views/activity"
                        ? "#405189"
                        : "#878a99",
                  })}
                >
                  Activity
                </NavLink>
              </li>

              {/* Remarks Tab */}
              <li role="presentation" className="me-2">
                <NavLink
                  to={`/student/views/remarks?studentId=${studentId}`}
                  className={({ isActive }) =>
                    `fw-medium px-3 py-2 rounded-3 ${
                      isActive || currentPath === "/student/views/remarks"
                        ? "active-tab"
                        : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    color:
                      isActive || currentPath === "/student/views/remarks"
                        ? "#405189"
                        : "#878a99",
                  })}
                >
                  Remarks
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="tab-content mt-3">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentViewTabs;
