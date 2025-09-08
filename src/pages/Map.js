import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents } from 'react-leaflet';
import { IoThunderstorm, IoWater, IoArrowForward, IoWarning, IoSkull, IoHelp } from 'react-icons/io5';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hazardReports, setHazardReports] = useState([]);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://https://sih-web-server.onrender.com/api/reports');
      if (response.ok) {
        const reports = await response.json();
        setHazardReports(reports);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    fetchReports();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Mumbai coordinates
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
        }
      );
    } else {
      setUserLocation({ lat: 19.0760, lng: 72.8777 });
    }
  };

  const reportHazard = async (type, severity) => {
    if (!selectedLocation) {
      alert('Please select a location on the map first');
      return;
    }

    try {
      const response = await fetch('https://sih-web-server.onrender.com/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          type,
          severity
        })
      });
      
      if (response.ok) {
        const newReport = await response.json();
        setHazardReports(prev => [...prev, newReport]);
        setSelectedLocation(null);
        alert('Hazard reported successfully!');
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        alert('Failed to report hazard: ' + response.status);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Failed to report hazard: ' + error.message);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#FF4757';
      case 'medium': return '#FFA502';
      case 'low': return '#2ED573';
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

  if (!userLocation) {
    return (
      <div className="map-loading">
        <div>Loading map...</div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={10}
        className="leaflet-map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Your Location</Popup>
        </Marker>

        {hazardReports.map((report) => (
          <CircleMarker
            key={report.id}
            center={[report.latitude, report.longitude]}
            radius={8}
            pathOptions={{
              color: getSeverityColor(report.severity),
              fillColor: getSeverityColor(report.severity),
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div>
                <strong>{report.type}</strong><br />
                Severity: {report.severity}<br />
                Status: {report.status}
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}

        <MapClickHandler onMapClick={setSelectedLocation} />
      </MapContainer>

      {selectedLocation && (
        <div className="report-panel">
          <h3 className="panel-title">Report Ocean Hazard</h3>
          <div className="hazard-buttons">
            <button
              className="hazard-button storm"
              onClick={() => reportHazard('Storm', 'high')}
            >
              <IoThunderstorm size={24} />
              <span>Storm</span>
            </button>
            
            <button
              className="hazard-button waves"
              onClick={() => reportHazard('High Waves', 'medium')}
            >
              <IoWater size={24} />
              <span>High Waves</span>
            </button>
            
            <button
              className="hazard-button current"
              onClick={() => reportHazard('Strong Current', 'medium')}
            >
              <IoArrowForward size={24} />
              <span>Current</span>
            </button>
            
            <button
              className="hazard-button debris"
              onClick={() => reportHazard('Debris', 'low')}
            >
              <IoWarning size={24} />
              <span>Debris</span>
            </button>
            
            <button
              className="hazard-button pollution"
              onClick={() => reportHazard('Pollution', 'medium')}
            >
              <IoSkull size={24} />
              <span>Pollution</span>
            </button>
            
            <button
              className="hazard-button other"
              onClick={() => reportHazard('Other', 'low')}
            >
              <IoHelp size={24} />
              <span>Other</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;