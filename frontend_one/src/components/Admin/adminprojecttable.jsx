import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa'; // Import the edit and delete icons


const AdminProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddTesterModal, setShowAddTesterModal] = useState(false);
  const [billableUsers, setBillableUsers] = useState([]);
  const [nonBillableUsers, setNonBillableUsers] = useState([]);
  const [testerName, setTesterName] = useState('');
  const [testerType, setTesterType] = useState('billable');
  const [availableUsers, setAvailableUsers] = useState([]);

  const [automation, setAutomation] = useState(null);
  const [aiUsed, setAiUsed] = useState(null);
  const [automationText, setAutomationText] = useState('');
  const [aiText, setAiText] = useState('');

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    projectName: '',
    RAG: '',
    tester_count: 0, // Initialize with 0
    billable: [],
    nonbillable: [],
    billing_type: '',
    RAG_details: '',
    automation: false,
    ai_used: false,
  });
  // Fetch project data from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000//project-details', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        });
        const data = await response.json();
        setProjects(data.project_details);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch users for billable and nonbillable based on the project data
  const fetchBillableAndNonBillable = async (billableIds, nonBillableIds) => {
    try {
      const response = await fetch('http://localhost:5000//get_tester_details', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: billableIds,
          nonbillable_ids: nonBillableIds,
        }),
      });

      const data = await response.json();
      setBillableUsers(data.billable_testers || []);
      setNonBillableUsers(data.nonbillable_testers || []);
      setAvailableUsers(data.available_testers || []);
    } catch (error) {
      console.error('Error fetching billable or nonbillable users:', error);
    }
  };

  // Handle form submission to update the project
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({}); // Reset previous errors

    const form = e.target;
    const newErrors = {};

    // Validate fields
    if (!form.project_name.value) {
      newErrors.project_name = 'Project Name is required';
    }

    if (!form.RAG.value) {
      newErrors.RAG = 'RAG is required';
    }

    if (billableUsers.length === 0 && nonBillableUsers.length === 0) {
      newErrors.testers = 'At least one Billable or Non-Billable tester is required';
    }

    if (!form.billing_type.value) {
      newErrors.billing_type = 'Billing Type is required';
    }

    // If there are validation errors, do not proceed with form submission
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    // Prepare the updated project details
    const updatedProject = {
      project_name: form.project_name.value,
      RAG: form.RAG.value,
      tester_count: billableUsers.length + nonBillableUsers.length,
      billable: billableUsers.map((user) => user.tester_name),
      nonbillable: nonBillableUsers.map((user) => user.tester_name),
      billing_type: form.billing_type.value,
      automation: automation ? automationText : null,
      ai_used: aiUsed ? aiText : null,
    };

    console.log(updatedProject); // Log the updated project details for debugging

    // Send the updated project data to the backend
    try {
      const response = await fetch(`http://localhost:5000//update-project-details/${selectedProject.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      });
      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === selectedProject.id ? { ...project, ...updatedProject } : project
          )
        );
        setShowModal(false);
        setSelectedProject(null);
      } else {
        console.error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Handle editing a project
  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowModal(true);
    fetchBillableAndNonBillable(project.billable, project.nonbillable);

    setAutomation(project.automation ? true : false);
    setAiUsed(project.ai_used ? true : false);
    setAutomationText(project.automation || '');
    setAiText(project.ai_used || '');

    // Prepopulate the RAG details field in the form
    setFormData({
      ...formData,
      RAG_details: project.RAG_details || '',  // Set the RAG_details from the selected project
    });
  };


  // Handle deleting a project
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000//delete-project/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        });
        if (response.ok) {
          setProjects(projects.filter((project) => project.id !== id));
        } else {
          console.error('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  // Handle closing the modal without saving changes
  const handleCancel = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  // Open the Add Tester modal
  const handleAddTesterModal = (type) => {
    setTesterType(type);
    setShowAddTesterModal(true);
  };

  const handleRemoveTester = (testerId, type) => {
    if (type === 'billable') {
      setBillableUsers(billableUsers.filter(user => user.id !== testerId));
    } else {
      setNonBillableUsers(nonBillableUsers.filter(user => user.id !== testerId));
    }
  };

  // Handle adding tester to the selected list (Billable or Non-Billable)
  const handleAddTester = () => {
    if (testerName.trim()) {
      const newTester = { id: Date.now(), tester_name: testerName };

      if (testerType === 'billable') {
        setBillableUsers([...billableUsers, newTester]);
      } else {
        setNonBillableUsers([...nonBillableUsers, newTester]);
      }

      setTesterName(''); // Clear the tester name field
      setShowAddTesterModal(false); // Close the Add Tester modal
    }
  };

  // Function to determine background color for RAG
  const getRAGColor = (rag) => {
    switch (rag) {
      case 'Red':
        return 'red';
      case 'Amber':
        return 'orange';
      case 'Green':
        return 'green';
      default:
        return 'transparent';
    }
  };

  return (
    <>

<Card className="mb-4">
        <Card.Body>
          <h2>admin Dashboard</h2> {/* Title for the page */}
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
          Project Details
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>RAG - Delivery</th>
                  <th>Tester Count</th>
                  <th>Billable</th>
                  <th>Nonbillable</th>
                  <th>Billing Type</th>
                  <th>Automation</th>
                  <th>AI</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} style={{ backgroundColor: getRAGColor(project.RAG) }}>
                    <td>{project.project_name}</td>
                    <td>{project.RAG}</td>
                    <td>{project.tester_count}</td>
                    <td>{project.billable.length}</td>
                    <td>{project.nonbillable.length}</td>
                    <td>{project.billing_type}</td>
                    <td>{project.automation ? 'Yes' : 'No'}</td>
                    <td>{project.ai_used ? 'Yes' : 'No'}</td>
                    <td>
                    <Button variant="warning" onClick={() => handleEdit(project)} style={{ marginRight: '10px' }}>
                        <FaEdit /> {/* Edit Icon */}
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(project.id)}>
                        <FaTrash /> {/* Delete Icon */}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Project Details Modal (Edit or Create) */}
      <Modal show={showModal} onHide={handleCancel} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {selectedProject && (
            <Form onSubmit={handleSubmit}>
              {/* Project Name */}
              <Form.Group controlId="project_name">
                <Form.Label>Project Name</Form.Label>
                <Form.Control type="text" 
                style={{backgroundColor : "grey"}}
                defaultValue={selectedProject.project_name} required 
                readOnly />
                {formErrors.project_name && <Alert variant="danger">{formErrors.project_name}</Alert>}
              
              </Form.Group>

              {/* RAG */}
              <Form.Group controlId="RAG">
                <Form.Label>RAG</Form.Label>
                <Form.Select
                  value={selectedProject.RAG} // Prepopulate the RAG with the selected project's RAG value
                  onChange={(e) => setFormData({ ...formData, RAG: e.target.value })}
                  required
                >
                  <option value="Red">Red</option>
                  <option value="Amber">Amber</option>
                  <option value="Green">Green</option>
                </Form.Select>
              </Form.Group>

            <Form.Group controlId="RAG_Details">
              <Form.Label style={{ fontWeight: '' }}>RAG Details</Form.Label>
              <Form.Control
                type="text"
                value={formData.RAG_details}
                onChange={(e) => setFormData({ ...formData, RAG_details: e.target.value })}
                required
                style={{ borderRadius: '5px', border: '1px solid #ced4da', padding: '10px' }}
              />
            </Form.Group>

              {/* Tester Count */}
              <Form.Group controlId="tester_count">
                <Form.Label>Tester Count</Form.Label>
                <Form.Control type="number" value={billableUsers.length + nonBillableUsers.length} readOnly />
              </Form.Group>



<Form.Group controlId="billable">
                <Form.Label>Billable</Form.Label>
                <div>
                  {billableUsers.map((user) => (
                    <span key={user.id}>
                      {user.tester_name}{' '}
                      <FaTimes
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => handleRemoveTester(user.id, 'billable')}
                      />{' '}
                    </span>
                  ))}
                </div>

                <Button variant="success" onClick={() => handleAddTesterModal('billable')} style={{ marginTop: '10px' }}>
                  Add Tester
                </Button>
              </Form.Group>


              {/* Non-Billable */}
              <Form.Group controlId="nonbillable">
                <Form.Label>Non-Billable</Form.Label>
                <div>
                  {nonBillableUsers.map((user) => (
                    <span key={user.id}>
                      {user.tester_name}{' '}
                      <FaTimes
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => handleRemoveTester(user.id, 'nonbillable')}
                      />{' '}
                    </span>
                  ))}
                </div>
                <Button variant="success" onClick={() => handleAddTesterModal('nonbillable')} style={{ marginTop: '10px' }}>
                  Add Tester
                </Button>
              </Form.Group>

              {/* Billing Type */}
              <Form.Group controlId="billing_type">
                <Form.Label>Billing Type</Form.Label>
                <Form.Select
                  value={selectedProject.billing_type} // Prepopulate the billing type
                  onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
                  required
                >
                  <option value="T&M">T&M</option>
                  <option value="FIXED">FIXED</option>
                </Form.Select>
              </Form.Group>



              {/* Automation Field
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
              AI Used Field
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
              </Form.Group> */}


              {/* Automation Field */}
<Form.Group controlId="Automation">
  <Form.Label>Automation Used</Form.Label>
  <div>
    <Form.Check
      type="radio"
      label="Yes"
      value="Yes"
      checked={automation === true} // Ensure the correct radio button is selected
      onChange={() => {
        setAutomation(true);
        setAutomationText("");  // Reset text area if changing to "Yes"
      }}
    />
    <Form.Check
      type="radio"
      label="No"
      value="No"
      checked={automation === false} // Ensure the correct radio button is selected
      onChange={() => setAutomation(false)}
    />
  </div>
  {automation === true && (  // Display input box when "Yes" is selected
    <div>
      <Form.Group controlId="automationDetails" style={{ marginTop: '10px' }}>
        <Form.Label>Automation Tool</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={automationText}
          onChange={(e) => setAutomationText(e.target.value)}  // Handle text change
          placeholder="Details about the selected automation tool"
        />
      </Form.Group>
    </div>
  )}
</Form.Group>

{/* AI Used Field */}
<Form.Group controlId="AI">
  <Form.Label>AI Used</Form.Label>
  <div>
    <Form.Check
      type="radio"
      label="Yes"
      value="Yes"
      checked={aiUsed === true}  // Ensure the correct radio button is selected
      onChange={() => {
        setAiUsed(true);
        setAiText("");  // Reset text area if changing to "Yes"
      }}
    />
    <Form.Check
      type="radio"
      label="No"
      value="No"
      checked={aiUsed === false}  // Ensure the correct radio button is selected
      onChange={() => setAiUsed(false)}
    />
  </div>
  {aiUsed === true && (  // Display input box when "Yes" is selected
    <div>
      <Form.Group controlId="aiUsedDetails" style={{ marginTop: '10px' }}>
        <Form.Label>AI Tool</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}  // Handle text change
          placeholder="Details about the selected AI tool"
        />
      </Form.Group>
    </div>
  )}
</Form.Group>


              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Tester Modal */}
      <Modal show={showAddTesterModal} onHide={() => setShowAddTesterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Tester</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="testerName">
              <Form.Label>Tester Name</Form.Label>
              <Form.Control
                type="text"
                value={testerName}
                onChange={(e) => setTesterName(e.target.value)}
                placeholder="Enter tester's name"
                required
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddTester}>
              Add Tester
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddTesterModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminProjectTable;