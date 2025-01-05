// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Card, Form, Row, Col, Dropdown } from 'react-bootstrap';
// import axios from 'axios';

// const MetricsForm = () => {
//   const [showModal, setShowModal] = useState(true);
//   const [currentModal, setCurrentModal] = useState(1);
//   const [formData, setFormData] = useState({
//     defectLeakage: { cpDefect: '', uatDefect: '', totalDefects: '' },
//     defectDensity: { cpDefects: '', totalLinesOfCode: '' },
//     defectRemovalEfficiency: { cpDefects: '', uatDefects: '' },
//     automationCoverage: { totalAutomationTcExecuted: '', totalTestCases: '' },
//     testCasesEfficiency: { defectsDetectedByTestCase: '', totalDefects: '' },
//     testerProductivity: { numberOfTestCasesExecuted: '', numberOfTesters: '' },
//     defectSeverityIndex: { critical: '', high: '', medium: '', low: '' },
//     defectFixRate: { defectFixed: '', defectReportedLevels: '' },
//     defectRejectionRatio: { totalRejectedDefects: '', totalDefectsReported: '' },
//     meanTimeToFindDefect: { totalTimeToIdentifyDefects: '', totalNumberOfDefects: '' },
//     meanTimeToRepair: { totalTimeToFixDefects: '', totalDefectsFixed: '' },
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [projects, setProjects] = useState([]); // Initialize as an empty array
//   const [selectedProject, setSelectedProject] = useState(null); // To store the selected project

