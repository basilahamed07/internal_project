import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Button, Spinner, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewMatrix = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [metricsData, setMetricsData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');

  useEffect(() => {
    if (id) {
      fetchMetricsData();
    } else {
      setError('Invalid project ID.');
    }
  }, [id]);

  // Fetch the metrics data from the API
  const fetchMetricsData = async () => {
    const token = sessionStorage.getItem('access_token');
    setLoading(true);
    try {
      const url = `http://localhost:5000/view_matrix_month/${id}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setMetricsData(response.data);  // Set the metrics data response
      } else {
        throw new Error('Failed to fetch metrics data.');
      }
    } catch (error) {
      setError(`Error fetching metrics data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Convert hours to minutes
  const convertToMinutes = (hours) => {
    return (hours * 60).toFixed(2);  // Convert to minutes and round to 2 decimal places
  };

  // Render a table for metrics data
  const renderMetricsTable = (data) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return (
        <Card className="mb-4">
          <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
            Project Metrics
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2" className="text-center">No data available</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      );
    }

    const metrics = Array.isArray(data) ? data : [data];

    return (
      <Card className="mb-4">
        <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
          Project Metrics
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>Automation Coverage</td>
                    <td>{metric.automationCoverage}</td>
                  </tr>
                  <tr>
                    <td>Defect Density</td>
                    <td>{metric.defectDensity}</td>
                  </tr>
                  <tr>
                    <td>Defect Fix Rate</td>
                    <td>{metric.defectFixRate}</td>
                  </tr>
                  <tr>
                    <td>Defect Leakage</td>
                    <td>{metric.defectLeakage}</td>
                  </tr>
                  <tr>
                    <td>Defect Rejection Ratio</td>
                    <td>{metric.defectRejectionRatio}</td>
                  </tr>
                  <tr>
                    <td>Defect Removal Efficiency</td>
                    <td>{metric.defectRemovalEfficiency}</td>
                  </tr>
                  <tr>
                    <td>Defect Severity Index</td>
                    <td>{metric.defectSeverityIndex}</td>
                  </tr>
                  <tr>
                    <td>Mean Time To Find Defect (in Minutes)</td>
                    <td>{convertToMinutes(metric.meanTimeToFindDefect)} minutes</td>
                  </tr>
                  <tr>
                    <td>Mean Time To Repair (in Minutes)</td>
                    <td>{convertToMinutes(metric.meanTimeToRepair)} minutes</td>
                  </tr>
                  <tr>
                    <td>Test Cases Efficiency</td>
                    <td>{metric.testCasesEfficiency}</td>
                  </tr>
                  <tr>
                    <td>Tester Productivity</td>
                    <td>{metric.testerProductivity}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="container mt-5">
      <Row className="mb-4">
        <Col xs={11}>
          <Card style={{ backgroundColor: '#f1f1f1', borderRadius: '10px' }}>
            <Card.Body>
              <h2>Project Metrics</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={1} className="d-flex justify-content-end">
          <Button variant="primary" onClick={() => navigate(-1)} className="btn-xl">
            Go Back
          </Button>
        </Col>
      </Row>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      ) : (
        renderMetricsTable(metricsData)
      )}

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
              Select Metrics Type
            </Card.Header>
            <Card.Body>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-time-period">
                  {selectedTimePeriod ? `Selected: ${selectedTimePeriod}` : 'Select Time Period'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedTimePeriod('Month Wise')}>Month Wise</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedTimePeriod('Week Wise')}>Week Wise</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {selectedTimePeriod && (
                <div className="mt-3">
                  {selectedTimePeriod === 'Month Wise' ? (
                    <Dropdown>
                      <Dropdown.Toggle variant="primary" id="dropdown-month">
                        {selectedMonth ? `Selected Month: ${selectedMonth}` : 'Select Month'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSelectedMonth('January')}>January</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedMonth('February')}>February</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedMonth('March')}>March</Dropdown.Item>
                        {/* Add other months as needed */}
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <Dropdown>
                      <Dropdown.Toggle variant="primary" id="dropdown-week">
                        {selectedWeek ? `Selected Week: ${selectedWeek}` : 'Select Week'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSelectedWeek('Week 1')}>Week 1</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedWeek('Week 2')}>Week 2</Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedWeek('Week 3')}>Week 3</Dropdown.Item>
                        {/* Add other weeks as needed */}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
              )}

              <p className="mt-2">Displaying data for the selected {selectedTimePeriod}: {selectedTimePeriod === 'Month Wise' ? selectedMonth : selectedWeek}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewMatrix;
