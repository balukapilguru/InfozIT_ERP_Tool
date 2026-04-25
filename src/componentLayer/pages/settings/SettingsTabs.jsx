import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/Settings.css";
import { FaArrowRight } from "react-icons/fa6";
import Branch from "../../../assets/images/setting_tabs_icons/Branch.png";
import Roles from "../../../assets/images/setting_tabs_icons/Roles.png";
import courses from "../../../assets/images/setting_tabs_icons/courses.png";
import departments from "../../../assets/images/setting_tabs_icons/departments.png";
import fee from "../../../assets/images/setting_tabs_icons/fee.png";
import course from "../../../assets/images/setting_tabs_icons/course.png";
import sources from "../../../assets/images/setting_tabs_icons/sources.png";
import oraganisation from "../../../assets/images/setting_tabs_icons/oraganisation.png";
import Bank from "../../../assets/images/setting_tabs_icons/Bank.png";
import BackButton from "../../components/backbutton/BackButton";
import Curriculum from "../../../assets/images/setting_tabs_icons/curriculam.png";
import GateKeeper from "../../../rbac/GateKeeper";

export const SettingsTabs = () => {
  const settingsData = [
    {
      name: "Course Package",
      heading: "Course Package",
      // heading:
      icon: course,
      link: "coursepackage",
    },
    {
      name: "Curriculum",
      heading: "Curriculum",

      icon: Curriculum,
      link: "curriculum",
    },
    {
      name: "Courses",
      heading: "Courses",

      icon: courses,
      link: "courses",
    },
    {
      name: "Roles",
      heading: "Roles",


      icon: Roles,
      link: "roles",
    },
    {
      name: "Branch",
      heading: "Branch",

      icon: Branch,
      link: "branch",
    },
    {
      name: "Departments",
      heading: "Departments",

      icon: departments,
      link: "departments",
    },
    // {
    //   name: "Admission Fee",
    //   heading: "Admission Fee",
    //   icon: fee,
    //   link: "admissionfee",
    // },
    {
      name: "Lead Sources",
      heading: "Lead Sources",
      icon: sources,
      link: "leadsource",
    },
    // {
    //   name: "Organization Profile",
    //   heading: "Organization Profile",

    //   icon: oraganisation,
    //   link: "organizationprofile",
    // },
    {
      name: "Bank Details",
      heading: "Bank Details",

      icon: Bank,
      link: "bankDetails",
    },
    // {
    //   name: "Learner Company",
    //   heading: "Learner Company",

    //   icon: Branch,
    //   link: "learnerCompany",
    // },
    // {
    //   name: "Issues",
    //   icon: "",
    //   link: "issues",
    // },
  ]

  return (
    <div>
      <BackButton heading=" Settings" content="Back" />
      <div className="container-fluid">
        <div className="row">
          {settingsData.map((setting, index) => {
            return (
              <GateKeeper
                requiredModule="Settings"
                submenumodule={setting.name}
                submenuReqiredPermission="canRead"
              >
                <div
                  key={index}
                  className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
                >
                  <div className="card card_animate card_height">
                    <Link to={`/settings/${setting?.link}`}>
                      <div className="d-flex p-3 justify-content-between">
                        <div>
                          <span className="fs-16 fw-500">{setting?.heading}</span>
                          <div className="mt-3 fs-14 lh-100 text_underline black_300">
                            <p classname="black_300">
                              Explore <FaArrowRight className="black_300" />
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="avatar-md me-3">
                            <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                              <img
                                src={setting.icon}
                                className="img-fluid"
                                width="100px"
                                height="100px"
                                alt=""
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </GateKeeper>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsTabs;
