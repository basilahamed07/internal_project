// import React, { useState, useEffect } from 'react';
// import { Card, Form, Button, Modal, Dropdown, Spinner } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import axios from 'axios';

// // SVG Imports
// import addproject from "../panel/assets/addproject.svg";

// // css

// import "./AddProject.css"


// //validation
// import { useDispatch, useSelector } from 'react-redux';

// import { validateField } from '../validation/store';  
// import { validateProjectName, validateConfirmProjectName } from './validation';


// const AddProjectWithDetails = ({ projectNameProp }) => {
//   const [projectName, setProjectName] = useState(projectNameProp);
//   const [confirmProjectName, setConfirmProjectName] = useState('');
//   const [isPending, setIsPending] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showCreateDetails, setShowCreateDetails] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [showPopup, setShowPopup] = useState(false); // State for the confirmation popup
//   const [errorMessage, setErrorMessage] = useState("");

//   // for pending form 

//   const [pendingProjects, setPendingProjects] = useState([]); // State to store pending projects
//   const [loading, setLoading] = useState(false);
//   const [selectedProject, setSelectedProject] = useState('');


//   const navigate = useNavigate(); // Initialize useNavigate hook
//   const [formData, setFormData] = useState({
//     project_name_id: '',
//     RAG: '',
//     tester_count: 0, // Initialize with 0
//     billable: [],
//     nonbillable: [],
//     billing_type: '',
//     RAG_details: '',
//     automation: false,
//     ai_used: false,
//   });

//   const [testers, setTesters] = useState([]);
//   const [loadingTesters, setLoadingTesters] = useState(false);
//   const [showCreateTesterModal, setShowCreateTesterModal] = useState(false);
//   const [selectedTesterType, setSelectedTesterType] = useState('');
//   const [selectedTesters, setSelectedTesters] = useState({
//     billable: [],
//     nonbillable: [],
//   });

//   const handleIconClick = () => setShowForm(true);

//   useEffect(() => {

//     // Load the saved form data from sessionStorage (if any)
//     const savedFormData = sessionStorage.getItem('formData');
//     if (savedFormData) {
//       setFormData(JSON.parse(savedFormData)); // Set the form data to saved state
//     }

//   }, [showCreateDetails]); // Run only on initial render (mount) or page refresh


//   // Step 2: Save form data to sessionStorage whenever formData changes
//   useEffect(() => {
//     if (formData) {
//       sessionStorage.setItem('formData', JSON.stringify(formData));
//     }
//   }, [formData]); // This effect runs every time formData changes


//   // for validation 

//   const dispatch = useDispatch();
//   const { errors } = useSelector((state) => state.formValidation);

//   const handleBlur = (field) => {
//     let error = '';
//     if (field === 'projectName') {
//       error = validateProjectName(projectName, confirmProjectName);
//     } else if (field === 'confirmProjectName') {
//       error = validateConfirmProjectName(confirmProjectName);
//     }

//     // Dispatch the validation error to Redux store
//     dispatch(validateField({ field, error }));
//   };


