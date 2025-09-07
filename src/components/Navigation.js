import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoHome, IoMap, IoCamera, IoList } from 'react-icons/io5';
import './Navigation.css';

const Navigation = () => {
  const navItems = [
    { path: '/', icon: IoHome, label: 'Home' },
    { path: '/map', icon: IoMap, label: 'Map' },
    { path: '/camera', icon: IoCamera, label: 'Camera' },
    { path: '/reports', icon: IoList, label: 'Reports' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="desktop-nav">
        <div className="nav-header">
          <h2>Ocean Hazard Reporter</h2>
        </div>
        <ul className="nav-list">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <NavLink 
                to={path} 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <Icon size={24} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <ul className="mobile-nav-list">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <NavLink 
                to={path} 
                className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
              >
                <Icon size={24} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;