//   // Fetch the list of projects from the backend
//   const fetchPendingProjects = async () => {
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) {
//         setApiError('No access token found. Please login.');
//         return;
//       }

//       const response = await axios.get('http://localhost:5000/project-details', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       if (response.status === 200 && response.data.project_details) {
//         // Set the projects array with the full project objects (not just names)
//         setProjects(response.data.project_details);
//       } else {
//         setApiError('Failed to fetch projects.');
//       }
//     } catch (error) {
//       setApiError('Error fetching projects.');
//     }
//   };

//   // Call fetchPendingProjects on mount
//   useEffect(() => {
//     fetchPendingProjects();
//   }, []);

//   const handleChange = (e, section, field) => {
//     setFormData({
//       ...formData,
//       [section]: {
//         ...formData[section],
//         [field]: e.target.value,
//       },
//     });
//   };

//   const handleNext = () => {
//     setCurrentModal(currentModal + 1);
//   };

//   const handleBack = () => {
//     setCurrentModal(currentModal - 1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!selectedProject) {
//       alert("Please select a project.");
//       return;
//     }

//     // Send only the project name in the payload
//     const dataToSubmit = {
//       ...formData,
//       project_name: selectedProject.project_name,  // Only include project name
//     };

//     try {
//       const response = await fetch('http://localhost:5000/calculate_metrics', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer YOUR_ACCESS_TOKEN_HERE`, // Token-based authentication
//         },
//         body: JSON.stringify(dataToSubmit),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit the form');
//       }

//       const responseData = await response.json();
//       console.log('Form Submitted Successfully:', responseData);

//       alert('Form Submitted Successfully');
//       setShowModal(false); // Close the modal after successful submission
//     } catch (error) {
//       console.error('Error:', error);
//       setApiError(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const keys = Object.keys(formData);
//   const numOfCards = Math.ceil(keys.length / 2);

//   const handleCloseModal = () => {
//     setShowModal(false); // Set the modal state to false to close it
//   };

//   return (
//     <div className="container mt-5">
//       <Card>
//         <Card.Header
//           as="h5"
//           style={{
//             backgroundColor: '#000d6b',
//             color: '#ffffff',
//             borderRadius: '10px 10px 0 0',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           Manage Metrics
//           <Button
//             variant="outline-light"
//             style={{
//               marginLeft: 'auto',
//               backgroundColor: 'transparent',
//               borderColor: '#ffffff',
//             }}
//             onClick={() => alert('View Project Clicked')}
//           >
//             View Project
//           </Button>
//         </Card.Header>

//         <Card.Body>
//           <Form onSubmit={handleSubmit}>
//             {/* Dynamic Modal Content */}
//             <Modal show={showModal} onHide={handleCloseModal} size="lg">
//               <Modal.Header closeButton>
//                 <Modal.Title>Metrics Form</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 {/* Project Selection Dropdown */}
//                 <Form.Group className="mb-3">
//                   <Form.Label>Select Project</Form.Label>
//                   <Dropdown onSelect={(selectedKey) => {
//                     // Find the project object based on the selected project name
//                     const selectedProject = projects.find(project => project.project_name === selectedKey);
//                     setSelectedProject(selectedProject);
//                   }}>
//                     <Dropdown.Toggle variant="success" id="dropdown-basic">
//                       {selectedProject ? selectedProject.project_name : 'Select a Project'}
//                     </Dropdown.Toggle>

//                     <Dropdown.Menu>
//                       {projects && projects.length > 0 ? (
//                         projects.map((project) => (
//                           <Dropdown.Item key={project.project_name} eventKey={project.project_name}>
//                             {project.project_name}
//                           </Dropdown.Item>
//                         ))
//                       ) : (
//                         <Dropdown.Item disabled>No projects available</Dropdown.Item>
//                       )}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </Form.Group>

//                 <Row>
//                   {/* Loop through fields to show two cards at a time */}
//                   {keys.slice((currentModal - 1) * 2, currentModal * 2).map((key) => {
//                     const sectionData = formData[key];
//                     return (
//                       <Col md={6} key={key}>
//                         <Card>
//                           <Card.Header
//                             as="h5"
//                             style={{
//                               backgroundColor: '#000d6b',
//                               color: '#ffffff',
//                               borderRadius: '10px 10px 0 0',
//                             }}
//                           >
//                             {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
//                           </Card.Header>
//                           <Card.Body>
//                             {Object.keys(sectionData).map((field) => (
//                               <Form.Group className="mb-3" key={field}>
//                                 <Form.Label>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</Form.Label>
//                                 <Form.Control
//                                   type="number"
//                                   value={sectionData[field]}
//                                   onChange={(e) => handleChange(e, key, field)}
//                                   required
//                                 />
//                               </Form.Group>
//                             ))}
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     );
//                   })}
//                 </Row>
//               </Modal.Body>
//               <Modal.Footer>
//                 <Button variant="secondary" onClick={handleBack} disabled={currentModal === 1}>
//                   Back
//                 </Button>
//                 <Button
//                   variant="primary"
//                   type={currentModal === numOfCards ? 'submit' : 'button'}
//                   onClick={currentModal === numOfCards ? handleSubmit : handleNext}
//                   disabled={currentModal === numOfCards && isSubmitting}
//                   style={{
//                     backgroundColor: '#000d6b',
//                     borderColor: '#000d6b',
//                     fontWeight: 'bold',
//                     color: '#ffffff',
//                   }}
//                 >
//                   {currentModal === numOfCards ? (isSubmitting ? 'Submitting...' : 'Submit') : 'Next'}
//                 </Button>
//               </Modal.Footer>
//             </Modal>
//           </Form>
//         </Card.Body>
//       </Card>

//       {apiError && (
//         <div className="alert alert-danger mt-3">
//           <strong>Error!</strong> {apiError}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MetricsForm;




// import React, { useState, useEffect } from 'react';
// import { Card, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// const MetricsForm = () => {
//   const [formData, setFormData] = useState({
//     defectLeakage: { cpDefect: '', uatDefect: '', totalDefects: '' },
//     defectDensity: { cpDefects: '', totalLinesOfCode: '' },
//     defectRemovalEfficiency: { cpDefects: '', uatDefects: '' },
//     automationCoverage: { totalAutomationTcExecuted: '', totalTestCases: '' },
//     testCasesEfficiency: { defectsDetectedByTestCase: '', totalDefects: '' },
//     testerProductivity: { numberOfTestCasesExecuted: '', numberOfTesters: '' },
//     defectSeverityIndex: { critical: '', high: '', medium: '', low: '' },
//     defectFixRate: { defectFixed: '', defectReportedLevels: '' },
//     defectRejectionRatio: { totalRejectedDefects: '', totalDefectsReported: '' },
//     meanTimeToFindDefect: { totalTimeToIdentifyDefects: '', totalNumberOfDefects: '' },
//     meanTimeToRepair: { totalTimeToFixDefects: '', totalDefectsFixed: '' },
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);

