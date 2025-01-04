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






import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Form, Row, Col, Dropdown } from 'react-bootstrap';
import axios from 'axios';

const MetricsForm = () => {
  const [showModal, setShowModal] = useState(true);
  const [currentModal, setCurrentModal] = useState(1);
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
  const [projects, setProjects] = useState([]); // Initialize as an empty array
  const [selectedProject, setSelectedProject] = useState(null); // To store the selected project

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
        // Set the projects array with the full project objects (not just names)
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
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: e.target.value,
      },
    });
  };

  const handleNext = () => {
    setCurrentModal(currentModal + 1);
  };

  const handleBack = () => {
    setCurrentModal(currentModal - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedProject) {
      alert("Please select a project.");
      return;
    }

    // Prepare the current date and month
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });  // Get the full month name
    const date = currentDate.toISOString().split('T')[0];  // Get the date in YYYY-MM-DD format

    // Prepare the payload to submit
    const dataToSubmit = {
        month: month,
        date: date,
        project_name: selectedProject.project_name,  // Only include project name
        defectLeakage: {
          cpDefect: formData.defectLeakage.cpDefect,
          uatDefect: formData.defectLeakage.uatDefect,
          totalDefects: formData.defectLeakage.totalDefects,
        },
        defectDensity: {
          cpDefects: formData.defectDensity.cpDefects,
          totalLinesOfCode: formData.defectDensity.totalLinesOfCode,
        },
        defectRemovalEfficiency: {
          cpDefects: formData.defectRemovalEfficiency.cpDefects,
          uatDefects: formData.defectRemovalEfficiency.uatDefects,
        },
        automationCoverage: {
          totalAutomationTcExecuted: formData.automationCoverage.totalAutomationTcExecuted,
          totalTestCases: formData.automationCoverage.totalTestCases,
        },
        testCasesEfficiency: {
          defectsDetectedByTestCase: formData.testCasesEfficiency.defectsDetectedByTestCase,
          totalDefects: formData.testCasesEfficiency.totalDefects,
        },
        testerProductivity: {
          numberOfTestCasesExecuted: formData.testerProductivity.numberOfTestCasesExecuted,
          numberOfTesters: formData.testerProductivity.numberOfTesters,
        },
        defectSeverityIndex: {
          critical: formData.defectSeverityIndex.critical,
          high: formData.defectSeverityIndex.high,
          medium: formData.defectSeverityIndex.medium,
          low: formData.defectSeverityIndex.low,
        },
        defectFixRate: {
          defectFixed: formData.defectFixRate.defectFixed,
          defectReportedLevels: formData.defectFixRate.defectReportedLevels,
        },
        defectRejectionRatio: {
          totalRejectedDefects: formData.defectRejectionRatio.totalRejectedDefects,
          totalDefectsReported: formData.defectRejectionRatio.totalDefectsReported,
        },
        meanTimeToFindDefect: {
          totalTimeToIdentifyDefects: formData.meanTimeToFindDefect.totalTimeToIdentifyDefects,
          totalNumberOfDefects: formData.meanTimeToFindDefect.totalNumberOfDefects,
        },
        meanTimeToRepair: {
          totalTimeToFixDefects: formData.meanTimeToRepair.totalTimeToFixDefects,
          totalDefectsFixed: formData.meanTimeToRepair.totalDefectsFixed,
        },
      };
      

    try {
      const response = await fetch('http://localhost:5000/create-matrix-inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_ACCESS_TOKEN_HERE`, // Token-based authentication
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }

      const responseData = await response.json();
      console.log('Form Submitted Successfully:', responseData);

      alert('Form Submitted Successfully');
      setShowModal(false); // Close the modal after successful submission
    } catch (error) {
      console.error('Error:', error);
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const keys = Object.keys(formData);
  const numOfCards = Math.ceil(keys.length / 2);

  const handleCloseModal = () => {
    setShowModal(false); // Set the modal state to false to close it
  };

  return (
    <div className="container mt-5">
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
            onClick={() => alert('View Project Clicked')}
          >
            View Project
          </Button>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Dynamic Modal Content */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Metrics Form</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Project Selection Dropdown */}
                <Form.Group className="mb-3">
                  <Form.Label>Select Project</Form.Label>
                  <Dropdown onSelect={(selectedKey) => {
                    // Find the project object based on the selected project name
                    const selectedProject = projects.find(project => project.project_name === selectedKey);
                    setSelectedProject(selectedProject);
                  }}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {selectedProject ? selectedProject.project_name : 'Select a Project'}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {projects && projects.length > 0 ? (
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

                <Row>
                  {/* Loop through fields to show two cards at a time */}
                  {keys.slice((currentModal - 1) * 2, currentModal * 2).map((key) => {
                    const sectionData = formData[key];
                    return (
                      <Col md={6} key={key}>
                        <Card>
                          <Card.Header
                            as="h5"
                            style={{
                              backgroundColor: '#000d6b',
                              color: '#ffffff',
                              borderRadius: '10px 10px 0 0',
                            }}
                          >
                            {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                          </Card.Header>
                          <Card.Body>
                            {Object.keys(sectionData).map((field) => (
                              <Form.Group className="mb-3" key={field}>
                                <Form.Label>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={sectionData[field]}
                                  onChange={(e) => handleChange(e, key, field)}
                                  required
                                />
                              </Form.Group>
                            ))}
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleBack} disabled={currentModal === 1}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  type={currentModal === numOfCards ? 'submit' : 'button'}
                  onClick={currentModal === numOfCards ? handleSubmit : handleNext}
                  disabled={currentModal === numOfCards && isSubmitting}
                  style={{
                    backgroundColor: '#000d6b',
                    borderColor: '#000d6b',
                    fontWeight: 'bold',
                    color: '#ffffff',
                  }}
                >
                  {currentModal === numOfCards ? (isSubmitting ? 'Submitting...' : 'Submit') : 'Next'}
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        </Card.Body>
      </Card>

      {apiError && (
        <div className="alert alert-danger mt-3">
          <strong>Error!</strong> {apiError}
        </div>
      )}
    </div>
  );
};

export default MetricsForm;

