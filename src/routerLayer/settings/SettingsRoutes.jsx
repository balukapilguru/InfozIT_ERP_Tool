
import OrganizationProfile from "../../componentLayer/pages/settings/organizationProfile/OrganizationProfile";
import SettingsTabs from "../../componentLayer/pages/settings/SettingsTabs";
import AdmissionFee from "../../componentLayer/pages/settings/admissionfee/AdmissionFee";
import Branch from "../../componentLayer/pages/settings/branch/Branch";
import CoursePackage from "../../componentLayer/pages/settings/coursePackage/CoursePackage";
import Course from "../../componentLayer/pages/settings/courses/Course";
import Departments from "../../componentLayer/pages/settings/departments/Department";
import Roles from "../../componentLayer/pages/settings/roles/Roles";
import LeadSource from "../../componentLayer/pages/settings/leadsource/LeadSource";
import { CreateRole } from "../../componentLayer/pages/settings/roles/CreateRole";
import CreateBranch from "../../componentLayer/pages/settings/branch/CreateBranch";
import CreateLeadSource from "../../componentLayer/pages/settings/leadsource/CreateLeadSource";
import CreateCoursePackage from "../../componentLayer/pages/settings/coursePackage/CreateCoursePackage";
import CreateCourse from "../../componentLayer/pages/settings/courses/CreateCourse";
import CreateAdmissionFee from "../../componentLayer/pages/settings/admissionfee/CreateAdmissionFee";
import CreateDepartment from "../../componentLayer/pages/settings/departments/CreateDepartment";
import RouteBlocker from "../../rbac/RouteBlocker";
import Curriculum from "../../componentLayer/pages/settings/curriculum/Curriculum";
import AddCurriculum from "../../componentLayer/pages/settings/courses/AddCurriculum";
import { BranchFromAction, BranchListAction } from "../../componentLayer/pages/settings/branch/Branch.Action";
import { branchFromLoader, branchListLoader } from "../../componentLayer/pages/settings/branch/Branch.Loader";
import BankDetails from "../../componentLayer/pages/settings/bankDetails/BankDetails";
import CreateBankDetails from "../../componentLayer/pages/settings/bankDetails/CreateBankDetails";
import { bankDetailsLoader, bankDetailsLoaderById } from "../../componentLayer/pages/settings/bankDetails/BankLoader";
import { bankDetailsAction, bankDetailsDeleteAction } from "../../componentLayer/pages/settings/bankDetails/BankAction";
import Tickets from "../../componentLayer/pages/settings/tickets/Tickets";
import AddMeadiContent, { AddMeadiContentAction, AddMeadiContentLoader } from "../../componentLayer/pages/settings/courses/AddMeadiContent";
import LearnerCompany from "../../componentLayer/pages/settings/learnerCompany/LearnerCompany";
import CreateLearnerCompany from "../../componentLayer/pages/settings/learnerCompany/CreateLearnerCompany";
import { learnerCompanyAction, LearnerCompanyListAction } from "../../componentLayer/pages/settings/learnerCompany/LearnerCompanyAction";
import { LearnerCompanyByIdLoader, LearnerCompanyLoader } from "../../componentLayer/pages/settings/learnerCompany/LearnerCompanyLoader";


