import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart } from 'react-google-charts';

const ViewMatrix = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [metricsData, setMetricsData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [lineChartData, setLineChartData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loadingWeekly, setLoadingWeekly] = useState(false);

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
      const url = `http://localhost:5000/view_matric_calculation/${id}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setMetricsData(response.data);
      } else {
        throw new Error('Failed to fetch metrics data.');
      }
    } catch (error) {
      setError(`Error fetching metrics data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the weekly report data from the API
  const fetchWeeklyReport = async () => {
    const token = sessionStorage.getItem('access_token');
    setLoadingWeekly(true);
    try {
      const url = `http://localhost:5000/view_matrix_week/${id}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setWeeklyData(response.data);
        if (Array.isArray(response.data)) {
          prepareLineChartData(response.data); // Only call if it's an array
        } else {
          throw new Error('Weekly data is not an array.');
        }
      } else {
        throw new Error('Failed to fetch weekly report.');
      }
    } catch (error) {
      setError(`Error fetching weekly report: ${error.message}`);
    } finally {
      setLoadingWeekly(false);
    }
  };

  // Prepare line chart data from the API response
  const prepareLineChartData = (data) => {
    if (!Array.isArray(data)) {
      setError('Weekly data is not in the expected array format.');
      return;
    }

    const chartData = [
      ['Week', 'Automation Coverage', 'Defect Rejection', 'Defect Lead', 'Defect Removal', 'Defect Severity', 'Fix Rate', 'Tester Productivity'],
    ];

    data.forEach((weekData) => {
      chartData.push([
        `Week ${weekData.Week}`,
        weekData.Automation_Coverage_Chart,
        weekData.Defact_Rejection_Chart,
        weekData.Defect_Lead_Chart,
        weekData.Defect_Removal_Chart,
        isNaN(weekData.Defect_Severity_chart) ? 0 : weekData.Defect_Severity_chart, // Handle NaN values
        weekData.Fix_Rate_Chart,
        weekData.Tester_Productivity_Chart,
      ]);
    });

    setLineChartData(chartData);  // Set the chart data state
  };

  // Render a table for metrics data
  const renderMetricsTable = (data) => {
    if (!data) {
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
              {Object.keys(data).map((key) => (
                <tr key={key}>
                  <td>{key.replace(/_/g, ' ')}</td>
                  <td>{data[key]}</td>
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
          <Button variant="success" onClick={fetchWeeklyReport}>
            {loadingWeekly ? 'Loading Weekly Report...' : 'Show Weekly Report'}
          </Button>
        </Col>
      </Row>

      {lineChartData.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header as="h5" style={{ backgroundColor: '#000d6b', color: '#ffffff', borderRadius: '10px 10px 0 0' }}>
                Weekly Report Chart
              </Card.Header>
              <Card.Body>
                <Chart
                  chartType="LineChart"
                  width="100%"
                  height="400px"
                  data={lineChartData}
                  options={{
                    hAxis: { title: 'Week' },
                    vAxis: { title: 'Metric Value' },
                    legend: { position: 'top' },
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ViewMatrix;
