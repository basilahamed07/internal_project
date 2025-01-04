import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Button, Table, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';

const ManageDefectAcceptedRejected = () => {
  const [defectStatuses, setDefectStatuses] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    total_defects: 0,
    dev_team_accepted: 0,
    dev_team_rejected: 0,
    project_name_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [defects, setDefects] = useState([]);  // Store defects for a project
  const [errors, setErrors] = useState({});
  const [editingStatus, setEditingStatus] = useState(null);
  const [user_role, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showFormModal, setShowFormModal] = useState(false); // State for form modal
  const [showDefectsModal, setShowDefectsModal] = useState(false); // State for defects modal

  useEffect(() => {
    fetchDefectStatuses();
    fetchUserProjects(); // Fetch projects when the component mounts
  }, []);

  useEffect(() => {
    if (formData.project_name_id) {
      fetchDefectStatuses(formData.project_name_id); // Fetch defects for the selected project
    }
  }, [formData.project_name_id]);
  console.log("formDataproject_name_id",formData.project_name_id)

  const fetchDefectStatuses = async (project_name_id) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://localhost:5000/defect_accepted_rejected/${project_name_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefectStatuses(response.data); 
      console.log("TGHJUYHGFFGYHJKHGFGHJ",response)
    } catch (error) {
      console.error('Error fetching defect accepted/rejected statuses:', error);
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


      setUserRole(response.data.user_role); 

      
      console.log("dfghjkl", response) // Store the user's projects
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const fetchDefectsForProject = async (projectId) => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://localhost:5000/defect_accepted_rejected/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDefects(response.data);
      console.log("WERTYUIO",response) // Store the defects for the selected project
      setShowDefectsModal(true); // Show the defects modal
    } catch (error) {
      console.error('Error fetching defects for project:', error);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'date',
      'total_defects',
      'dev_team_accepted',
      'dev_team_rejected',
      'project_name_id'
    ];
    const newErrors = {};

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    if (formData.date > today) {
      newErrors.date = 'Date cannot be in the future.';
    }

    requiredFields.forEach(field => {
      if (!formData[field] && field !== 'date') {
        newErrors[field] = `${field} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };

    if (name === 'dev_team_accepted' || name === 'dev_team_rejected') {
      newFormData.total_defects = parseInt(newFormData.dev_team_accepted || 0) + parseInt(newFormData.dev_team_rejected || 0);
    }

    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const token = sessionStorage.getItem('access_token');
    const method = editingStatus ? 'PUT' : 'POST';
    const url = editingStatus
      ? `http://localhost:5000/defect_accepted_rejected/${editingStatus.id}`
      : 'http://localhost:5000/defect_accepted_rejected';

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
          total_defects: 0,
          dev_team_accepted: 0,
          dev_team_rejected: 0,
          project_name_id: ''
        });
        fetchDefectStatuses();
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
        const response = await axios.delete(`http://localhost:5000/defect_accepted_rejected/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          alert('Status deleted successfully!');
          fetchDefectStatuses();
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
    setShowDefectsModal(false);
    setShowFormModal(false);


    setEditingStatus(status);
    setFormData({
      ...status, 
      date : formatDate(status.date)
    });
    setShowFormModal(true);
  };

  const handleViewProjectsClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleCloseDefectsModal = () => {
    setShowDefectsModal(false);
  };

  const today = new Date().toISOString().split('T')[0];


    // Function to format date in DD-MM-YYYY format
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-indexed
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
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
            alignItems: 'center'
          }}
        >
          Manage Defect Accepted/Rejected Statuses
          <Button
            variant="outline-light"
            style={{ marginLeft: 'auto', backgroundColor: 'transparent', borderColor: '#ffffff' }}
            onClick={handleViewProjectsClick}
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
                    isInvalid={!!errors.date}
                    max={today}
                    disabled={editingStatus}
                  />
                  <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Total Defects</Form.Label>
                  <Form.Control
                    type="number"
                    name="total_defects"
                    value={formData.total_defects}
                    readOnly
                    isInvalid={!!errors.total_defects}
                  />
                  <Form.Control.Feedback type="invalid">{errors.total_defects}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dev Team Accepted</Form.Label>
                  <Form.Control
                    type="number"
                    name="dev_team_accepted"
                    value={formData.dev_team_accepted}
                    onChange={handleChange}
                    isInvalid={!!errors.dev_team_accepted}
                  />
                  <Form.Control.Feedback type="invalid">{errors.dev_team_accepted}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dev Team Rejected</Form.Label>
                  <Form.Control
                    type="number"
                    name="dev_team_rejected"
                    value={formData.dev_team_rejected}
                    onChange={handleChange}
                    isInvalid={!!errors.dev_team_rejected}
                  />
                  <Form.Control.Feedback type="invalid">{errors.dev_team_rejected}</Form.Control.Feedback>
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
            <br />
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

      {/* Modal for displaying the projects table */}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.project_name}</td>
                  <td>{project.id}</td>
                  <td>
                    <Button 
                      variant="secondary" 
                      onClick={() => fetchDefectsForProject(project.id)}
                    >
                      View Defect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Back</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for displaying defects for the selected project */}
      <Modal show={showDefectsModal} onHide={handleCloseDefectsModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Defects for Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Defect ID</th>
                <th>Status</th>
                <th>Description</th>
                {user_role==='admin' && <th>Action</th>}
                
              </tr>
            </thead>
            <tbody>
              {defects.map(defect => (
                <tr key={defect.id}>
                  <td>{defect.id}</td>
                  <td>{defect.dev_team_accepted}</td>
                  <td>{defect.dev_team_rejected}</td>
                  {user_role==='admin' && (
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDefectsModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageDefectAcceptedRejected;