//   const fetchTesters = async () => {
//     setLoadingTesters(true);
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) {
//         setError('No access token found. Please login.');
//         return;
//       }

//       const response = await fetch('http://localhost:5000/tester-billable', {
//         // const response = await fetch('http://localhost:5000/tester-billable', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }
 
//       const data = await response.json();
//       setTesters(data.testers || []);
//     } catch (error) {
//       console.error('Error fetching testers:', error);
//       setError('Error fetching testers: ' + error.message);
//     } finally {
//       setLoadingTesters(false);
//     }
//   };

//   useEffect(() => {
//     fetchTesters();
//   }, []);

//   const handleTesterSelection = (tester, type) => {
//     const updatedList = selectedTesters[type].find(item => item.tester_name === tester.tester_name)
//       ? selectedTesters[type].filter(item => item.tester_name !== tester.tester_name)
//       // : [...selectedTesters[type], { ...tester, project_name: projectName }];
//       : [...selectedTesters[type], { ...tester, project_name: selectedProject ? selectedProject : projectName }];

//     const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };

//     setSelectedTesters(updatedSelectedTesters);
//     updateTesterCount(updatedSelectedTesters);
//   };

//   const handleCreateTester = async (testerName, type) => {
//     const newTester = {
//       tester_name: testerName,
//       // project_name: projectName,
//       project_name: selectedProject ? selectedProject : projectName,
//       billable: type === 'billable',
//     };

//     const updatedList = type === 'billable' ? [...selectedTesters.billable, newTester] : [...selectedTesters.nonbillable, newTester];
//     const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };

//     setSelectedTesters(updatedSelectedTesters);
//     updateTesterCount(updatedSelectedTesters);
//     setShowCreateTesterModal(false);
//   };

//   const updateTesterCount = (updatedSelectedTesters) => {
//     const totalCount = updatedSelectedTesters.billable.length + updatedSelectedTesters.nonbillable.length;
//     setFormData({ ...formData, tester_count: totalCount });
//   };


//   const handleProjectSubmit = async (e) => {
//     e.preventDefault();

//     if (projectName !== confirmProjectName) {
//       setError('Project names do not match.');
//       return;
//     }

//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) throw new Error('User is not authenticated');

//       setIsPending(true);

//       const requestBody = {
//         project_name: selectedProject ? selectedProject : projectName,
//       };

//       const response = await fetch('http://localhost:5000/create-project', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         if (error && error.message === 'Project name already exists') {
//           // If the project name already exists
//           setError('Project name already exists.');
//         } else {
//           // Handle other errors
//           throw new Error('Project creation failed');
//         }
//         return;  // Exit the function after handling the error
//       }

//       const projectDataResponse = await response.json();
//       // setSuccessMessage('Project created successfully!');

//       // Save the state in sessionStorage to indicate the project is created
//       // sessionStorage.setItem('isProjectCreated', 'true');
//       setShowCreateDetails(true);


//     } catch (error) {
//       setError('Error creating project: ' + error.message);
//     } finally {
//       setIsPending(false);
//       setShowPopup(false); // Close the popup after submitting
//     }
//   };


//   // Handle Submit (Trigger Popup)
//   const handleSubmitClick = (e) => {
//     e.preventDefault(); // Prevent form submission immediately
//     setShowPopup(true); // Show the confirmation popup
//   };


//   const handlePopupCancel = () => {
//     setShowPopup(false); // Close the popup without submitting
//   };

//   const handleProjectDetailsSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) throw new Error('User is not authenticated');

//       setIsPending(true);

//       const testersToSubmit = [
//         ...selectedTesters.billable.map(tester => ({
//           tester_name: tester.tester_name,
//           // project_name: projectName,
//           project_name: selectedProject ? selectedProject : projectName,
//           billable: true,
//         })),
//         ...selectedTesters.nonbillable.map(tester => ({
//           tester_name: tester.tester_name,
//           // project_name: projectName,
//           project_name: selectedProject ? selectedProject : projectName,
//           billable: false,
//         })),
//       ];

//       const createTestersResponse = await fetch('http://localhost:5000/tester-billable', {
//         // const createTestersResponse = await fetch('http://localhost:5000/tester-billable', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({ testers: testersToSubmit }),
//       });

//       if (!createTestersResponse.ok) {
//         throw new Error('Testers creation failed');
//       }

//       const testersResponseData = await createTestersResponse.json();
//       console.log('Testers created successfully:', testersResponseData);

//       const projectDetailsPayload = {
//         // project_name: projectName,
//         project_name: selectedProject ? selectedProject : projectName,
//         RAG: formData.RAG,
//         tester_count: formData.tester_count,
//         testers: testersToSubmit,
//         billing_type: formData.billing_type,
//         RAG_details: formData.RAG_details,
//         // automation: formData.automation === 'Yes',
//         // ai_used: formData.ai_used === 'Yes',
//         automation_details: formData.automation === 'Yes' ? formData.automation_details : '',
//         ai_used_details: formData.ai_used === 'Yes' ? formData.ai_used_details : '',
//       };

//       // Validation: Check if all required fields are filled
//       const requiredFields = [
//         formData.RAG,
//         formData.RAG_details,
//         formData.billing_type,
//         formData.automation,
//         formData.ai_used,
//         selectedTesters.billable.length > 0, // Ensure at least one billable tester is selected
//         selectedTesters.nonbillable.length > 0, // Ensure at least one non-billable tester is selected
//       ];

//       // Check if any required field is missing or empty
//       const allFieldsValid = requiredFields.every(field => field !== "" && field !== undefined && field !== null);

//       if (!allFieldsValid) {
//         setErrorMessage("Please fill in all required fields.");
//         return; // Stop the form submission if validation fails
//       }

//       const response2 = await fetch('http://localhost:5000/create-project-details', {
//         // const response2 = await fetch('http://localhost:5000/create-project-details', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(projectDetailsPayload),
//       });

//       if (!response2.ok) throw new Error('Project details creation failed');

//       const projectDetailsResponse = await response2.json();
//       // setSuccessMessage('Project details created successfully!');


//       // Clear session data after completing the form
//       // sessionStorage.removeItem('isProjectCreated');
//       sessionStorage.removeItem('formData');

//     } catch (error) {
//       setError('Error creating project details: ' + error.message);
//     } finally {
//       setIsPending(false);
//     }



//     // setSuccessMessage('Project details submitted successfully!');
//     setShowCreateDetails(false); // Hide the form after successful submission
//     setShowPopup(false); // Hide the popup after confirmation


//     navigate('/AdminPanel/project-info'); // Navigate after 2 seconds

//     // setTimeout(() => {
//     //   navigate('/AdminPanel/project-info'); // Navigate after 2 seconds
//     // }, 2000);


//   };



//   // Fetch pending projects from API
//   const fetchPendingProjects = async () => {
//     setLoading(true);
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) {
//         setError('No access token found. Please login.');
//         return;
//       }

//       const response3 = await axios.get('http://localhost:5000/pending-project', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       // console.log(response3.data);  // Log the entire response


//       // Assuming the response3 returns an array of projects with project_name
//       if (response3.data && Array.isArray(response3.data)) {
//         setPendingProjects([response3.data.sample_data]); // Wrap it in an array
//         // console.log(response3.data.sample_data);  // Log the fetched projects
//       } else {
//         // setError('No pending projects available.');
//       }



//       if (response3.data && Array.isArray(response3.data.sample_data)) {
//         setPendingProjects(response3.data.sample_data);
//         // console.log(response3.data.sample_data);  // Log the fetched projects
//       } else {
//         setError('No pending projects available.');
//       }

//     } catch (err) {
//       setError('Failed to fetch pending projects.');
//     } finally {
//       setLoading(false);
//     }
//   };




//   // Update this function to handle the project update button click
//   const handleProjectUpdate = (project) => {
//     // console.log(project.project_name)
//     setProjectName(project.project_name); // Set the project name from the selected pending project

//     setSelectedProject(project); // Set the selected project

//     // If you want to show the "Create Project Details Form" after clicking update
//     setShowCreateDetails(true);
//   };

//   // Fetch projects when component mounts
//   useEffect(() => {
//     fetchPendingProjects();
//   }, []);



//   const getAvailableTesters = (type) => {
//     return testers.filter(tester =>
//       !selectedTesters.billable.some(selectedTester => selectedTester.tester_name === tester.tester_name) &&
//       !selectedTesters.nonbillable.some(selectedTester => selectedTester.tester_name === tester.tester_name)
//     );
//   };

//   return (
//     <div className="container mt-5">

//       {/* Display SVG Icon or Form */}
//       {!showForm && (
//         <div onClick={handleIconClick} style={{ cursor: 'pointer' }}>
//           <img src={addproject} alt="addproject" style={{ width: '189px', height: '189px' }} />
//           <p>Click to add project details here</p>
//         </div>

//       )}

//       {/* Parent container with flexbox to display both sections side by side */}
//       {showForm && !showCreateDetails && (
//         <div style={{ display: "flex", justifyContent: "space-between" }}>


//           {/* Add Project Form */}
//           <div style={{ width: "50%" }}>
//             {showForm && !showCreateDetails && (
//               <Card>
//                 <Card.Header
//                   as="h5"
//                   style={{ backgroundColor: "#000d6b", color: "#ffffff" }}
//                 >
//                   Add Project
//                 </Card.Header>
//                 <Card.Body>
//                   {error && <p className="text-danger">{error}</p>}
//                   {successMessage && <p className="text-success">{successMessage}</p>}

//                   <Form onSubmit={handleProjectSubmit}>
//                     <Form.Group controlId="projectName">
//                       <Form.Label>Project Name:</Form.Label>
//                       <Form.Control
//                         type="text"
//                         value={projectName}
//                         onChange={(e) => setProjectName(e.target.value)}
//                         onBlur={() => handleBlur('projectName')}
//                         isInvalid={!!errors.projectName}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group controlId="confirmProjectName">
//                       <Form.Label>Confirm Project Name:</Form.Label>
//                       <Form.Control
//                         type="text"
//                         value={confirmProjectName}
//                         onChange={(e) => setConfirmProjectName(e.target.value)}
//                         onBlur={() => handleBlur('projectName')}
//                         isInvalid={!!errors.projectName}
//                         required
//                       />
//                     </Form.Group>
//                     <br />
//                     <Button
//                       variant="primary"
//                       type="submit"
//                       disabled={isPending}
//                       style={{
//                         fontWeight: "bold",
//                         color: "#ffffff",
//                         backgroundColor: "#000d6b",
//                         borderColor: "#000d6b",
//                       }}
//                     >
//                       {isPending ? "Creating..." : "Create Project"}
//                     </Button>
//                   </Form>
//                 </Card.Body>
//               </Card>
//             )}
//           </div>

//           {/* Left Section: Display Pending Projects */}
//           <div style={{ width: '45%' }}>
//             {loading ? (
//               <p>Loading...</p>
//             ) : (
//               <div>
//                 {pendingProjects.length === 0 ? (
//                   <p>No pending projects available.</p>
//                 ) : (
//                   <Card>
//                     <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
//                       Pending Projects
//                     </Card.Header>
//                     <Card.Body>
//                       <Form>
//                         {/* Dropdown for selecting project */}
//                         <Form.Group>
//                           <Form.Label>Project Name:</Form.Label>
//                           <Form.Control
//                             as="select"
//                             value={selectedProject}
//                             onChange={(e) => setSelectedProject(e.target.value)}
//                           // onChange={(e) => setProjectName(e.target.value)}
//                           >
//                             <option value="">Select a project</option>
//                             {pendingProjects.map((projectName, index) => (
//                               <option key={index} value={projectName}>
//                                 {projectName}
//                               </option>
//                             ))}
//                           </Form.Control>
//                         </Form.Group>

//                         <Form.Group>
//                           <Form.Label>Status:</Form.Label>
//                           <Form.Control
//                             as="select"
//                             value="Pending"
//                             readOnly
//                             style={{ borderColor: 'orange' }} // Apply warning color for Pending
//                           >
//                             <option>Pending</option>
//                           </Form.Control>
//                         </Form.Group>
//                         <br />
//                         <Button
//                           variant="primary"
//                           onClick={() => handleProjectUpdate(selectedProject)} // Pass the selected project name
//                           disabled={isPending}
//                           style={{
//                             fontWeight: 'bold',
//                             color: '#ffffff',
//                             backgroundColor: '#000d6b',
//                             borderColor: '#000d6b',
//                           }}
//                         >
//                           {isPending ? 'Proceeding...' : 'Proceed with Update'}
//                         </Button>
//                       </Form>
//                     </Card.Body>
//                   </Card>
//                 )}
//               </div>
//             )}
//           </div>



//         </div>
//       )}

//       {/* Create Project Details Form */}
// {showCreateDetails && (
//   <Card className="mt-4">
//     <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
//       Add Project Details
//     </Card.Header>
//     <Card.Body>
//       <div style={{ maxHeight: '600px', overflowY: 'auto' }}> {/* Apply Scroll on Overflow */}
//         <Form onSubmit={handleProjectDetailsSubmit}>
//           <div className="row">
//             <div className="col-md-6">
//               {/* Project Name */}
//               <Form.Group controlId="project_name_id">
//                 <Form.Label>Project Name:</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={selectedProject ? selectedProject : projectName}
//                   readOnly
//                 />
//               </Form.Group>

//               {/* RAG */}
//               <Form.Group controlId="RAG">
//                 <Form.Label>RAG</Form.Label>
//                 <Form.Control
//                   as="select"
//                   value={formData.RAG}
//                   onChange={(e) => setFormData({ ...formData, RAG: e.target.value })}
//                   onBlur={() => handleBlur('projectName')}
//                   isInvalid={!!errors.projectName}
//                   required
//                 >
//                   <option value="">Select RAG</option>
//                   <option value="Green">Green</option>
//                   <option value="Amber">Amber</option>
//                   <option value="Red">Red</option>
//                 </Form.Control>
//               </Form.Group>

//               {/* RAG Details */}
//               <Form.Group controlId="RAG_Details">
//                 <Form.Label>RAG Details</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={formData.RAG_details}
//                   onChange={(e) => setFormData({ ...formData, RAG_details: e.target.value })}
//                   onBlur={() => handleBlur('projectName')}
//                   isInvalid={!!errors.projectName}
//                   required
//                 />
//               </Form.Group>

//               {/* Billable Testers Dropdown */}
//               <Form.Group controlId="billable">
//                 <Form.Label>Billable Testers</Form.Label>
//                 <Dropdown>
//                   <Dropdown.Toggle variant="success" id="dropdown-basic">
//                     {selectedTesters.billable.length > 0
//                       ? selectedTesters.billable.map(t => t.tester_name).join(', ')
//                       : 'Select Billable Testers'}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     {loadingTesters ? (
//                       <Dropdown.ItemText>
//                         <Spinner animation="border" size="sm" />
//                         Loading...
//                       </Dropdown.ItemText>
//                     ) : (
//                       getAvailableTesters('billable').map(tester => (
//                         <Dropdown.Item
//                           key={tester.id}
//                           onClick={() => handleTesterSelection(tester, 'billable')}
//                         >
//                           {tester.tester_name}
//                         </Dropdown.Item>
//                       ))
//                     )}
//                     <Dropdown.Item onClick={() => { setSelectedTesterType('billable'); setShowCreateTesterModal(true); }}>
//                       Add New Tester
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Form.Group>
//             </div>

//             <div className="col-md-6">
//               {/* Non-Billable Testers Dropdown */}
//               <Form.Group controlId="nonbillable">
//                 <Form.Label>Non-Billable Testers</Form.Label>
//                 <Dropdown>
//                   <Dropdown.Toggle variant="secondary" id="dropdown-basic">
//                     {selectedTesters.nonbillable.length > 0
//                       ? selectedTesters.nonbillable.map(t => t.tester_name).join(', ')
//                       : 'Select Non-Billable Testers'}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     {loadingTesters ? (
//                       <Dropdown.ItemText>
//                         <Spinner animation="border" size="sm" />
//                         Loading...
//                       </Dropdown.ItemText>
//                     ) : (
//                       getAvailableTesters('nonbillable').map(tester => (
//                         <Dropdown.Item
//                           key={tester.id}
//                           onClick={() => handleTesterSelection(tester, 'nonbillable')}
//                         >
//                           {tester.tester_name}
//                         </Dropdown.Item>
//                       ))
//                     )}
//                     <Dropdown.Item onClick={() => { setSelectedTesterType('nonbillable'); setShowCreateTesterModal(true); }}>
//                       Add New Tester
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Form.Group>

//               {/* Billing Type Dropdown */}
//               <Form.Group controlId="billing_type">
//                 <Form.Label>Billing Type</Form.Label>
//                 <Form.Control
//                   as="select" 
//                   value={formData.billing_type}
//                   onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
//                   onBlur={() => handleBlur('projectName')}
//                   isInvalid={!!errors.projectName}
//                   required
//                 >
//                   <option value="">Select Billing Type</option>
//                   <option value="T&M">T&M</option>
//                   <option value="FIXED">FIXED</option>
//                 </Form.Control>
//               </Form.Group>

//               {/* Automation Used Section */}
//               <Form.Group controlId="Automation">
//                 <Form.Label>Automation Used</Form.Label>
//                 <div>
//                   <Form.Check
//                     type="radio"
//                     label="Yes"
//                     value="Yes"
//                     checked={formData.automation === 'Yes'}
//                     onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
//                   />
//                   <Form.Check
//                     type="radio"
//                     label="No"
//                     value="No"
//                     checked={formData.automation === 'No'}
//                     onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
//                   />
//                 </div>
//                 {formData.automation === 'Yes' && (
//                   <div>
//                     <Button
//                       variant="secondary"
//                       onClick={() => setFormData({ ...formData, automation_details: "Selenium" })}
//                       style={{ marginRight: '10px' }}
//                     >
//                       Selenium
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       onClick={() => setFormData({ ...formData, automation_details: "Pytest" })}
//                     >
//                       Pytest
//                     </Button>
//                     <Form.Group controlId="automationDetails" style={{ marginTop: '10px' }}>
//                       <Form.Label>Automation Tool</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         value={formData.automation_details}
//                         onChange={(e) => setFormData({ ...formData, automation_details: e.target.value })}
//                         placeholder="Details about the selected automation tool"
//                       />
//                     </Form.Group>
//                   </div>
//                 )}
//               </Form.Group>

//               {/* AI Used Section */}
//               <Form.Group controlId="AI">
//                 <Form.Label>AI Used</Form.Label>
//                 <div>
//                   <Form.Check
//                     type="radio"
//                     label="Yes"
//                     value="Yes"
//                     checked={formData.ai_used === 'Yes'}
//                     onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
//                   />
//                   <Form.Check
//                     type="radio"
//                     label="No"
//                     value="No"
//                     checked={formData.ai_used === 'No'}
//                     onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
//                   />
//                 </div>
//                 {formData.ai_used === 'Yes' && (
//                   <div>
//                     <Button
//                       variant="secondary"
//                       onClick={() => setFormData({ ...formData, ai_used_details: "TensorFlow" })}
//                       style={{ marginRight: '10px' }}
//                     >
//                       TensorFlow
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       onClick={() => setFormData({ ...formData, ai_used_details: "PyTorch" })}
//                     >
//                       PyTorch
//                     </Button>
//                     <Form.Group controlId="aiUsedDetails" style={{ marginTop: '10px' }}>
//                       <Form.Label>AI Tool</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={3}
//                         value={formData.ai_used_details}
//                         onChange={(e) => setFormData({ ...formData, ai_used_details: e.target.value })}
//                         placeholder="Details about the selected AI tool"
//                       />
//                     </Form.Group>
//                   </div>
//                 )}
//               </Form.Group>
//             </div>
//           </div>

//           {/* Submit Button */}
//           {/* <Button variant="primary" type="submit">Submit</Button> */}
//         {/* </Form>
//       </div>
//     </Card.Body>
//   </Card> */}


//                 <br />


//                 {/* Display the error message if validation fails */}
//                 {/* {errorMessage && (
//                     <div className="alert alert-danger">
//                       {errorMessage}
//                     </div>
//                   )} */}

//                 {/* Submit Button */}
//                 <Button variant="primary" type="submit"
//                   style={{ fontWeight: 'bold', color: '#ffffff', backgroundColor: '#000d6b', borderColor: '#000d6b', }}
//                   onClick={handleSubmitClick} >
//                   Submit
//                 </Button>



//               </Form>
//             </div> {/* End of scrollable wrapper */}
//           </Card.Body>
//         </Card>
//       )}

//       {/* Confirmation Popup */}
//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup">
//             <h3>Confirm Project Details</h3>
//             {/* <p>Are you sure you want to proceed with the project "{projectName}"?</p> */}
//             <p>Are you sure you want to proceed with the project "{selectedProject ? selectedProject : projectName}"?</p>
//             <button onClick={handleProjectDetailsSubmit} >Yes, Proceed</button>
//             <button onClick={handlePopupCancel}>Cancel</button>

//             {/* Display Success Message in the Popup */}
//             {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
//           </div>
//         </div>
//       )}

//       {/* Modal for creating tester */}
//       <Modal show={showCreateTesterModal} onHide={() => setShowCreateTesterModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Create New Tester</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleCreateTester(e.target.testerName.value, selectedTesterType);
//             }}
//           >
//             <Form.Group controlId="testerName">
//               <Form.Label>Tester Name:</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="testerName"
//                 required
//               />
//             </Form.Group>
//             <Button variant="primary" type="submit">Create Tester</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default AddProjectWithDetails;



import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Modal, Dropdown, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

// SVG Imports
import addproject from "../panel/assets/addproject.svg";

// css

import "./AddProject.css"


//validation
import { useDispatch, useSelector } from 'react-redux';

import { validateField } from '../validation/store';  
import { validateProjectName, validateConfirmProjectName } from './validation';


const AddProjectWithDetails = ({ projectNameProp }) => {
  const [projectName, setProjectName] = useState(projectNameProp);
  const [confirmProjectName, setConfirmProjectName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateDetails, setShowCreateDetails] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // State for the confirmation popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for the success popup
  const [errorMessage, setErrorMessage] = useState("");
  const [hoveredOption, setHoveredOption] = useState('');

  // for pending form 

  const [pendingProjects, setPendingProjects] = useState([]); // State to store pending projects
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');


  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({
    project_name_id: '',
    RAG: '',
    tester_count: 0, // Initialize with 0
    billable: [],
    nonbillable: [],
    billing_type: '',
    RAG_details: '',
    automation: false,
    ai_used: false,
  });

  const [testers, setTesters] = useState([]);
  const [loadingTesters, setLoadingTesters] = useState(false);
  const [showCreateTesterModal, setShowCreateTesterModal] = useState(false);
  const [selectedTesterType, setSelectedTesterType] = useState('');
  const [selectedTesters, setSelectedTesters] = useState({
    billable: [],
    nonbillable: [],
  });

  const handleIconClick = () => setShowForm(true);

  useEffect(() => {

    // Load the saved form data from sessionStorage (if any)
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData)); // Set the form data to saved state
    }

  }, [showCreateDetails]); // Run only on initial render (mount) or page refresh


  // Step 2: Save form data to sessionStorage whenever formData changes
  useEffect(() => {
    if (formData) {
      sessionStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData]); // This effect runs every time formData changes


  // for validation 

  const dispatch = useDispatch();
  const { errors } = useSelector((state) => state.formValidation);

  const handleBlur = (field) => {
    let error = '';
    if (field === 'projectName') {
      error = validateProjectName(projectName, confirmProjectName);
    } else if (field === 'confirmProjectName') {
      error = validateConfirmProjectName(confirmProjectName);
    }

    // Dispatch the validation error to Redux store
    dispatch(validateField({ field, error }));
  };


  const fetchTesters = async () => {
    setLoadingTesters(true);
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setError('No access token found. Please login.');
        return;
      }

      const response = await fetch('http://localhost:5000/tester-billable', {
        // const response = await fetch('http://localhost:5000/tester-billable', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
 
      const data = await response.json();
      setTesters(data.testers || []);
    } catch (error) {
      console.error('Error fetching testers:', error);
      setError('Error fetching testers: ' + error.message);
    } finally {
      setLoadingTesters(false);
    }
  };

  useEffect(() => {
    fetchTesters();
  }, []);

  const handleTesterSelection = (tester, type) => {
    const updatedList = selectedTesters[type].find(item => item.tester_name === tester.tester_name)
      ? selectedTesters[type].filter(item => item.tester_name !== tester.tester_name)
      // : [...selectedTesters[type], { ...tester, project_name: projectName }];
      : [...selectedTesters[type], { ...tester, project_name: selectedProject ? selectedProject : projectName }];

    const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };

    setSelectedTesters(updatedSelectedTesters);
    updateTesterCount(updatedSelectedTesters);
  };

  const handleCreateTester = async (testerName, type) => {
    const newTester = {
      tester_name: testerName,
      // project_name: projectName,
      project_name: selectedProject ? selectedProject : projectName,
      billable: type === 'billable',
    };

    const updatedList = type === 'billable' ? [...selectedTesters.billable, newTester] : [...selectedTesters.nonbillable, newTester];
    const updatedSelectedTesters = { ...selectedTesters, [type]: updatedList };

    setSelectedTesters(updatedSelectedTesters);
    updateTesterCount(updatedSelectedTesters);
    setShowCreateTesterModal(false);
  };

  const updateTesterCount = (updatedSelectedTesters) => {
    const totalCount = updatedSelectedTesters.billable.length + updatedSelectedTesters.nonbillable.length;
    setFormData({ ...formData, tester_count: totalCount });
  };


  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    if (projectName !== confirmProjectName) {
      setError('Project names do not match.');
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) throw new Error('User is not authenticated');

      setIsPending(true);

      const requestBody = {
        project_name: selectedProject ? selectedProject : projectName,
      };

      const response = await fetch('http://localhost:5000/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error && error.message === 'Project name already exists') {
          // If the project name already exists
          setError('Project name already exists.');
        } else {
          // Handle other errors
          throw new Error('Project creation failed');
        }
        return;  // Exit the function after handling the error
      }

      const projectDataResponse = await response.json();
      // setSuccessMessage('Project created successfully!');

      // Save the state in sessionStorage to indicate the project is created
      // sessionStorage.setItem('isProjectCreated', 'true');
      setShowCreateDetails(true);


    } catch (error) {
      setError('Error creating project: ' + error.message);
    } finally {
      setIsPending(false);
      setShowPopup(false); // Close the popup after submitting
    }
  };


  // Handle Submit (Trigger Popup)
  const handleSubmitClick = (e) => {
    e.preventDefault(); // Prevent form submission immediately
    setShowPopup(true); // Show the confirmation popup
  };


  const handlePopupCancel = () => {
    setShowPopup(false); // Close the popup without submitting
  };

  const handleProjectDetailsSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) throw new Error('User is not authenticated');

      setIsPending(true);

      const testersToSubmit = [
        ...selectedTesters.billable.map(tester => ({
          tester_name: tester.tester_name,
          // project_name: projectName,
          project_name: selectedProject ? selectedProject : projectName,
          billable: true,
        })),
        ...selectedTesters.nonbillable.map(tester => ({
          tester_name: tester.tester_name,
          // project_name: projectName,
          project_name: selectedProject ? selectedProject : projectName,
          billable: false,
        })),
      ];

      const createTestersResponse = await fetch('http://localhost:5000/tester-billable', {
        // const createTestersResponse = await fetch('http://localhost:5000/tester-billable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ testers: testersToSubmit }),
      });

      if (!createTestersResponse.ok) {
        throw new Error('Testers creation failed');
      }

      const testersResponseData = await createTestersResponse.json();
      console.log('Testers created successfully:', testersResponseData);

      const projectDetailsPayload = {
        // project_name: projectName,
        project_name: selectedProject ? selectedProject : projectName,
        RAG: formData.RAG,
        tester_count: formData.tester_count,
        testers: testersToSubmit,
        billing_type: formData.billing_type,
        RAG_details: formData.RAG_details,
        // automation: formData.automation === 'Yes',
        // ai_used: formData.ai_used === 'Yes',
        automation_details: formData.automation === 'Yes' ? formData.automation_details : '',
        ai_used_details: formData.ai_used === 'Yes' ? formData.ai_used_details : '',
      };

      // Validation: Check if all required fields are filled
      const requiredFields = [
        formData.RAG,
        formData.RAG_details,
        formData.billing_type,
        formData.automation,
        formData.ai_used,
        selectedTesters.billable.length > 0, // Ensure at least one billable tester is selected
        selectedTesters.nonbillable.length > 0, // Ensure at least one non-billable tester is selected
      ];

      // Check if any required field is missing or empty
      const allFieldsValid = requiredFields.every(field => field !== "" && field !== undefined && field !== null);

      if (!allFieldsValid) {
        setErrorMessage("Please fill in all required fields.");
        return; // Stop the form submission if validation fails
      }

      const response2 = await fetch('http://localhost:5000/create-project-details', {
        // const response2 = await fetch('http://localhost:5000/create-project-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(projectDetailsPayload),
      });

      // if (!response2.ok) throw new Error('Project details creation failed');

      // const projectDetailsResponse = await response2.json();
      // setSuccessMessage('Project details created successfully!');

      if (response2.ok) {
        // If POST request is successful, show success message
        setSuccessMessage('Project details updated successfully!');
        setShowPopup(false);
        setShowSuccessPopup(true);
        // Reload the page after a brief delay to allow success message to appear
        setTimeout(() => {
          window.location.reload(); // Reload the page
        }, 2000); // Adjust the timeout duration to suit your needs
      } else {
        // Handle failure if needed (e.g., show an error message)
        setSuccessMessage('Failed to update project details. Please try again.');
      }

      // Clear session data after completing the form
      // sessionStorage.removeItem('isProjectCreated');
      sessionStorage.removeItem('formData');

    } catch (error) {
      setError('Error creating project details: ' + error.message);
    } finally {
      setIsPending(false);
    }



    // setSuccessMessage('Project details submitted successfully!');
    setShowCreateDetails(false); // Hide the form after successful submission
    // setShowPopup(false); // Hide the popup after confirmation


    // navigate('/AdminPanel/project-info'); // Navigate after 2 seconds

    // window.location.reload();

    // setTimeout(() => {
    //   navigate('/AdminPanel/project-info'); // Navigate after 2 seconds
    // }, 2000);


  };



  // Fetch pending projects from API
  const fetchPendingProjects = async () => {
    setLoading(true);
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setError('No access token found. Please login.');
        return;
      }

      const response3 = await axios.get('http://localhost:5000/pending-project', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // console.log(response3.data);  // Log the entire response


      // Assuming the response3 returns an array of projects with project_name
      if (response3.data && Array.isArray(response3.data)) {
        setPendingProjects([response3.data.sample_data]); // Wrap it in an array
        // console.log(response3.data.sample_data);  // Log the fetched projects
      } else {
        // setError('No pending projects available.');
      }



      if (response3.data && Array.isArray(response3.data.sample_data)) {
        setPendingProjects(response3.data.sample_data);
        // console.log(response3.data.sample_data);  // Log the fetched projects
      } else {
        setError('No pending projects available.');
      }

    } catch (err) {
      setError('Failed to fetch pending projects.');
    } finally {
      setLoading(false);
    }
  };




  // Update this function to handle the project update button click
  const handleProjectUpdate = (project) => {
    // console.log(project.project_name)
    setProjectName(project.project_name); // Set the project name from the selected pending project

    setSelectedProject(project); // Set the selected project

    // If you want to show the "Create Project Details Form" after clicking update
    setShowCreateDetails(true);
  };

  // Fetch projects when component mounts
  useEffect(() => {
    fetchPendingProjects();
  }, []);



  const getAvailableTesters = (type) => {
    return testers.filter(tester =>
      !selectedTesters.billable.some(selectedTester => selectedTester.tester_name === tester.tester_name) &&
      !selectedTesters.nonbillable.some(selectedTester => selectedTester.tester_name === tester.tester_name)
    );
  };