const SettingsRoutes = [
  {
    index: true,
    element: <SettingsTabs />,
  },

  {
    path: "roles/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Roles" submenuReqiredPermission="canCreate" />,
    children: [{ index: true, element: <CreateRole /> }],
  },

  {
    path: "roles",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Roles" submenuReqiredPermission="canRead" />,
    children: [{ index: true, element: <Roles /> }],
  },

  {
    path: "roles/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Roles" submenuReqiredPermission="canUpdate" />,
    children: [{ index: true, element: <CreateRole /> }],
  },

  {
    path: "branch",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Branch" submenuReqiredPermission="canRead" />,
    children: [{
      index: true,
      element: <Branch />,
      loader: branchListLoader,
      action: BranchListAction,
    }],
  },

  {
    path: "branch/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Branch" submenuReqiredPermission="canCreate" />,
    children: [{
      index: true,
      element: <CreateBranch />,
      action: BranchFromAction,
      loader: branchFromLoader
    }],
  },

  {
    path: "branch/edit",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Branch" submenuReqiredPermission="canUpdate" />,
    children: [{
      index: true,
      element: <CreateBranch />,
      loader: branchFromLoader,
      action: BranchFromAction,
    }],
  },
   {
    path: "learnerCompany",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Learner Company" submenuReqiredPermission="canRead" />,
    children: [{
      index: true,
      element: <LearnerCompany />,
      loader: LearnerCompanyLoader,
      action: LearnerCompanyListAction,
    }],
  },
{
    path: "learnerCompany/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Learner Company" submenuReqiredPermission="canCreate" />,
    children: [{
      index: true,
      element: <CreateLearnerCompany />,
      action: learnerCompanyAction,
      // loader: branchFromLoader
    }],
  },
   {
    path: "learnerCompany/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Learner Company" submenuReqiredPermission="canUpdate" />,
    children: [{
      index: true,
      element: <CreateLearnerCompany />,
      loader: LearnerCompanyByIdLoader,
      action: learnerCompanyAction,
    }],
  },

  {
    path: "coursePackage",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Course Package" submenuReqiredPermission="canRead" />,
    children: [{ index: true, element: <CoursePackage /> }],
  },

  {
    path: "coursePackage/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Course Package" submenuReqiredPermission="canCreate" />,
    children: [{ index: true, element: <CreateCoursePackage /> }],
  },

  {
    path: "coursePackage/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Course Package" submenuReqiredPermission="canUpdate" />,
    children: [{ index: true, element: <CreateCoursePackage /> }],
  },


  {
    path: "courses",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Courses" submenuReqiredPermission="canRead" />,
    children: [{ index: true, element: <Course /> }],
  },

  {
    path: "courses/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Courses" submenuReqiredPermission="canCreate" />,
    children: [{ index: true, element: <CreateCourse /> }],
  },

  {
    path: "courses/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Courses" submenuReqiredPermission="canUpdate" />,
    children: [{ index: true, element: <CreateCourse /> }],
  },

  {
    path: "admissionfee",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Admission Fee" submenuReqiredPermission="canRead" />,
    children: [{ index: true, element: <AdmissionFee /> }],
  },

  // curriculum

  {
    path: "curriculum",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Curriculum" submenuReqiredPermission="canRead" />,
    children: [{ index: true, element: <Curriculum /> }],
  },


  {
    path: "curriculum/addmodules/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Curriculum" submenuReqiredPermission="canUpdate" />,
    children: [{ index: true, element: <AddCurriculum /> }],
  },
  {
    path: "curriculum/addmediacontent/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Curriculum" submenuReqiredPermission="canUpdate" />,
    children: [
      { 
        index: true, 
        element: <AddMeadiContent />,
        loader: AddMeadiContentLoader ,
        action: AddMeadiContentAction,
      }
    ],
  },

  {
    path: "departments",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Departments" submenuReqiredPermission="canRead" />,
    children: [{ index: true, element: <Departments /> }],
  },

  {
    path: "departments/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Departments" submenuReqiredPermission="canCreate" />,
    children: [{ index: true, element: <CreateDepartment /> }],
  },



  {
    path: "departments/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Departments" submenuReqiredPermission="canUpdate" />,
    children: [{ index: true, element: <CreateDepartment /> }],
  },


  {
    path: "leadsource",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Lead Sources" submenuReqiredPermission="canRead" />,
    children: [{ index: true, element: <LeadSource /> }],
  },

  {
    path: "lead/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Lead Sources" submenuReqiredPermission="canCreate" />,
    children: [{ index: true, element: <CreateLeadSource /> }],
  },

  {
    path: "lead/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Lead Sources" submenuReqiredPermission="canUpdate" />,
    children: [{ index: true, element: <CreateLeadSource /> }],
  },

  {
    path: "organizationprofile",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Organization Profile" submenuReqiredPermission="canRead" />,
    children: [{
      index: true,
      element: <OrganizationProfile />
    }],
  },

  {
    path: "admissionfee/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Admission Fee" submenuReqiredPermission="canCreate" />,
    children: [{
      index: true,
      element: <CreateAdmissionFee />
    }],
  },
  {
    path: "createbankdetails",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Bank Details" submenuReqiredPermission="canCreate" />,
    children: [{
      index: true,
      element: <CreateBankDetails />,
      action: bankDetailsAction
    }],
  },
  {
    path: "editbankdetails/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Bank Details" submenuReqiredPermission="canUpdate" />,
    children: [{
      index: true,
      element: <CreateBankDetails />,
      loader: bankDetailsLoaderById,
      action: bankDetailsAction
    }],
  },
  {
    path: "bankDetails",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Bank Details" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <BankDetails />,
        loader: bankDetailsLoader,
        action: bankDetailsDeleteAction
      }],
  },
  {
    path: "issues",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Tickets" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <Tickets />,
      }],
  },

];

export default SettingsRoutes;


