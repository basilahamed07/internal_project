import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';

const ManageTestCaseCreationStatus = () => {
  const [testCaseStatuses, setTestCaseStatuses] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    total_test_case_created: '',
    test_case_approved: '',
    test_case_rejected: '',
    project_name_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false); // State for the Project Modal
  const [showDefectModal, setShowDefectModal] = useState(false); // State for the Defect Modal
  const [defects, setDefects] = useState([]); // State for defects
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Store selected project ID
  const [user_role, setUserRole] = useState(null);

  useEffect(() => {
    fetchTestCaseStatuses();
    fetchUserProjects();  // Fetch projects when the component mounts
  }, []);

  const fetchTestCaseStatuses = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:5000/test_case_creation_status', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setTestCaseStatuses(response.data);
    } catch (error) {
      console.error('Error fetching test case statuses:', error);
    }
  };

  const fetchUserProjects = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:5000/get-user-projects', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProjects(response.data.projects);  // Store the user's projects
      setUserRole(response.data.user_role);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  // Fetch defects when the "View Defect" button is clicked
  const handleViewDefect = async (projectId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://localhost:5000/test_case_creation_status/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefects(response.data); // Store defects in state
      setSelectedProjectId(projectId); // Store the selected project ID
      setShowDefectModal(true); // Show the Defect Modal
    } catch (error) {
      console.error('Error fetching defects:', error);
    }
  };

  // Close the project modal
  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
  };

  // Close the defect modal
  const handleCloseDefectModal = () => {
    setShowDefectModal(false);
  };

  const validateForm = () => {
    const requiredFields = [
      'date',
      'total_test_case_created',
      'test_case_approved',
      'test_case_rejected',
      'project_name_id'
    ];
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Automatically update total_test_case_created
    if (name === 'test_case_approved' || name === 'test_case_rejected') {
      const total = parseInt(newFormData.test_case_approved || 0) + parseInt(newFormData.test_case_rejected || 0);
      newFormData.total_test_case_created = total;
    }

    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const token = sessionStorage.getItem('access_token');
    const method = editingStatus ? 'PUT' : 'POST';
    const url = editingStatus
      ? `http://localhost:5000/test_case_creation_status/${editingStatus.id}`
      : 'http://localhost:5000/test_case_creation_status';

    try {
      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: formData
      });
      if (response.status === 200 || response.status === 201) {
        alert(editingStatus ? 'Status updated successfully!' : 'Status added successfully!');
        setEditingStatus(null);
        setFormData({
          date: '',
          total_test_case_created: '',
          test_case_approved: '',
          test_case_rejected: '',
          project_name_id: ''
        });
        fetchTestCaseStatuses();
      } else {
        alert('Failed to save status.');
      }
    } catch (error) {
      console.error('Error saving status:', error);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      const token = sessionStorage.getItem('access_token');
      try {
        const response = await axios.delete(`http://localhost:5000/test_case_creation_status/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          alert('Status deleted successfully!');
          fetchTestCaseStatuses();
        } else {
          alert('Failed to delete status.');
        }
      } catch (error) {
        console.error('Error deleting status:', error);
      }
    }
  };

  const handleEditClick = status => {
    setShowDefectModal(false);
    setShowProjectModal(false);
    setEditingStatus(status);
    setFormData({
      ...status,
      date: formatDate(status.date) // Make sure to set the correct date format
    });
  };

  // Handle View Button click, show the modal with the list of projects
  const handleViewClick = () => {
    setShowProjectModal(true);  // Show the project modal
  };

  const formatDate = date => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // This formats it to yyyy-mm-dd for input type="date"
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
            justifyContent: 'space-between', // This ensures the button is positioned to the right
            alignItems: 'center'
          }}
        >
          Manage Test Case Creation Statuses
          <Button
            variant="outline-light" // You can choose a different variant as needed
            style={{ marginLeft: 'auto', backgroundColor: 'transparent', borderColor: '#ffffff' }}
            onClick={handleViewClick} // When clicked, show the modal with projects
          >
            View Projects
          </Button>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
              <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    isInvalid={!!errors.date}
                    disabled={editingStatus} // Disable date input when editing
                  />
                  <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Total Test Case Created</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_test_case_created"
                    value={formData.total_test_case_created}
                    onChange={handleChange}
                    isInvalid={!!errors.total_test_case_created}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.total_test_case_created}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Test Case Approved</Form.Label>
                  <Form.Control
                    type="number"
                    name="test_case_approved"
                    value={formData.test_case_approved}
                    onChange={handleChange}
                    isInvalid={!!errors.test_case_approved}
                  />
                  <Form.Control.Feedback type="invalid">{errors.test_case_approved}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Test Case Rejected</Form.Label>
                  <Form.Control
                    type="number"
                    name="test_case_rejected"
                    value={formData.test_case_rejected}
                    onChange={handleChange}
                    isInvalid={!!errors.test_case_rejected}
                  />
                  <Form.Control.Feedback type="invalid">{errors.test_case_rejected}</Form.Control.Feedback>
                </Form.Group>
                {!editingStatus && (
                <Form.Group className="mb-3">
                  <Form.Label>Project Name ID</Form.Label>
                  <Form.Control
                    as="select"
                    name="project_name_id"
                    value={formData.project_name_id}
                    onChange={handleChange}
                    isInvalid={!!errors.project_name_id}
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.project_name_id}>
                        {project.project_name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.project_name_id}</Form.Control.Feedback>
                </Form.Group>
                )}
              </Col>
            </Row>

            <Button
              variant="primary"
              onClick={handleSubmit}
              style={{ backgroundColor: '#000d6b', borderColor: '#000d6b' }}
            >
              {editingStatus ? 'Update Status' : 'Add Status'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal for displaying the list of projects */}
      <Modal show={showProjectModal} onHide={handleCloseProjectModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>User Projects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project ID</th>
                <th>Actions</th> {/* Added Actions column */}
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.project_name}</td>
                  <td>{project.id}</td>
                  <td>
                    {/* View Defect button */}
                    <Button
                      variant="secondary"
                      onClick={() => handleViewDefect(project.id)}
                    >
                      View Defect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* Modal for displaying defects */}
      <Modal show={showDefectModal} onHide={handleCloseDefectModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Defects for Project {selectedProjectId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {defects.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Defect ID</th>
                  <th>Test_case_approved</th>
                  <th>Test_case_rejected</th>
                  {user_role === 'admin' && <th>actions</th>}
                </tr>
              </thead>
              <tbody>
                {defects.map((defect) => (
                  <tr key={defect.id}>
                    <td>{formatDate(defect.date)}</td>
                    <td>{defect.id}</td>
                    <td>{defect.test_case_approved}</td>
                    <td>{defect.test_case_rejected}</td>
                    {user_role === 'admin' && (  // Conditionally render the Actions column for admin
              <td>
                <Button
                  variant="outline-warning"
                  onClick={() => handleEditClick(defect)}
                  size="sm" // Smaller button size
                >
                  ✏️
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleDelete(defect.id)}
                  size="sm" // Smaller button size
                  style={{ marginLeft: '10px' }}
                >
                  🗑️
                </Button>
              </td>
            )}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No defects found for this project.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageTestCaseCreationStatus;
