import React, { useState, useEffect } from 'react';
import { Table, Card, Modal, Button } from 'react-bootstrap';

const ManagerView = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await fetch('http://localhost:5000/project-details-manager-view', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      setProjects(data.project_details);
      setProjectName(data.project_name);
      console.log(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const getRagClass = (rag) => {
    switch (rag) {
      case 'Red':
        return 'bg-danger text-white';
      case 'Green':
        return 'bg-success text-white';
      case 'Amber':
        return 'bg-warning text-dark';
      default:
        return '';
    }
  };

  const handleModalOpen = (title, content) => {
    setModalContent({ title, content });
    setShowModal(true);
  };

  const renderAutomation = (automation, automationDetails) => {
    return (
      <span
        className="badge bg-info text-white"
        style={{ cursor: 'pointer' }}
        onClick={() => handleModalOpen('Automation Details', automation ? automationDetails : 'No automation details available')}
      >
        {automation ? 'True' : 'False'}
      </span>
    );
  };

  const renderAI = (aiUsed, aiDetails) => {
    return (
      <span
        className="badge bg-info text-white"
        style={{ cursor: 'pointer' }}
        onClick={() => handleModalOpen('AI Details', aiUsed ? aiDetails : 'No AI details available')}
      >
        {aiUsed ? 'True' : 'False'}
      </span>
    );
  };

  const renderRag = (rag, ragDetails) => {
    return (
      <span
        className={`badge ${getRagClass(rag)}`}
        style={{ cursor: 'pointer' }}
        onClick={() => handleModalOpen('RAG Status Details', ragDetails || 'No details available')}
      >
        {rag}
      </span>
    );
  };

  return (
    <div className="container mt-5">
      {/* Title at the top */}
      <Card className="mb-4">
        <Card.Body>
          <h2>Manager Dashboard</h2> {/* Title for the page */}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
          Manager View
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Project Name</th>
                  <th>RAG - Delivery</th>
                  <th>Test Execution Status</th>
                  <th>Tester Count</th>
                  <th>Billable</th>
                  <th>Nonbillable</th>
                  <th>Billing Type</th>
                  <th>Automation?</th>
                  <th>AI Used</th>
                  <th>Project Metrics</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project.id}>
                    <td>{index + 1}</td>
                    <td>{project.project_name}</td>
                    <td>{renderRag(project.RAG, project.RAG_details)}</td>
                    <td>
                      <a href={`/ManagerView/full_test_details/${project.project_name_id}`} rel="noopener noreferrer">
                        View Details
                      </a>
                    </td>
                    <td>
                      <a href={`/ManagerView/tester_count/${project.project_name_id}`} rel="noopener noreferrer">
                        {project.tester_count}
                      </a>
                    </td>
                    <td>{project.billable.length}</td>
                    <td>{project.nonbillable.length}</td>
                    <td>{project.billing_type || 'N/A'}</td>
                    <td>{renderAutomation(project.automation, project.automation)}</td>
                    <td>{renderAI(project.ai_used, project.ai_used)}</td>
                    <td>
                      <a href={`/ManagerView/project_metrics/${project.project_name_id}`} rel="noopener noreferrer">
                        View Metrics
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal for detailed view */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.content}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagerView;
