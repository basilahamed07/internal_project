// // Router.js
// import React from "react";
// import { Routes, Route } from "react-router-dom";

// import NotFound from "../pages/NotFound";

// import SlidingAuth from "../pages/SignIn";
// import AdminPanel from "../pages/AdminPanel";
// import ProjectInfo from "../components/Admin/ProjectInfo";
// import AddProject from "../components/Admin/AddProject";
// import CreateProjectDetails from "../components/Admin/CreateProjectDetails";
// import ProjectTrends from "../components/Admin/ProjectTrends";
// import ManageDefects from "../components/Admin/ManageDefects";
// import ManageBuildStatus from "../components/Admin/ManageBuildStatus";
// import ManageDefectAcceptedRejected from "../components/Admin/ManageDefectAcceptedRejected";
// import ManageTestCaseCreationStatus from "../components/Admin/ManageTestCaseCreation";
// import ManageTestExecutionStatus from "../components/Admin/ManageTestExecutionStatus";
// import ManageTotalDefectStatus from "../components/Admin/ManageTotalDefectStatus";
// import ManagerView from "../components/manager_view/manager_view";
// import ProjectDetails from "../components/manager_view/full_testcase_details";
// import TestersDetails from "../components/manager_view/TestersDetails";
// import AdminProjectTable from "../components/Admin/adminprojecttable";
// import AdminAddProjectWithDetails from "../components/Admin/adminprojectadd";
// import UserManagement from "../components/Admin/usermanagement";
// import RegisterPage from "../components/Admin/RegisterPage";
// import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
// import ViewMatrix from "../components/manager_view/ViewMatrix";
// import GenerateReport from "../components/manager_view/final_report";
// import MetricsForm from "../components/Admin/matrixinput.jsx";

// // src\components\Admin\matrixinput.jsx

// const Routers = () => {
//   return (
//     <Routes>
//       {/* <Route path="/" element={<Navigate to="/signin" />} /> */}
//       <Route path="/" element={<SlidingAuth />} />
//       <Route path="RegisterPage" element={<RegisterPage />} />

//       <Route element={<ProtectedRoute />}> {/* Wrap with ProtectedRoute */}

//         <Route path="/ManagerView" element={<AdminPanel />}>
//           <Route path="manager_view" element={<ManagerView />} />
//           <Route path="full_test_details/:projectNameId" element={<ProjectDetails />} /> {/* Dynamic Route */}
//           <Route path="tester_count/:projectNameId" element={<TestersDetails />} />
//           <Route path="project_metrics/:id" element={<ViewMatrix />} /></Route>

//         <Route path="/TestLead" element={<AdminPanel />}>

//           {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
//           {/* accessable for test_lead */}


//           <Route path="add-project" element={<AddProject />} />
//           <Route path="create-project-details" element={<CreateProjectDetails />} />
//           <Route path="project-info" element={<ProjectInfo />} />
//           <Route path="project-trends" element={<ProjectTrends />} />
//           <Route path="ManageDefects" element={<ManageDefects />} />
//           <Route path="ManageTestExecutionStatus" element={<ManageTestExecutionStatus />} />
//           <Route path="ManageTotalDefectStatus" element={<ManageTotalDefectStatus />} />
//           <Route path="ManageBuildStatus" element={<ManageBuildStatus />} />
//           <Route path="ManageDefectAcceptedRejected" element={<ManageDefectAcceptedRejected />} />
//           <Route path="view_matrix_input" element={<MetricsForm />} />
//           <Route path="ManageTestCaseCreationStatus" element={<ManageTestCaseCreationStatus />} /></Route>

//         {/* Admin Panel Nested Routes */}
//         <Route path="/AdminPanel" element={<AdminPanel />}>
//           {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
//           {/* accessable for test_lead */}
//           <Route path="add-project" element={<AddProject />} />
//           <Route path="create-project-details" element={<CreateProjectDetails />} />
//           {/* <Route path="project-report" element={<ProjectReport />} /> */}
//           <Route path="project-info" element={<ProjectInfo />} />
//           <Route path="project-trends" element={<ProjectTrends />} />
//           <Route path="ManageDefects" element={<ManageDefects />} />
//           <Route path="ManageTestExecutionStatus" element={<ManageTestExecutionStatus />} />
//           <Route path="ManageTotalDefectStatus" element={<ManageTotalDefectStatus />} />
//           <Route path="ManageBuildStatus" element={<ManageBuildStatus />} />
//           <Route path="ManageDefectAcceptedRejected" element={<ManageDefectAcceptedRejected />} />
//           <Route path="ManageTestCaseCreationStatus" element={<ManageTestCaseCreationStatus />} />
//           <Route path="view_report" element={<GenerateReport />} />


//           {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
//           {/* 
//             #ONLY FOR MANAGER
//             <Route path="manager_view" element={<ManagerView />} />
//             <Route path="full_test_details/:projectNameId" element={<ProjectDetails />} />
//             <Route path="tester_count/:projectNameId" element={<TestersDetails />} /> */}

