import React, { useState } from "react";
import "../../../assets/css/Sidemenu.css";
import { Link, useNavigate } from "react-router-dom";
import { CiSettings } from "react-icons/ci";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { AiOutlineLine } from "react-icons/ai";
import { PiStudentFill } from "react-icons/pi";
import kapilvidyasmalllogo from "../../../assets/images/TeksversityLogoMini.png"
import GateKeeper from "../../../rbac/GateKeeper";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useAuthContext } from "../../../dataLayer/hooks/useAuthContext";
import { usePermissionsProvider } from "../../../dataLayer/hooks/usePermissionsProvider";
import { FaRegCircleQuestion } from "react-icons/fa6";
// import kapilVidya from "../../../assets/images/kapilvidyalogowhite.png"
import TeksversityLogo from "../../../assets/images/TeksversityWhiteLogo.webp"
import { TbMessageReport } from "react-icons/tb";

const Sidemenu = ({ isExpanded }) => {
  const navigate = useNavigate();
  const { AuthState } = useAuthContext();
  const [active, setActive] = useState("");
  const { permission } = usePermissionsProvider();

  const profile = AuthState?.user?.profile;
  // const branchLogoImage = AuthState?.user;
  // const branchLogo = branchLogoImage?.branch_setting?.logoName
  //   ? `https://teksversity.s3.us-east-1.amazonaws.com/branches/logos/${branchLogoImage?.branch_setting?.logoName}`
  //   : null;

  const handleActiveClick = (activeItem) => {
    setActive(activeItem);
    if (activeItem === "BatchManagement") {
      navigate("/batchmanagement/dashboard");
    }
  };

  return (
    <div className="">
      <main className="bg-white">
        <div className="wrapper">
          <aside
            id="sidebar"
            className={`sidebar overflow-auto ${isExpanded ? "expand sidebar_scroll" : "close"
              }`}
          >
            <div className="p-2 ">
              <div className="text-center pt-2">
                <Link to={"/"}>
                  <img
                    src={isExpanded ? TeksversityLogo : kapilvidyasmalllogo}
                    className={
                      isExpanded
                        ? "img-fluid logo_css"
                        : "mini_logo_css open img-fluid"
                    }
                    alt="Comapny Logo"
                    onError={(e) => {
                      e.target.src = isExpanded ? TeksversityLogo : kapilvidyasmalllogo;
                    }}
                  />
                </Link>
              </div>
            </div>
            <hr className="text-white" />
            <div className="simplebar-offset">
              <ul className="sidebar-nav simplebar-content-wrapper pt-0 ">
                {/* Dashboard */}

                {/* {profile !== "Human Resource" &&
                  profile !== "Placement Partner" &&
                  profile !== "Trainer" &&
                  profile !== "IIT Guwahati" && (
                    <li
                      className="sidebar-item"
                      onClick={() => handleActiveClick("Dashboard")}
                    >
                      <Link
                        className={` sidebar-link ${active === "Dashboard" ? `text-white` : ""
                          }`}
                        to="/"
                      >
                        {" "}
                        <LuLayoutDashboard className="main_icon" />
                        <span className="title_show"> Dashboard</span>
                      </Link>
                    </li>
                  )} */}

                {
                  profile && profile !== "Trainer" && (
                    <li
                      className="sidebar-item"
                      onClick={() => handleActiveClick("Dashboard")}
                    >
                      <Link
                        className={` sidebar-link ${active === "Dashboard" ? `text-white` : ""
                          }`}
                        to="/"
                      >
                        {" "}
                        <LuLayoutDashboard className="main_icon" title="Dashboard" />
                        <span className="title_show"> Dashboard</span>
                      </Link>
                    </li>
                  )
                }

                {
                  profile && profile === "Trainer" && (
                    <GateKeeper
                      requiredModule="Batch Management"
                      requiredPermission="all"
                    >
                      <li
                        className={`sidebar-item ${active === "BatchMangementTrainerDashBoard"
                          ? "text-white"
                          : ""
                          }`}
                      >
                        <Link
                          to="/batchmanagement/trainer/dashboard"
                          className="sidebar-link"
                          onClick={() =>
                            handleActiveClick(
                              "BatchMangementTrainerDashBoard"
                            )
                          }
                        >
                          <LuLayoutDashboard className="main_icon" title="Dashboard" />
                          <span className="title_show"> Dashboard</span>
                        </Link>
                      </li>
                    </GateKeeper>
                  )
                }


                {/* Student Management */}

                <GateKeeper
                  requiredModule="Student Management"
                  requiredPermission="all"
                >
                  <li
                    className="sidebar-item"
                    onClick={() => handleActiveClick("studentmanagement")}
                  >
                    <Link
                      className={` sidebar-link has-dropdown collapsed ${active === "studentmanagement" ? "text-white" : ""
                        }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#student"
                      aria-expanded="false"
                      aria-controls="student"
                    >
                      <PiStudentFill className="main_icon" title="Student Management" />
                      <span> Student Management</span>
                    </Link>
                    <ul
                      id="student"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      {/* student management dashboard */}

                      {profile !== "IIT Guwahati" && (
                        <GateKeeper
                          requiredModule="Student Management"
                          requiredPermission="all"
                        >
                          <li
                            className={`sidebar-item ${active === "studentManagementDashboard"
                              ? "text-white"
                              : ""
                              }`}
                          >
                            <Link
                              to={"/student/dashboard"}
                              className="sidebar-link"
                              onClick={() =>
                                handleActiveClick("studentManagementDashboard")
                              }
                            >
                              <AiOutlineLine className="sub_icon" />
                              Dashboard
                            </Link>
                          </li>
                        </GateKeeper>
                      )}

                      {/* enrolled Students */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Enrolled Students"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className={`sidebar-item ${active === "enrolledstudents" ? "text-white" : ""
                            }`}
                        >
                          <Link
                            to="/student/list"
                            className="sidebar-link"
                            onClick={() =>
                              handleActiveClick("enrolledstudents")
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Enrolled Students
                          </Link>
                        </li>
                      </GateKeeper>

                      {/* fee details */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Fee Details"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className={`sidebar-item ${active === "feedetails" ? "text-white" : ""
                            }`}
                        >
                          <Link
                            // to="/student/feedetailspage"
                            to={{
                              pathname: `/student/feedetails/list`,
                              search: `?search=&page=1&pageSize=10`,
                            }}
                            className="sidebar-link"
                            onClick={() => handleActiveClick("feedetails")}
                          >
                            {" "}
                            <AiOutlineLine className="sub_icon" />
                            Fee Details
                          </Link>
                        </li>
                      </GateKeeper>

                      {/* student intallment */}

                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Installment"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className={`sidebar-item ${active === "Installmentstudent" ? "text-white" : ""
                            }`}
                        >
                          <Link
                            to="/student/installment"
                            className="sidebar-link"
                            onClick={() =>
                              handleActiveClick("Installmentstudent")
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Installments
                          </Link>
                        </li>
                      </GateKeeper>

                      {/* Certificate  */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Certificate"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className={`sidebar-item ${active === "certificate" ? "text-white" : ""
                            }`}
                        >
                          <Link
                            to="/student/certificate"
                            className="sidebar-link"
                            onClick={() => handleActiveClick("certificate")}
                          >
                            {" "}
                            <AiOutlineLine className="sub_icon" />
                            Certificate
                          </Link>
                        </li>
                      </GateKeeper>

                      {/* Issued Certificate */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Issued Certificate"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className={`sidebar-item ${active === "issuedcertificates" ? "text-white" : ""
                            }`}
                        >
                          <Link
                            to="/student/issuedcertificates"
                            className="sidebar-link"
                            onClick={() =>
                              handleActiveClick("issuedcertificates")
                            }
                          >
                            {" "}
                            <AiOutlineLine className="sub_icon" />
                            Issued Certificate
                          </Link>
                        </li>
                      </GateKeeper>
                      {/* Requested Certificate */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Requested Certificate"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className={`sidebar-item ${active === "requestedcertificate"
                            ? "text-white"
                            : ""
                            }`}
                        >
                          <Link
                            to="/student/requestedcertificate"
                            className="sidebar-link"
                            onClick={() =>
                              handleActiveClick("requestedcertificate")
                            }
                          >
                            {" "}
                            <AiOutlineLine className="sub_icon" />
                            Requested Certificate
                          </Link>
                        </li>
                      </GateKeeper>

                      {/* feedback */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="feedback"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className={`sidebar-item ${active === "feedback" ? "text-white" : ""
                            }`}
                        >
                          <Link
                            to="/student/feedback"
                            className="sidebar-link"
                            onClick={() => handleActiveClick("feedback")}
                          >
                            {" "}
                            <AiOutlineLine className="sub_icon" />
                            Feedback
                          </Link>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* batch management */}
                <GateKeeper
                  requiredModule="Batch Management"
                  requiredPermission="all"
                >
                  <li className="sidebar-item">
                    <Link
                      className={` sidebar-link has-dropdown collapsed ${active === "BatchManagement" ? "text-white" : ""
                        }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#batch"
                      aria-expanded="false"
                      aria-controls="student"
                    >
                      <MdOutlineManageAccounts className="main_icon" title="Batch Management" />
                      <span className="ms-1">Batch Management</span>
                    </Link>

                    <ul
                      id="batch"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      {/* batch management dashboard */}

                      {profile && profile !== "Trainer" && (
                        <GateKeeper
                          requiredModule="Batch Management"
                          requiredPermission="all"
                        >
                          <li
                            className={`sidebar-item ${active === "BatchMangementDashboard"
                              ? "text-white"
                              : ""
                              }`}
                          >
                            <Link
                              to="/batchmanagement/dashboard"
                              className="sidebar-link"
                              onClick={() =>
                                handleActiveClick("BatchMangementDashboard")
                              }
                            >
                              <AiOutlineLine className="sub_icon" />
                              Dashboard
                            </Link>
                          </li>
                        </GateKeeper>
                      )}

                      {/* {profile && profile === "Trainer" && (
                        <GateKeeper
                          requiredModule="Batch Management"
                          requiredPermission="all"
                        >
                          <li
                            className={`sidebar-item ${
                              active === "BatchMangementTrainerDashBoard"
                                ? "text-white"
                                : ""
                            }`}
                          >
                            <Link
                              to="/batchmanagement/trainer/dashboard"
                              className="sidebar-link"
                              onClick={() =>
                                handleActiveClick(
                                  "BatchMangementTrainerDashBoard"
                                )
                              }
                            >
                              <AiOutlineLine className="sub_icon" />
                              Dashboard
                            </Link>
                          </li>
                        </GateKeeper>
                      )} */}



                      {/* Batches */}

                      <GateKeeper
                        requiredModule="Batch Management"
                        requiredPermission="all"
                        submenumodule={[
                          "Batch",
                          "Active Batches",
                          "Upcoming Batches",
                          "Completed Batches",
                        ]}
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className={`sidebar-item ${active === "Batches" ? "text-white" : ""
                            }`}
                        >
                          <Link
                            to="/batchmanagement/batches/activelist"
                            className="sidebar-link"
                            onClick={() => handleActiveClick("Batches")}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Batches
                          </Link>
                        </li>
                      </GateKeeper>

                      {/* Placed Students */}
                      <GateKeeper
                        requiredModule="Batch Management"
                        requiredPermission="all"
                        submenumodule="Placed Students"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className={`sidebar-item ${active === "Batches" ? "text-white" : ""
                            }`}
                        >
                          <Link
                            to="/batchmanagement/placedstudents?page=1&pageSize=10&search="
                            className="sidebar-link"
                            onClick={() => handleActiveClick("Batches")}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Placed Students
                          </Link>
                        </li>
                      </GateKeeper>

                      {/* Attendance */}
                      {/* <GateKeeper
                        requiredModule="Batch Management"
                        requiredPermission="all"
                        submenumodule="Attendance"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className={`sidebar-item ${active === "Attendance" ? "text-white" : ""
                            }`}
                        >
                          <Link
                            to="/batchmanagement/attendances"
                            className="sidebar-link"
                            onClick={() => handleActiveClick("Attendance")}
                          >
                            {" "}
                            <AiOutlineLine className="sub_icon" />
                            Attendance
                          </Link>
                        </li>
                      </GateKeeper> */}
                    </ul>
                  </li>
                </GateKeeper>
                <GateKeeper requiredModule="Reports" requiredPermission="all">
                  <li
                    className="sidebar-item"
                    onClick={() => handleActiveClick("reports")}
                  >
                    <Link
                      className={` sidebar-link has-dropdown collapsed ${active === "reports" ? "text-white" : ""
                        }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#reports"
                      aria-expanded="false"
                      aria-controls="reports"
                    >
                      {" "}
                      <TbMessageReport className="main_icon" />
                      <span> Reports</span>
                    </Link>
                    <ul
                      id="reports"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      {/* report data */}
                      <GateKeeper
                        requiredModule="Reports"
                        submenumodule="Report Data"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className="sidebar-item"
                          onClick={() => handleActiveClick("reportsdata")}
                        >
                          <Link
                            to="/reports/reportsdata"
                            className={` sidebar-link ${active === "reportsdata" ? "text-white" : ""
                              }`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Reports Data
                          </Link>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Exam Mangement  */}
                <GateKeeper
                  requiredModule="Exam Mangement"
                  requiredPermission="all"
                >
                  <li
                    className="sidebar-item"
                    onClick={() => handleActiveClick("exammangement")}
                  >
                    <Link
                      className={` sidebar-link has-dropdown collapsed ${active === "exammangement" ? "text-white" : ""
                        }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#exammangement"
                      aria-expanded="false"
                      aria-controls="exammangement"
                    >
                      {" "}
                      <PiStudentFill className="main_icon" title="Exam Management" />
                      <span> Exam Management</span>
                    </Link>
                    <ul
                      id="exammangement"
                      className="sidebar-dropdown list-unstyled collapse"
                      data-bs-parent="#sidebar"
                    >
                      {/* Exam Details */}
                      <GateKeeper
                        requiredModule="Exam Mangement"
                        submenumodule="Exam Details"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className="sidebar-item"
                          onClick={() => handleActiveClick("examdetails")}
                        >
                          <Link
                            to="/exam/examdetails"
                            className={` sidebar-link ${active === "examdetails" ? "text-white" : ""
                              }`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Exam
                          </Link>
                        </li>
                      </GateKeeper>

                      {/* Registration Form */}
                      {/* <GateKeeper
                        requiredModule="Exam Mangement"
                        submenumodule="Registration Form"
                        submenuReqiredPermission="canRead"
                      >
                        <li
                          className="sidebar-item"
                          onClick={() => handleActiveClick("registrationform")}
                        >
                          <Link
                             to="/exam/registrationform"
                            className={` sidebar-link ${active === "registrationform" ? "text-white" : ""
                              }`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Registration Form
                          </Link>
                        </li>
                      </GateKeeper> */}
                    </ul>
                  </li>
                </GateKeeper>

                {/* Tickets */}
                <GateKeeper
                  requiredModule="Tickets Mangement"
                  requiredPermission="all"
                  submenumodule="Tickets Details"
                  submenuReqiredPermission="canRead"
                >
                  <li
                    className="sidebar-item"
                    onClick={() => handleActiveClick("ticket")}
                  >
                    <Link
                      className={`sidebar-link ${active === "tickets" ? `text-white` : ""
                        }`}
                      to="/tickets/ticketsDashboard"
                    >
                      <FaRegCircleQuestion className="main_icon" title="Tickets" />
                      <span className="title_show"> Tickets </span>
                    </Link>
                  </li>
                </GateKeeper>

                {/* Users */}
                <GateKeeper
                  requiredModule="User Mangement"
                  requiredPermission="all"
                  submenumodule="User Details"
                  submenuReqiredPermission="canRead"
                >
                  <li
                    className="sidebar-item"
                    onClick={() => handleActiveClick("users")}
                  >
                    <Link
                      className={`sidebar-link ${active === "users" ? `text-white` : ""
                        }`}
                      to="/user/list"
                    >
                      <FaRegUserCircle className="main_icon" title="Users" />
                      <span className="title_show"> Users </span>
                    </Link>
                  </li>
                </GateKeeper>

                {/* Settings */}
                <GateKeeper requiredModule="Settings" requiredPermission="all">
                  <li
                    className="sidebar-item"
                    onClick={() => handleActiveClick("settings")}
                  >
                    <Link
                      to="/settings"
                      className={` sidebar-link ${active === "settings" ? "text-white" : ""
                        }`}
                    >
                      <CiSettings className="main_icon" title="Settings" />
                      <span className="title_show"> Settings</span>
                    </Link>
                  </li>
                </GateKeeper>
              </ul>
            </div>
            {/* <div className='sidebar-footer'>
                  <Link className="sidebar-link">
                      <span>logout</span>
                  </Link>
              </div> */}
          </aside>
        </div>
        <div className={`${isExpanded ? "" : ""} flex-grow`}>
          {/* Your main content here */}
        </div>
      </main>
    </div>
  );
};
export default Sidemenu;

// PG COURSES

//  <GateKeeper
//                   requiredModule="Student Management"
//                   requiredPermission="all"
//                   submenumodule="PG Certification"
//                   submenuReqiredPermission="canRead"
//                 >
//                   <li
//                     className={`sidebar-item ${active === "pgcertification" ? "text-white" : ""
//                       }`}
//                   >
//                     <Link
//                       to="/student/cerficationlist"
//                       className="sidebar-link"
//                       onClick={() => handleActiveClick("pgcertification")}
//                     >
//                       <AiOutlineLine className="sub_icon" />
//                       PG Certification
//                     </Link>
//                   </li>
//                 </GateKeeper>

//  {/* Refund */}
//                 <GateKeeper
//                   requiredModule="Student Management"
//                   requiredPermission="all"
//                   submenumodule="refund"
//                   submenuReqiredPermission="canRead"
//                 >
//                   <li
//                     className={`sidebar-item ${active === "refunddata" ? "text-white" : ""
//                       }`}
//                   >
//                     <Link
//                       to="/student/refunddata"
//                       className="sidebar-link"
//                       onClick={() => handleActiveClick("refunddata")}
//                     >
//                       {" "}
//                       <AiOutlineLine className="sub_icon" />
//                       Refund
//                     </Link>
//                   </li>
//                 </GateKeeper>

{
  /* Reports */
}



// <GateKeeper
//   requiredModule="Student Management"
//   requiredPermission="all"
//   submenumodule="refund"
//   submenuReqiredPermission="canRead"
// >
//   <li
//     className={`sidebar-item ${active === "refunddata" ? "text-white" : ""
//       }`}
//   >
//     <Link
//       to="/student/refunddata"
//       className="sidebar-link"
//       onClick={() => handleActiveClick("refunddata")}
//     >
//       {" "}
//       <AiOutlineLine className="sub_icon" />
//       Refund
//     </Link>
//   </li>
// </GateKeeper>