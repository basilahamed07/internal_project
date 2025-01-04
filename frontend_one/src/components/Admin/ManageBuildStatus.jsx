import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';

const ManageBuildStatus = () => {
  const [buildStatuses, setBuildStatuses] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    total_build_received: '',
    builds_accepted: '',
    builds_rejected: '',
    project_name_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [defects, setDefects] = useState([]); // State for defects
  const [errors, setErrors] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state for table
  const [showDefectModal, setShowDefectModal] = useState(false); // Modal for defect details
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Store selected project ID
  const [showFormModal, setShowFormModal] = useState(false); // Modal for add/edit form
  const [user_role, setUserRole] = useState(null);

  useEffect(() => {
    fetchBuildStatuses();
    fetchUserProjects(); // Fetch projects when the component mounts
  }, []);

  useEffect(() => {
    if (formData.project_name_id) {
      fetchBuildStatuses(formData.project_name_id); // Fetch defects for the selected project
    }
  }, [formData.project_name_id]);
  console.log("formDataproject_name_id",formData.project_name_id)

  const fetchBuildStatuses = async (project_name_id) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://localhost:5000/build_status/${project_name_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setBuildStatuses(response.data);
      console.log("ERTYUIOIUYTRERHJKJHGF ;", response)
    } catch (error) {
      console.error('Error fetching build statuses:', error);
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
      setProjects(response.data.projects);
      setUserRole(response.data.user_role)
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'date',
      'total_build_received',
      'builds_accepted',
      'builds_rejected',
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

    if (name === 'builds_accepted' || name === 'builds_rejected') {
      // Automatically calculate total_build_received
      setFormData(prevData => {
        const newValue = name === 'builds_accepted'
          ? parseInt(value || 0) + (parseInt(prevData.builds_rejected) || 0)
          : parseInt(prevData.builds_accepted || 0) + parseInt(value || 0);
        return {
          ...prevData,
          [name]: value,
          total_build_received: newValue
        };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const token = sessionStorage.getItem('access_token');
    const method = editingStatus ? 'PUT' : 'POST';
    const url = editingStatus
      ? `http://localhost:5000/build_status/${editingStatus.id}`
      : 'http://localhost:5000/build_status';

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
          total_build_received: '',
          builds_accepted: '',
          builds_rejected: '',
          project_name_id: ''
        });
        setShowFormModal(false); // Close the form modal after submission
        fetchBuildStatuses();
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
        const response = await axios.delete(`http://localhost:5000/build_status/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          alert('Status deleted successfully!');
          fetchBuildStatuses();
        } else {
          alert('Failed to delete status.');
        }
      } catch (error) {
        console.error('Error deleting status:', error);
      }
    }
  };

  const handleEditClick = status => {
    setShowModal(false);
    setShowDefectModal(false);
    setEditingStatus(status);
    setFormData({
      date: new Date(status.date).toISOString().substring(0, 10), // Convert date to yyyy-mm-dd format
      total_build_received: status.total_build_received,
      builds_accepted: status.builds_accepted,
      builds_rejected: status.builds_rejected,
      project_name_id: status.project_name_id
    });
    // setShowFormModal(true); // Open the form modal for editing
  };

  const handleViewClick = async () => {
    // Fetch user projects when the "View" button is clicked
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:5000/get-user-projects', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProjects(response.data.projects); // Set the projects state with the fetched data
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleViewDefects = async (projectId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://localhost:5000/build_status/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefects(response.data);
      console.log("sdfghjkl",response) // Set defects data in state
      setSelectedProjectId(projectId); // Set selected project ID
      setShowDefectModal(true); // Show defect modal
    } catch (error) {
      console.error('Error fetching defects:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0]; // Current date in yyyy-mm-dd format

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
            alignItems: 'center'
          }}
        >
          Manage Build Statuses
          <Button
            variant="outline-light"
            style={{ marginLeft: 'auto', backgroundColor: 'transparent', borderColor: '#ffffff' }}
            onClick={handleViewClick} // Button now fetches user projects
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
                    max={today}
                    isInvalid={!!errors.date}
                    disabled={editingStatus}
                  />
                  <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Total Builds Received</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_build_received"
                    value={formData.total_build_received}
                    onChange={handleChange}
                    isInvalid={!!errors.total_build_received}
                    readOnly
                  />
                  <Form.Control.Feedback type="invalid">{errors.total_build_received}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Builds Accepted</Form.Label>
                  <Form.Control
                    type="number"
                    name="builds_accepted"
                    value={formData.builds_accepted}
                    onChange={handleChange}
                    isInvalid={!!errors.builds_accepted}
                  />
                  <Form.Control.Feedback type="invalid">{errors.builds_accepted}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Builds Rejected</Form.Label>
                  <Form.Control
                    type="number"
                    name="builds_rejected"
                    value={formData.builds_rejected}
                    onChange={handleChange}
                    isInvalid={!!errors.builds_rejected}
                  />
                  <Form.Control.Feedback type="invalid">{errors.builds_rejected}</Form.Control.Feedback>
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

      {/* Modal for displaying the user projects */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>User Projects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project ID</th>
                <th>View Defects</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.project_name}</td>
                  <td>{project.id}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleViewDefects(project.id)}
                    >
                      View Defects
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* Modal for displaying defects */}
      <Modal show={showDefectModal} onHide={() => setShowDefectModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Defects for Project ID: {selectedProjectId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Defect ID</th>
                <th>Builds Rejected</th>
                <th>Build Accepted</th>
                {user_role === 'admin' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {defects.length > 0 ? (
                defects.map(defect => (
                  <tr key={defect.id}>
                    <td>{defect.id}</td>
                    <td>{defect.builds_rejected}</td>
                    <td>{defect.builds_accepted}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No defects found for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* Modal for form */}
      <Modal show={showFormModal} onHide={handleCloseFormModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingStatus ? 'Edit Status' : 'Add Status'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* The form will be rendered above */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageBuildStatus;