//           {/* for admin */}
//           {/* FOR ADMIN ONLY */}
//           <Route path="viewproject" element={<AdminProjectTable />} />
//           <Route path="adminaddproject" element={<AdminAddProjectWithDetails />} />
//           <Route path="add-user" element={<UserManagement />} />
//           {/* <Route path="viewproject" element={<AdminProjectTable />} /> */}
//         </Route>
//       </Route>

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default Routers;




// Router.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import NotFound from "../pages/NotFound";

import SlidingAuth from "../pages/SignIn";
import AdminPanel from "../pages/AdminPanel";
import ProjectInfo from "../components/Admin/ProjectInfo";
import AddProject from "../components/Admin/AddProject";
import CreateProjectDetails from "../components/Admin/CreateProjectDetails";
import ProjectTrends from "../components/Admin/ProjectTrends";
import ManageDefects from "../components/Admin/ManageDefects";
import ManageBuildStatus from "../components/Admin/ManageBuildStatus";
import ManageDefectAcceptedRejected from "../components/Admin/ManageDefectAcceptedRejected";
import ManageTestCaseCreationStatus from "../components/Admin/ManageTestCaseCreation";
import ManageTestExecutionStatus from "../components/Admin/ManageTestExecutionStatus";
import ManageTotalDefectStatus from "../components/Admin/ManageTotalDefectStatus";
import ManagerView from "../components/manager_view/manager_view";
import ProjectDetails from "../components/manager_view/full_testcase_details";
import TestersDetails from "../components/manager_view/TestersDetails";
import AdminProjectTable from "../components/Admin/adminprojecttable";
import AdminAddProjectWithDetails from "../components/Admin/adminprojectadd";
import UserManagement from "../components/Admin/usermanagement";
import RegisterPage from "../components/Admin/RegisterPage";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
import ViewMatrix from "../components/manager_view/ViewMatrix";
import MatrixInput from "../components/Admin/MatrixInput";
import MatrixView from "../pages/metrix_view";


const Routers = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/signin" />} /> */}
      <Route path="/" element={<SlidingAuth />} />
      <Route path="RegisterPage" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}> {/* Wrap with ProtectedRoute */}

        <Route path="/ManagerView" element={<AdminPanel />}>
          <Route path="manager_view" element={<ManagerView />} />
          <Route path="full_test_details/:projectNameId" element={<ProjectDetails />} /> {/* Dynamic Route */}
          <Route path="tester_count/:projectNameId" element={<TestersDetails />} />
          <Route path="project_metrics/:id" element={<ViewMatrix />} /></Route>

        <Route path="/TestLead" element={<AdminPanel />}>

          {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
          {/* accessable for test_lead */}


          <Route path="add-project" element={<AddProject />} />
          <Route path="create-project-details" element={<CreateProjectDetails />} />
          <Route path="project-info" element={<ProjectInfo />} />
          <Route path="project-trends" element={<ProjectTrends />} />
          <Route path="ManageDefects" element={<ManageDefects />} />
          <Route path="ManageTestExecutionStatus" element={<ManageTestExecutionStatus />} />
          <Route path="ManageTotalDefectStatus" element={<ManageTotalDefectStatus />} />
          <Route path="ManageBuildStatus" element={<ManageBuildStatus />} />
          <Route path="ManageDefectAcceptedRejected" element={<ManageDefectAcceptedRejected />} />
          <Route path="MatrixInput" element={<MatrixInput />} />
          <Route path="ManageTestCaseCreationStatus" element={<ManageTestCaseCreationStatus />} /></Route>

        {/* Admin Panel Nested Routes */}
        <Route path="/AdminPanel" element={<AdminPanel />}>
          {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
          {/* accessable for test_lead */}
          <Route path="add-project" element={<AddProject />} />
          <Route path="create-project-details" element={<CreateProjectDetails />} />
          {/* <Route path="project-report" element={<ProjectReport />} /> */}
          <Route path="project-info" element={<ProjectInfo />} />
          <Route path="project-trends" element={<ProjectTrends />} />
          <Route path="ManageDefects" element={<ManageDefects />} />
          <Route path="ManageTestExecutionStatus" element={<ManageTestExecutionStatus />} />
          <Route path="ManageTotalDefectStatus" element={<ManageTotalDefectStatus />} />
          <Route path="ManageBuildStatus" element={<ManageBuildStatus />} />
          <Route path="ManageDefectAcceptedRejected" element={<ManageDefectAcceptedRejected />} />
          <Route path="MatrixInput" element={<MatrixInput />} />
          <Route path="ManageTestCaseCreationStatus" element={<ManageTestCaseCreationStatus />} />


          {/* THIS CAN ACCESS FOR TESTLEAD AND ADMIN */}
          {/* 
            #ONLY FOR MANAGER
            <Route path="manager_view" element={<ManagerView />} />
            <Route path="full_test_details/:projectNameId" element={<ProjectDetails />} />
            <Route path="tester_count/:projectNameId" element={<TestersDetails />} /> */}

          {/* for admin */}
          {/* FOR ADMIN ONLY */}
          <Route path="viewproject" element={<AdminProjectTable />} />
          <Route path="adminaddproject" element={<AdminAddProjectWithDetails />} />
          <Route path="add-user" element={<UserManagement />} />
          <Route path="matrix-view" element={<MatrixView />} />
          {/* <Route path="viewproject" element={<AdminProjectTable />} /> */}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;