//   const navigate = useNavigate(); // Hook to navigate programmatically

//   // Fetch the list of projects from the backend
//   const fetchPendingProjects = async () => {
//     try {
//       const accessToken = sessionStorage.getItem('access_token');
//       if (!accessToken) {
//         setApiError('No access token found. Please login.');
//         return;
//       }

//       const response = await axios.get('http://localhost:5000/project-details', {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });

//       if (response.status === 200 && response.data.project_details) {
//         setProjects(response.data.project_details);
//       } else {
//         setApiError('Failed to fetch projects.');
//       }
//     } catch (error) {
//       setApiError('Error fetching projects.');
//     }
//   };

//   // Call fetchPendingProjects on mount
//   useEffect(() => {
//     fetchPendingProjects();
//   }, []);

//   const handleChange = (e, section, field) => {
//     const value = e.target.value;
  
//     // Convert to integer if value is numeric, else leave it as a string (or set to empty string)
//     const parsedValue = value === '' ? '' : parseInt(value, 10);
  
//     setFormData({
//       ...formData,
//       [section]: {
//         ...formData[section],
//         [field]: parsedValue,
//       },
//     });
//   };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!selectedProject) {
//       alert("Please select a project.");
//       return;
//     }

//     // Prepare the current date and month
//     const currentDate = new Date();
//     const month = currentDate.toLocaleString('default', { month: 'long' });  // Get the full month name
//     const date = currentDate.toISOString().split('T')[0];  // Get the date in YYYY-MM-DD format

//     // Prepare the payload to submit
//     const dataToSubmit = {
//       month: month,
//       date: date,
//       project_name: selectedProject.project_name,  // Only include project name
//       defectLeakage: {
//         cpDefect: formData.defectLeakage.cpDefect,
//         uatDefect: formData.defectLeakage.uatDefect,
//         totalDefects: formData.defectLeakage.totalDefects,
//       },
//       defectDensity: {
//         cpDefects: formData.defectDensity.cpDefects,
//         totalLinesOfCode: formData.defectDensity.totalLinesOfCode,
//       },
//       defectRemovalEfficiency: {
//         cpDefects: formData.defectRemovalEfficiency.cpDefects,
//         uatDefects: formData.defectRemovalEfficiency.uatDefects,
//       },
//       automationCoverage: {
//         totalAutomationTcExecuted: formData.automationCoverage.totalAutomationTcExecuted,
//         totalTestCases: formData.automationCoverage.totalTestCases,
//       },
//       testCasesEfficiency: {
//         defectsDetectedByTestCase: formData.testCasesEfficiency.defectsDetectedByTestCase,
//         totalDefects: formData.testCasesEfficiency.totalDefects,
//       },
//       testerProductivity: {
//         numberOfTestCasesExecuted: formData.testerProductivity.numberOfTestCasesExecuted,
//         numberOfTesters: formData.testerProductivity.numberOfTesters,
//       },
//       defectSeverityIndex: {
//         critical: formData.defectSeverityIndex.critical,
//         high: formData.defectSeverityIndex.high,
//         medium: formData.defectSeverityIndex.medium,
//         low: formData.defectSeverityIndex.low,
//       },
//       defectFixRate: {
//         defectFixed: formData.defectFixRate.defectFixed,
//         defectReportedLevels: formData.defectFixRate.defectReportedLevels,
//       },
//       defectRejectionRatio: {
//         totalRejectedDefects: formData.defectRejectionRatio.totalRejectedDefects,
//         totalDefectsReported: formData.defectRejectionRatio.totalDefectsReported,
//       },
//       meanTimeToFindDefect: {
//         totalTimeToIdentifyDefects: formData.meanTimeToFindDefect.totalTimeToIdentifyDefects,
//         totalNumberOfDefects: formData.meanTimeToFindDefect.totalNumberOfDefects,
//       },
//       meanTimeToRepair: {
//         totalTimeToFixDefects: formData.meanTimeToRepair.totalTimeToFixDefects,
//         totalDefectsFixed: formData.meanTimeToRepair.totalDefectsFixed,
//       },
//     };

//     // Get the token from session storage or wherever you store it
//     const accessToken = sessionStorage.getItem('access_token');
//     if (!accessToken) {
//       alert("No access token found. Please login.");
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/create-matrix-inputs', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`, // Include the token here
//         },
//         body: JSON.stringify(dataToSubmit), // Send the data as JSON
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit the form');
//       }

