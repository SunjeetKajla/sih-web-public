import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoWarning, IoCamera, IoList, IoCheckmarkCircle, IoWater, IoThunderstorm } from 'react-icons/io5';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Report Hazard',
      subtitle: 'Mark hazard on map',
      icon: IoWarning,
      color: '#FF6B6B',
      route: '/map',
    },
    {
      title: 'Take Photo',
      subtitle: 'Capture evidence',
      icon: IoCamera,
      color: '#4ECDC4',
      route: '/camera',
    },
    {
      title: 'View Reports',
      subtitle: 'Browse all reports',
      icon: IoList,
      color: '#45B7D1',
      route: '/reports',
    },
  ];

  const stats = [
    { label: 'Active Hazards', value: '12', color: '#FF6B6B' },
    { label: 'Reports Today', value: '8', color: '#4ECDC4' },
    { label: 'Verified', value: '156', color: '#45B7D1' },
  ];

  return (
    <div className="home-container">
      <div className="header">
        <h1 className="title">Ocean Hazard Reporter</h1>
        <p className="subtitle">Crowdsourced Maritime Safety Platform</p>
      </div>

      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-container">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="action-card"
              style={{ backgroundColor: action.color }}
              onClick={() => navigate(action.route)}
            >
              <action.icon size={32} color="white" />
              <div className="action-title">{action.title}</div>
              <div className="action-subtitle">{action.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-container">
          <div className="activity-item">
            <IoThunderstorm size={20} color="#FF6B6B" />
            <div className="activity-text">
              <div className="activity-title">Storm Warning - Chennai</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <IoWater size={20} color="#4ECDC4" />
            <div className="activity-text">
              <div className="activity-title">High Waves - Goa Coast</div>
              <div className="activity-time">4 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <IoCheckmarkCircle size={20} color="#2ED573" />
            <div className="activity-text">
              <div className="activity-title">Report Verified - Mumbai</div>
              <div className="activity-time">6 hours ago</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Safety Tips</h2>
        <div className="tips-container">
          <div className="tip">🌊 Always check weather conditions before heading out</div>
          <div className="tip">📱 Keep emergency contacts readily available</div>
          <div className="tip">🚨 Report hazards immediately to help others</div>
          <div className="tip">📍 Share your location with trusted contacts</div>
        </div>
      </div>
    </div>
  );
};

export default Home;