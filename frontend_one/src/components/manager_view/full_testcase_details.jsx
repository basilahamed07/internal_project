import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Button } from 'react-bootstrap'; // Import Bootstrap components
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import axios from 'axios'; // Import Axios

const ProjectDetails = () => {
  const { projectNameId } = useParams(); // Get project ID from URL
  const navigate = useNavigate(); // For navigating back to the previous page

  const [projectName, setProjectName] = useState(''); // Project Name state
  const [projectData, setProjectData] = useState();
  const [error, setError] = useState(''); // Error state
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    // Validate projectNameId and fetch project data
    if (projectNameId && !isNaN(projectNameId)) {
      fetchProjectDetails();
    } else {
      setError('Invalid project ID in the URL.');
    }
  }, [projectNameId]);

  const fetchProjectDetails = async () => {
    const token = sessionStorage.getItem('access_token'); // Get the access token from session storage
    setLoading(true);
    try {
      const url = `http://localhost:5000/full_test_details/${projectNameId}`;
      console.log('Requesting data from URL:', url);

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // console.log("hello")
        // console.log(response.data)
        setProjectName(response.data.project_name || 'Project Name');
        setProjectData(response.data );
      } else {
        throw new Error('Failed to fetch project details.');
      }
    } catch (error) {
      if (error.response) {
        setError(`Error fetching project details: ${error.response.status} - ${error.response.statusText}`);
      } else {
        setError(`Error fetching project details: ${error.message}`);
      }
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const renderTable = (data, title, columns, columnMapping) => {
    console.log("hello")
    console.log(data)
    if (!data || data.length === 0) {
      return (
        <Card className="mb-4">
          <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
            {title}
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={columns.length} className="text-center">No data available</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Card className="mb-4">
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
          {title}
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((col, colIndex) => {
                    const colKey = columnMapping[col] || col.toLowerCase().replace(/\s+/g, '_');
                    return (
                      <td key={colIndex}>
                        {colKey === 'date' && item[colKey] ? formatDate(item[colKey]) : item[colKey] || '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="container mt-5">
      {/* Go Back Button */}
      <Row className="mt-4">
        <Col xs={12} className="d-flex justify-content-start">
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Col>
      </Row>

      {/* Project Name */}
      <Row className="mb-4">
        <Col xs={12}>
          <h2>{projectName ? projectName : 'Loading Project...'}</h2>
        </Col>
      </Row>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading Spinner */}
      {loading && <div className="alert alert-info">Loading...</div>}

      {/* Render tables for project data with appropriate column mappings */}
      {projectData && renderTable(
        projectData.BuildStatus,
        'Build Status',
        ['Month', 'Builds Accepted', 'Builds Rejected', 'Total Build Received', 'Date'],
        { 'Builds Accepted': 'builds_accepted', 'Builds Rejected': 'builds_rejected', 'Total Build Received': 'total_build_received', 'Date': 'date' }
      )}





      {/* Render other tables as needed */}
      {/* Example for Test Case Creation Status, and others */}
      {/* renderTable(
        projectData.TestCaseCreationStatus,
        'Test Case Creation Status',
        ['Month', 'Test Case Approved', 'Test Case Rejected', 'Total Test Case Created', 'Date'],
        { 'Test Case Approved': 'test_case_approved', 'Test Case Rejected': 'test_case_rejected', 'Total Test Case Created': 'total_test_case_created', 'Date': 'date' }
      ) */}
    </div>
  );
};

export default ProjectDetails;