// import React from "react";
// import OrganizationProfile from "../../componentLayer/pages/settings/organizationProfile/OrganizationProfile";
// import { Route, Routes } from "react-router-dom";
// import SettingsTabs from "../../componentLayer/pages/settings/SettingsTabs";
// import AdmissionFee from "../../componentLayer/pages/settings/admissionfee/AdmissionFee";
// import Branch from "../../componentLayer/pages/settings/branch/Branch";
// import CoursePackage from "../../componentLayer/pages/settings/coursePackage/CoursePackage";
// import Course from "../../componentLayer/pages/settings/courses/Course";
// import Departments from "../../componentLayer/pages/settings/departments/Department";
// import Roles from "../../componentLayer/pages/settings/roles/Roles";
// import LeadSource from "../../componentLayer/pages/settings/leadsource/LeadSource";
// import { CreateRole } from "../../componentLayer/pages/settings/roles/CreateRole";
// import CreateBranch from "../../componentLayer/pages/settings/branch/CreateBranch";
// import CreateLeadSource from "../../componentLayer/pages/settings/leadsource/CreateLeadSource";
// import CreateCoursePackage from "../../componentLayer/pages/settings/coursePackage/CreateCoursePackage";
// import CreateCourse from "../../componentLayer/pages/settings/courses/CreateCourse";
// import CreateAdmissionFee from "../../componentLayer/pages/settings/admissionfee/CreateAdmissionFee";
// import CreateDepartment from "../../componentLayer/pages/settings/departments/CreateDepartment";
// import RouteBlocker from "../../rbac/RouteBlocker";
// import Error from "../../componentLayer/pages/Error/Error";
// import Curriculum from "../../componentLayer/pages/settings/curriculum/Curriculum";
// import AddCurriculum from "../../componentLayer/pages/settings/courses/AddCurriculum";

// function SettingsRoutes() {
//   return (
//     <Routes>
//       <Route path="" element={<SettingsTabs />} />

//       <Route path="*" element={<Error />} />
//       {/* role */}
//       <Route
//         path="/roles/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Roles"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateRole />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/roles"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Roles"
//             submenuReqiredPermission="canRead"
//           >
//             <Roles />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/roles/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Roles"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateRole />
//           </RouteBlocker>
//         }
//       />

//       {/* branch */}
//       <Route
//         path="/branch"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Branch"
//             submenuReqiredPermission="canRead"
//           >
//             <Branch />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/branch/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Branch"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateBranch />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/branch/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Branch"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateBranch />
//           </RouteBlocker>
//         }
//       />

//       {/* coursePackage */}
//       <Route
//         path="/coursePackage"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Course Package"
//             submenuReqiredPermission="canRead"
//           >
//             <CoursePackage />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/coursePackage/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Course Package"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateCoursePackage />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/coursePackage/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Course Package"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateCoursePackage />
//           </RouteBlocker>
//         }
//       />

//       {/* courses */}
//       <Route
//         path="/courses"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Courses"
//             submenuReqiredPermission="canRead"
//           >
//             <Course />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/courses/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Courses"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateCourse />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/courses/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Courses"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateCourse />
//           </RouteBlocker>
//         }
//       />

//       {/* admission fee */}
//       <Route
//         path="/admissionfee"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Admission Fee"
//             submenuReqiredPermission="canRead"
//           >
//             <AdmissionFee />
//           </RouteBlocker>
//         }
//       />

//       {/* curriculum */}
//       <Route
//         path="/curriculum"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Curriculum"
//             submenuReqiredPermission="canRead"
//           >
//             <Curriculum />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/curriculum/addmodules/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Curriculum"
//             submenuReqiredPermission="canUpdate"
//           >
//             <AddCurriculum />
//           </RouteBlocker>
//         }
//       />

//       {/* department */}
//       <Route
//         path="/departments"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Departments"
//             submenuReqiredPermission="canRead"
//           >
//             <Departments />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/departments/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Departments"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateDepartment />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/departments/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Departments"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateDepartment />
//           </RouteBlocker>
//         }
//       />

//       {/* leadsource */}
//       <Route
//         path="/leadsource"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Lead Sources"
//             submenuReqiredPermission="canRead"
//           >
//             <LeadSource />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/lead/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Lead Sources"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateLeadSource />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/lead/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Lead Sources"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateLeadSource />
//           </RouteBlocker>
//         }
//       />

//       <Route path="/organizationprofile" element={<OrganizationProfile />} />
//       <Route path="/admissionfee/new" element={<CreateAdmissionFee />} />
//       {/* Add id here for editing purpose */}
//       <Route path="/admissionfee/edit/" element={<CreateAdmissionFee />} />
//     </Routes>
//   );
// }

// export default SettingsRoutes;
