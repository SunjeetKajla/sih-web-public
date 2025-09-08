import React, { useState, useRef } from 'react';
import { IoCamera, IoImages, IoThunderstorm, IoWater, IoArrowForward, IoWarning, IoSkull, IoHelp, IoArrowBack } from 'react-icons/io5';
import './Camera.css';

const Camera = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showHazardSelection, setShowHazardSelection] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setShowHazardSelection(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitReport = async (type, severity) => {
    if (!selectedImage || !userLocation) {
      alert('Image and location required');
      return;
    }

    const reportData = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      type,
      severity,
      imageData: selectedImage,
      timestamp: new Date(),
    };

    try {
      const response = await fetch('https://sih-web-server.onrender.com/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: reportData.latitude,
          longitude: reportData.longitude,
          type,
          severity
        })
      });
      
      if (response.ok) {
        alert('Hazard report submitted successfully!');
        resetSelection();
      } else {
        alert('Failed to submit report');
      }
    } catch (error) {
      alert('Failed to submit report');
    }
  };

  const resetSelection = () => {
    setSelectedImage(null);
    setShowHazardSelection(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (selectedImage && showHazardSelection) {
    return (
      <div className="camera-container">
        <div className="preview-container">
          <img src={selectedImage} alt="Selected" className="preview-image" />
          
          <div className="hazard-selection-panel">
            <h3 className="panel-title">Select Hazard Type</h3>
            {userLocation && (
              <div className="location-text">
                📍 {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              </div>
            )}
            
            <div className="hazard-grid">
              <button
                className="hazard-btn storm"
                onClick={() => submitReport('Storm', 'high')}
              >
                <IoThunderstorm size={20} />
                <span>Storm</span>
              </button>
              
              <button
                className="hazard-btn waves"
                onClick={() => submitReport('High Waves', 'medium')}
              >
                <IoWater size={20} />
                <span>High Waves</span>
              </button>
              
              <button
                className="hazard-btn current"
                onClick={() => submitReport('Strong Current', 'medium')}
              >
                <IoArrowForward size={20} />
                <span>Current</span>
              </button>
              
              <button
                className="hazard-btn debris"
                onClick={() => submitReport('Debris', 'low')}
              >
                <IoWarning size={20} />
                <span>Debris</span>
              </button>
              
              <button
                className="hazard-btn pollution"
                onClick={() => submitReport('Pollution', 'medium')}
              >
                <IoSkull size={20} />
                <span>Pollution</span>
              </button>
              
              <button
                className="hazard-btn other"
                onClick={() => submitReport('Other', 'low')}
              >
                <IoHelp size={20} />
                <span>Other</span>
              </button>
            </div>
            
            <button className="back-button" onClick={resetSelection}>
              <IoArrowBack size={16} />
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="camera-container">
      <div className="header">
        <h1 className="title">Report Ocean Hazard</h1>
        <p className="subtitle">Upload photo evidence</p>
        {userLocation && (
          <div className="location-text">
            📍 {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </div>
        )}
      </div>

      <div className="upload-options">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
          id="camera-input"
        />
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="gallery-input"
        />
        
        <label htmlFor="camera-input" className="upload-button">
          <IoCamera size={48} color="#3498DB" />
          <div className="upload-button-text">Take Photo</div>
          <div className="upload-button-subtext">Capture live image</div>
        </label>
        
        <label htmlFor="gallery-input" className="upload-button">
          <IoImages size={48} color="#9B59B6" />
          <div className="upload-button-text">Upload Photo</div>
          <div className="upload-button-subtext">Choose from gallery</div>
        </label>
      </div>
      
      <div className="instructions">
        <h3 className="instruction-title">Instructions:</h3>
        <div className="instruction-text">• Take clear photos of the hazard</div>
        <div className="instruction-text">• Ensure location services are enabled</div>
        <div className="instruction-text">• Select appropriate hazard type</div>
      </div>
    </div>
  );
};

export default Camera;