//       const responseData = await response.json();
//       console.log('Form Submitted Successfully:', responseData);

//       // Redirect after successful submission
//       navigate('/TestLead/project-info'); // Redirects to project info page

//       alert('Form Submitted Successfully');
//     } catch (error) {
//       console.error('Error:', error);
//       setApiError(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container mt-5" style={{ backgroundColor: '#f0f8ff', padding: '30px', borderRadius: '10px' }}>
//       <Card>
//         <Card.Header
//           as="h5"
//           style={{
//             backgroundColor: '#000d6b',
//             color: '#ffffff',
//             borderRadius: '10px 10px 0 0',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             padding: '10px 20px',
//           }}
//         >
//           Manage Metrics
//           <Button
//             variant="outline-light"
//             style={{
//               marginLeft: 'auto',
//               backgroundColor: 'transparent',
//               borderColor: '#ffffff',
//             }}
//             onClick={() => alert('View Project Clicked')}
//           >
//             View Project
//           </Button>
//         </Card.Header>

//         <Card.Body style={{ backgroundColor: '#ffffff', padding: '30px' }}>
//           <Form onSubmit={handleSubmit}>
//             {/* Project Selection Dropdown */}
//             <Form.Group className="mb-4">
//               <Form.Label>Select Project</Form.Label>
//               <Dropdown onSelect={(selectedKey) => {
//                 const selectedProject = projects.find(project => project.project_name === selectedKey);
//                 setSelectedProject(selectedProject);
//               }}>
//                 <Dropdown.Toggle variant="success" id="dropdown-basic">
//                   {selectedProject ? selectedProject.project_name : 'Select a Project'}
//                 </Dropdown.Toggle>

//                 <Dropdown.Menu>
//                   {projects.length > 0 ? (
//                     projects.map((project) => (
//                       <Dropdown.Item key={project.project_name} eventKey={project.project_name}>
//                         {project.project_name}
//                       </Dropdown.Item>
//                     ))
//                   ) : (
//                     <Dropdown.Item disabled>No projects available</Dropdown.Item>
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>
//             </Form.Group>

//             {/* Display Form Fields for each metric with a more consistent layout */}
//             {Object.keys(formData).map((key) => {
//               const sectionData = formData[key];
//               return (
//                 <div key={key} className="mb-4">
//                   <div
//                     style={{
//                       backgroundColor: '#000d6b', // Dark Blue for the section header
//                       color: 'white',
//                       padding: '10px',
//                       borderRadius: '10px 10px 0 0',
//                     }}
//                   >
//                     <h5>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</h5>
//                   </div>
//                   <div
//                     style={{
//                       padding: '20px',
//                       borderRadius: '0 0 10px 10px',
//                     }}
//                   >
//                     <Row>
//                       {Object.keys(sectionData).map((field) => (
//                         <Col md={4} key={`${key}-${field}`} className="mb-3">
//                           <Form.Group>
//                             <Form.Label>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</Form.Label>
//                             <Form.Control
//                               type="number"
//                               value={sectionData[field]}
//                               onChange={(e) => handleChange(e, key, field)}
//                               required
//                             />
//                           </Form.Group>
//                         </Col>
//                       ))}
//                     </Row>
//                   </div>
//                 </div>
//               );
//             })}

//             <div className="text-center">
//               <Button
//                 variant="primary"
//                 type="submit"
//                 disabled={isSubmitting}
//                 style={{
//                   backgroundColor: '#000d6b',
//                   borderColor: '#000d6b',
//                   fontWeight: 'bold',
//                   color: '#ffffff',
//                   padding: '10px 20px',
//                   fontSize: '16px',
//                 }}
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit'}
//               </Button>
//             </div>
//           </Form>
//         </Card.Body>
//       </Card>

//       {apiError && (
//         <div className="alert alert-danger mt-3">
//           <strong>Error!</strong> {apiError}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MetricsForm;





