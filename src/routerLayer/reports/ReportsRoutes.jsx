
import ReportsData from "../../componentLayer/pages/reports/ReportsData"
import CreateReport from '../../componentLayer/pages/reports/CreateReport';
import ReportsView from '../../componentLayer/pages/reports/ReportsView';
import RouteBlocker from '../../rbac/RouteBlocker';


const ReportsRoutes = [

    {
        path: "reportsdata",
        element: (
            <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canRead" />
        ),
        children: [{ index: true, element: <ReportsData /> }],
    },
    {
        path: "createreport",
        element: (
            <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canCreate" />
        ),
        children: [{ index: true, element: <CreateReport /> }],
    },

    {
        path: "reportview/:id",
        element: (
            <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canUpdate" />
        ),
        children: [{ index: true, element: <ReportsView /> }],
    },
];



export default ReportsRoutes;


// import { Route, Routes } from 'react-router-dom';
// import ReportsData from "../../componentLayer/pages/reports/ReportsData"
// import CreateReport from '../../componentLayer/pages/reports/CreateReport';
// import ReportsView from '../../componentLayer/pages/reports/ReportsView';
// import Error from '../../componentLayer/pages/Error/Error';
// import RouteBlocker from '../../rbac/RouteBlocker';

// function ReportsRoutes() {
//     return (
//         <Routes>
//             <Route path='*' element={<Error />} />

//             <Route path="/reportsdata" element={
//                 <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canRead">
//                     <ReportsData />
//                 </RouteBlocker>
//             } />

//             <Route path="/createreport" element={
//                 <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canCreate">
//                     <CreateReport />
//                 </RouteBlocker>
//             } />

//             <Route path="/reportview/:id" element={
//                 <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canUpdate">
//                     <ReportsView />
//                 </RouteBlocker>} />
//         </Routes>
//     );
// }

// export default ReportsRoutes;