// Color Option

  const handleHover = (value) => {
    
    setHoveredOption(value);
 
    
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, RAG: e.target.value });
  };

  return (
    <div className="container mt-5 mb-5 ">

      {/* Display SVG Icon or Form */}
      {/* {!showForm && (
        <div onClick={handleIconClick} style={{ cursor: 'pointer' }}>
          <img src={addproject} alt="addproject" style={{ width: '189px', height: '189px' }} />
          <p>Click to add project details here</p>
        </div>

      )} */}

      {/* Parent container with flexbox to display both sections side by side */}
      {showForm && !showCreateDetails && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>


          {/* Add Project Form */}
          <div style={{ width: "50%" }}>
            {showForm && !showCreateDetails && (
              <Card>
                <Card.Header
                  as="h5"
                  style={{ backgroundColor: "#000d6b", color: "#ffffff" }}
                >
                  Add Project
                </Card.Header>
                <Card.Body>
                  {error && <p className="text-danger">{error}</p>}
                  {successMessage && <p className="text-success">{successMessage}</p>}

                  <Form onSubmit={handleProjectSubmit}>
                    <Form.Group controlId="projectName">
                      <Form.Label>Project Name:</Form.Label>
                      <Form.Control
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        onBlur={() => handleBlur('projectName')}
                        isInvalid={!!errors.projectName}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="confirmProjectName">
                      <Form.Label>Confirm Project Name:</Form.Label>
                      <Form.Control
                        type="text"
                        value={confirmProjectName}
                        onChange={(e) => setConfirmProjectName(e.target.value)}
                        onBlur={() => handleBlur('projectName')}
                        isInvalid={!!errors.projectName}
                        required
                      />
                    </Form.Group>
                    <br />
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isPending}
                      style={{
                        fontWeight: "bold",
                        color: "#ffffff",
                        backgroundColor: "#000d6b",
                        borderColor: "#000d6b",
                      }}
                    >
                      {isPending ? "Creating..." : "Create Project"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </div>

          {/* Left Section: Display Pending Projects */}
          <div style={{ width: '45%' }}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                {pendingProjects.length === 0 ? (
                  <p>No pending projects available.</p>
                ) : (
                  <Card>
                    <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
                      Pending Projects
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        {/* Dropdown for selecting project */}
                        <Form.Group>
                          <Form.Label>Project Name:</Form.Label>
                          <Form.Control
                            as="select"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                          // onChange={(e) => setProjectName(e.target.value)}
                          >
                            <option value="">Select a project</option>
                            {pendingProjects.map((projectName, index) => (
                              <option key={index} value={projectName}>
                                {projectName}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Status:</Form.Label>
                          <Form.Control
                            as="select"
                            value="Pending"
                            readOnly
                            style={{ borderColor: 'orange' }} // Apply warning color for Pending
                          >
                            <option>Pending</option>
                          </Form.Control>
                        </Form.Group>
                        <br />
                        <Button
                          variant="primary"
                          onClick={() => handleProjectUpdate(selectedProject)} // Pass the selected project name
                          disabled={isPending}
                          style={{
                            fontWeight: 'bold',
                            color: '#ffffff',
                            backgroundColor: '#000d6b',
                            borderColor: '#000d6b',
                          }}
                        >
                          {isPending ? 'Proceeding...' : 'Proceed with Update'}
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                )}
              </div>
            )}
          </div>



        </div>
      )}

      {/* Create Project Details Form */}
      {showCreateDetails && (
        <Card className="mt-4">
          <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff' }}>
            Add Project Details
          </Card.Header>
          <Card.Body>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}> {/* Apply Scroll on Overflow */}
              <Form onSubmit={handleProjectDetailsSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    {/* Project Name */}
                    <Form.Group controlId="project_name_id">
                      <Form.Label>Project Name:</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedProject ? selectedProject : projectName}
                        readOnly
                      />
                    </Form.Group>

                    {/* RAG */}
                    <Form.Group controlId="RAG">
                            <Form.Label>RAG</Form.Label>
                            <Form.Control
                              as="select"
                              value={formData.RAG}
                              onChange={handleChange}
                              onBlur={() => {}}
                              isInvalid={!!formData.RAG}
                              required
                              style={{
                                padding: '10px',
                                borderRadius: '4px',
                                fontSize: '16px',
                              }}
                            >
                              <option value="">Select RAG</option>
                              <option
                                value="Green"
                                style={{
                                  backgroundColor: hoveredOption === 'Green' ? '#28a745' : '',
                                  color: hoveredOption === 'Green' ? 'white' : '',
                                }}
                                onMouseEnter={() => handleHover('Green')}
                                onMouseLeave={() => setHoveredOption('')}
                              >
                                Green
                              </option>
                              <option
                                value="Amber"
                                style={{
                                  backgroundColor: hoveredOption === 'Amber' ? '#ffc107' : '',
                                  color: hoveredOption === 'Amber' ? 'black' : '',
                                }}
                                onMouseEnter={() => handleHover('Amber')}
                                onMouseLeave={() => setHoveredOption('')}
                              >
                                Amber
                              </option>
                              <option
                                value="Red"
                                style={{
                                  backgroundColor: hoveredOption === 'Red' ? '#dc3545' : '',
                                  color: hoveredOption === 'Red' ? 'white' : '',
                                }}
                                onMouseEnter={() => handleHover('Red')}
                                onMouseLeave={() => setHoveredOption('')}
                              >
                                Red
                              </option>
                            </Form.Control>
                          </Form.Group>


                    {/* RAG Details */}
                    <Form.Group controlId="RAG_Details">
                      <Form.Label>RAG Details</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.RAG_details}
                        onChange={(e) => setFormData({ ...formData, RAG_details: e.target.value })}
                        onBlur={() => handleBlur('projectName')}
                        isInvalid={!!errors.projectName}
                        required
                      />
                    </Form.Group>

                    {/* Billable Testers Dropdown */}
                    <Form.Group controlId="billable">
                      <Form.Label>Billable Testers</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          {selectedTesters.billable.length > 0
                            ? selectedTesters.billable.map(t => t.tester_name).join(', ')
                            : 'Select Billable Testers'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {loadingTesters ? (
                            <Dropdown.ItemText>
                              <Spinner animation="border" size="sm" />
                              Loading...
                            </Dropdown.ItemText>
                          ) : (
                            getAvailableTesters('billable').map(tester => (
                              <Dropdown.Item
                                key={tester.id}
                                onClick={() => handleTesterSelection(tester, 'billable')}
                              >
                                {tester.tester_name}
                              </Dropdown.Item>
                            ))
                          )}
                          <Dropdown.Item onClick={() => { setSelectedTesterType('billable'); setShowCreateTesterModal(true); }}>
                            Add New Tester
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                    {/* Non-Billable Testers Dropdown */}
                    <Form.Group controlId="nonbillable">
                      <Form.Label>Non-Billable Testers</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                          {selectedTesters.nonbillable.length > 0
                            ? selectedTesters.nonbillable.map(t => t.tester_name).join(', ')
                            : 'Select Non-Billable Testers'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {loadingTesters ? (
                            <Dropdown.ItemText>
                              <Spinner animation="border" size="sm" />
                              Loading...
                            </Dropdown.ItemText>
                          ) : (
                            getAvailableTesters('nonbillable').map(tester => (
                              <Dropdown.Item
                                key={tester.id}
                                onClick={() => handleTesterSelection(tester, 'nonbillable')}
                              >
                                {tester.tester_name}
                              </Dropdown.Item>
                            ))
                          )}
                          <Dropdown.Item onClick={() => { setSelectedTesterType('nonbillable'); setShowCreateTesterModal(true); }}>
                            Add New Tester
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>

                    {/* Billing Type Dropdown */}
                    <Form.Group controlId="billing_type">
                      <Form.Label>Billing Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={formData.billing_type}
                        onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
                        onBlur={() => handleBlur('projectName')}
                        isInvalid={!!errors.projectName}
                        required
                      >
                        <option value="">Select Billing Type</option>
                        <option value="T&M">T&M</option>
                        <option value="FIXED">FIXED</option>
                      </Form.Control>
                    </Form.Group>

                    {/* Automation Used Section */}
                    <Form.Group controlId="Automation">
                      <Form.Label>Automation Used</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="Yes"
                          value="Yes"
                          checked={formData.automation === 'Yes'}
                          onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
                        />
                        <Form.Check
                          type="radio"
                          label="No"
                          value="No"
                          checked={formData.automation === 'No'}
                          onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
                        />
                      </div>
                      {formData.automation === 'Yes' && (
                        <div>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, automation_details: "Selenium" })}
                            style={{ marginRight: '10px' }}
                          >
                            Selenium
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, automation_details: "Pytest" })}
                          >
                            Pytest
                          </Button>
                          <Form.Group controlId="automationDetails" style={{ marginTop: '10px' }}>
                            <Form.Label>Automation Tool</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={formData.automation_details}
                              onChange={(e) => setFormData({ ...formData, automation_details: e.target.value })}
                              placeholder="Details about the selected automation tool"
                            />
                          </Form.Group>
                        </div>
                      )}
                    </Form.Group>

                    {/* AI Used Section */}
                    <Form.Group controlId="AI">
                      <Form.Label>AI Used</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="Yes"
                          value="Yes"
                          checked={formData.ai_used === 'Yes'}
                          onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
                        />
                        <Form.Check
                          type="radio"
                          label="No"
                          value="No"
                          checked={formData.ai_used === 'No'}
                          onChange={(e) => setFormData({ ...formData, ai_used: e.target.value })}
                        />
                      </div>
                      {formData.ai_used === 'Yes' && (
                        <div>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, ai_used_details: "TensorFlow" })}
                            style={{ marginRight: '10px' }}
                          >
                            TensorFlow
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setFormData({ ...formData, ai_used_details: "PyTorch" })}
                          >
                            PyTorch
                          </Button>
                          <Form.Group controlId="aiUsedDetails" style={{ marginTop: '10px' }}>
                            <Form.Label>AI Tool</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={formData.ai_used_details}
                              onChange={(e) => setFormData({ ...formData, ai_used_details: e.target.value })}
                              placeholder="Details about the selected AI tool"
                            />
                          </Form.Group>
                        </div>
                      )}
                    </Form.Group>
                  </div>
                </div>

                {/* Submit Button */}
                {/* <Button variant="primary" type="submit">Submit</Button> */}
                {/* </Form>
      </div>
    </Card.Body>
  </Card> */}


                <br />


                {/* Display the error message if validation fails */}
                {/* {errorMessage && (
                    <div className="alert alert-danger">
                      {errorMessage}
                    </div>
                  )} */}

                {/* Submit Button */}
                <Button variant="primary" type="submit"
                  style={{ fontWeight: 'bold', color: '#ffffff', backgroundColor: '#000d6b', borderColor: '#000d6b', }}
                  onClick={handleSubmitClick} >
                  Submit
                </Button>



              </Form>
            </div> {/* End of scrollable wrapper */}
          </Card.Body>
        </Card>
      )}

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirm Project Details</h3>
            <p>
              Are you sure you want to proceed with the project "{selectedProject || projectName}"?
            </p>

            <Button onClick={handleProjectDetailsSubmit} style={{ marginRight: '10px' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Yes, Proceed'}
            </Button>
            <Button onClick={handlePopupCancel}>Cancel</Button>
          </div>
        </div>
      )}  

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Success</h3>
            <p style={{ color: 'green' }}>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Modal for creating tester */}
      <Modal show={showCreateTesterModal} onHide={() => setShowCreateTesterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Tester</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateTester(e.target.testerName.value, selectedTesterType);
            }}
          >
            <Form.Group controlId="testerName">
              <Form.Label>Tester Name:</Form.Label>
              <Form.Control
                type="text"
                name="testerName"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Create Tester</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddProjectWithDetails;