import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Dropdown, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MetricsForm = () => {
  const [formData, setFormData] = useState({
    defectLeakage: { cpDefect: '', uatDefect: '', totalDefects: '' },
    defectDensity: { cpDefects: '', totalLinesOfCode: '' },
    defectRemovalEfficiency: { cpDefects: '', uatDefects: '' },
    automationCoverage: { totalAutomationTcExecuted: '', totalTestCases: '' },
    testCasesEfficiency: { defectsDetectedByTestCase: '', totalDefects: '' },
    testerProductivity: { numberOfTestCasesExecuted: '', numberOfTesters: '' },
    defectSeverityIndex: { critical: '', high: '', medium: '', low: '' },
    defectFixRate: { defectFixed: '', defectReportedLevels: '' },
    defectRejectionRatio: { totalRejectedDefects: '', totalDefectsReported: '' },
    meanTimeToFindDefect: { totalTimeToIdentifyDefects: '', totalNumberOfDefects: '' },
    meanTimeToRepair: { totalTimeToFixDefects: '', totalDefectsFixed: '' },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for the modal visibility
  const [projectDetails, setProjectDetails] = useState(null); // To store the selected project details
  const [selectedProjectId, setSelectedProjectId] = useState(null); // To store the selected project ID
  const navigate = useNavigate();

  // Fetch the list of projects from the backend
  const fetchPendingProjects = async () => {
    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setApiError('No access token found. Please login.');
        return;
      }

      const response = await axios.get('http://localhost:5000/project-details', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 && response.data.project_details) {
        setProjects(response.data.project_details);
      } else {
        setApiError('Failed to fetch projects.');
      }
    } catch (error) {
      setApiError('Error fetching projects.');
    }
  };

  // Call fetchPendingProjects on mount
  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const handleChange = (e, section, field) => {
    const value = e.target.value;

    // Convert to integer if value is numeric, else leave it as a string (or set to empty string)
    const parsedValue = value === '' ? '' : parseInt(value, 10);

    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: parsedValue,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedProject) {
      alert("Please select a project.");
      return;
    }

    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const date = currentDate.toISOString().split('T')[0];

    const dataToSubmit = {
      month: month,
      date: date,
      project_name: selectedProject.project_name,
      defectLeakage: formData.defectLeakage,
      defectDensity: formData.defectDensity,
      defectRemovalEfficiency: formData.defectRemovalEfficiency,
      automationCoverage: formData.automationCoverage,
      testCasesEfficiency: formData.testCasesEfficiency,
      testerProductivity: formData.testerProductivity,
      defectSeverityIndex: formData.defectSeverityIndex,
      defectFixRate: formData.defectFixRate,
      defectRejectionRatio: formData.defectRejectionRatio,
      meanTimeToFindDefect: formData.meanTimeToFindDefect,
      meanTimeToRepair: formData.meanTimeToRepair,
    };

    const accessToken = sessionStorage.getItem('access_token');
    if (!accessToken) {
      alert("No access token found. Please login.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/create-matrix-inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }

      const responseData = await response.json();
      console.log('Form Submitted Successfully:', responseData);

      navigate('/TestLead/project-info');
      alert('Form Submitted Successfully');
    } catch (error) {
      console.error('Error:', error);
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewProject = async () => {
    if (!selectedProjectId) {
      alert("Please select a project.");
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) {
        setApiError('No access token found. Please login.');
        return;
      }

      const response = await axios.get(`http://localhost:5000/get-matrix-inputs/${selectedProjectId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setProjectDetails(response.data);  // Set the project details in the modal
        setShowModal(true); // Show the modal with the project details
      } else {
        setApiError('Failed to fetch project details.');
      }
    } catch (error) {
      setApiError('Error fetching project details.');
    }
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: '#f0f8ff', padding: '30px', borderRadius: '10px' }}>
      <Card>
        <Card.Header
          as="h5"
          style={{
            backgroundColor: '#000d6b',
            color: '#ffffff',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
          }}
        >
          Manage Metrics
          <Button
            variant="outline-light"
            style={{
              marginLeft: 'auto',
              backgroundColor: 'transparent',
              borderColor: '#ffffff',
            }}
            onClick={() => setShowModal(true)} // Show the modal when the button is clicked
          >
            View Project
          </Button>
        </Card.Header>

        <Card.Body style={{ backgroundColor: '#ffffff', padding: '30px' }}>
          <Form onSubmit={handleSubmit}>
            {/* Project Selection Dropdown */}
            <Form.Group className="mb-4">
              <Form.Label>Select Project</Form.Label>
              <Dropdown onSelect={(selectedKey) => {
                const selectedProject = projects.find(project => project.project_name === selectedKey);
                setSelectedProject(selectedProject);
                setSelectedProjectId(selectedProject ? selectedProject.id : null);
              }}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedProject ? selectedProject.project_name : 'Select a Project'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <Dropdown.Item key={project.project_name} eventKey={project.project_name}>
                        {project.project_name}
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled>No projects available</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            {/* Display Form Fields for each metric with a more consistent layout */}
            {Object.keys(formData).map((key) => {
              const sectionData = formData[key];
              return (
                <div key={key} className="mb-4">
                  <div
                    style={{
                      backgroundColor: '#000d6b',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '10px 10px 0 0',
                    }}
                  >
                    <h5>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</h5>
                  </div>
                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '0 0 10px 10px',
                    }}
                  >
                    <Row>
                      {Object.keys(sectionData).map((field) => (
                        <Col md={4} key={`${key}-${field}`} className="mb-3">
                          <Form.Group>
                            <Form.Label>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</Form.Label>
                            <Form.Control
                              type="number"
                              value={sectionData[field]}
                              onChange={(e) => handleChange(e, key, field)}
                              required
                            />
                          </Form.Group>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              );
            })}

            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#000d6b',
                  borderColor: '#000d6b',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  padding: '10px 20px',
                  fontSize: '16px',
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {apiError && (
        <div className="alert alert-danger mt-3">
          <strong>Error!</strong> {apiError}
        </div>
      )}

      {/* Modal for selecting and viewing project details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>View Project</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Dropdown for selecting the project */}
    <Form.Group className="mb-4">
      <Form.Label>Select a Project</Form.Label>
      <Dropdown
        onSelect={(selectedKey) => {
          const selectedProject = projects.find((project) => project.project_name === selectedKey);
          setSelectedProject(selectedProject);
          setSelectedProjectId(selectedProject ? selectedProject.id : null);
        }}
      >
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedProject ? selectedProject.project_name : 'Select a Project'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Dropdown.Item key={project.project_name} eventKey={project.project_name}>
                {project.project_name}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>No projects available</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </Form.Group>

    {/* Button to fetch project details */}
    <div className="text-center">
      <Button variant="primary" onClick={handleViewProject} disabled={!selectedProjectId}>
        View
      </Button>
    </div>

    {/* Display project details if available */}
    {projectDetails ? (
      <div>
        <h5>Project Metrics</h5>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Defect Leakage</td>
              <td>{projectDetails.defectLeakage ? projectDetails.defectLeakage.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Defect Density</td>
              <td>{projectDetails.defectDensity ? projectDetails.defectDensity.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Defect Fix Rate</td>
              <td>{projectDetails.defectFixRate ? projectDetails.defectFixRate.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Defect Rejection Ratio</td>
              <td>{projectDetails.defectRejectionRatio ? projectDetails.defectRejectionRatio.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Defect Removal Efficiency</td>
              <td>{projectDetails.defectRemovalEfficiency ? projectDetails.defectRemovalEfficiency.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Defect Severity Index</td>
              <td>{projectDetails.defectSeverityIndex ? projectDetails.defectSeverityIndex.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Mean Time to Find Defect</td>
              <td>{projectDetails.meanTimeToFindDefect ? projectDetails.meanTimeToFindDefect.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Mean Time to Repair</td>
              <td>{projectDetails.meanTimeToRepair ? projectDetails.meanTimeToRepair.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Automation Coverage</td>
              <td>{projectDetails.automationCoverage ? projectDetails.automationCoverage.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Test Cases Efficiency</td>
              <td>{projectDetails.testCasesEfficiency ? projectDetails.testCasesEfficiency.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Tester Productivity</td>
              <td>{projectDetails.testerProductivity ? projectDetails.testerProductivity.toFixed(2) : 'N/A'}</td>
            </tr>
            <tr>
              <td>Month</td>
              <td>{projectDetails.month || 'N/A'}</td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{projectDetails.date ? new Date(projectDetails.date).toLocaleDateString() : 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ) : (
      <p>Loading project details...</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>





    </div>
  );
};

export default MetricsForm;
