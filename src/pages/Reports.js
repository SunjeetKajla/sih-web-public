import React, { useState, useEffect } from 'react';
import { IoThunderstorm, IoWater, IoArrowForward, IoWarning, IoSkull, IoHelp } from 'react-icons/io5';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sih-web-server.onrender.com/api/reports');
      if (response.ok) {
        const data = await response.json();
        const formattedReports = data.map(report => ({
          ...report,
          timestamp: new Date(report.timestamp)
        }));
        setReports(formattedReports);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#FF4757';
      case 'medium': return '#FFA502';
      case 'low': return '#2ED573';
      default: return '#747D8C';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#2ED573';
      case 'pending': return '#FFA502';
      case 'resolved': return '#747D8C';
      default: return '#747D8C';
    }
  };

  const getHazardIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'storm': return IoThunderstorm;
      case 'high waves': return IoWater;
      case 'strong current': return IoArrowForward;
      case 'debris': return IoWarning;
      case 'pollution': return IoSkull;
      default: return IoHelp;
    }
  };

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  const getStatusCounts = () => {
    return {
      pending: reports.filter(r => r.status === 'pending').length,
      verified: reports.filter(r => r.status === 'verified').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="reports-container">
      <div className="header">
        <h1 className="title">Hazard Reports</h1>
        <p className="subtitle">{filteredReports.length} reports</p>
      </div>

      <div className="filter-container">
        {['all', 'pending', 'verified', 'resolved'].map((filterType) => (
          <button
            key={filterType}
            className={`filter-button ${filter === filterType ? 'active' : ''}`}
            onClick={() => setFilter(filterType)}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container">
          <div>Loading reports...</div>
        </div>
      ) : (
        <div className="reports-list">
          {filteredReports.map((report) => {
            const IconComponent = getHazardIcon(report.type);
            return (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div className="hazard-info">
                    <IconComponent 
                      size={24} 
                      color={getSeverityColor(report.severity)} 
                    />
                    <span className="hazard-type">{report.type}</span>
                  </div>
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(report.status) }}
                  >
                    {report.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="report-details">
                  <div className="location">
                    📍 {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                  </div>
                  <div className="timestamp">
                    🕒 {report.timestamp.toLocaleString()}
                  </div>
                  <div 
                    className="severity"
                    style={{ color: getSeverityColor(report.severity) }}
                  >
                    ⚠️ Severity: {report.severity.toUpperCase()}
                  </div>
                  {report.description && (
                    <div className="description">{report.description}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-number">{statusCounts.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{statusCounts.verified}</div>
          <div className="stat-label">Verified</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{statusCounts.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>
    </div>
  );
};

export default Reports;