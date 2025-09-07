# Ocean Hazard Reporter - Web Frontend

A React-based web application for crowdsourced ocean hazard reporting, designed to work with a FastAPI backend.

## Features

- **Interactive Map**: React Leaflet integration for hazard visualization and reporting
- **Real-time Updates**: WebSocket integration for live hazard notifications
- **Photo Upload**: Camera and gallery integration for evidence capture
- **Responsive Design**: Mobile-first design with desktop optimization
- **Report Management**: Comprehensive hazard report filtering and status tracking
- **PWA Ready**: Progressive Web App capabilities for offline functionality

## Technology Stack

- **Frontend**: React 18, React Router DOM
- **Mapping**: React Leaflet, OpenStreetMap
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **Icons**: React Icons (Ionicons)
- **Styling**: CSS3 with responsive design

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- FastAPI backend server running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment configuration:
```bash
copy .env.example .env
```

3. Update `.env` with your FastAPI backend URL:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navigation.js    # Navigation component
├── pages/              # Page components
│   ├── Home.js         # Dashboard/home page
│   ├── Map.js          # Interactive map with reporting
│   ├── Camera.js       # Photo upload and hazard selection
│   └── Reports.js      # Report listing and filtering
├── services/           # API and WebSocket services
│   ├── api.js          # FastAPI integration
│   └── websocket.js    # Real-time communication
├── App.js              # Main app component
└── index.js            # App entry point
```

## API Integration

The app is designed to work with a FastAPI backend with the following endpoints:

### Hazard Reports
- `GET /api/reports` - Get all reports with filtering
- `POST /api/reports` - Create new hazard report
- `POST /api/reports/upload-image` - Upload image evidence
- `PATCH /api/reports/{id}/status` - Update report status

### Geospatial
- `GET /api/geospatial/hotspots` - Get hazard hotspots (DBSCAN clustering)
- `GET /api/geospatial/reports-in-radius` - Get reports within radius

### Statistics
- `GET /api/statistics/dashboard` - Get dashboard statistics
- `GET /api/statistics/reports-by-period` - Get time-based statistics

### Real-time Events
- `new_hazard_report` - New hazard reported
- `report_status_update` - Report status changed
- `emergency_alert` - Emergency notifications
- `hotspot_update` - Hotspot data updated

## Features Implementation

### Map Integration
- Uses React Leaflet for interactive mapping
- Click-to-report functionality
- Real-time hazard visualization with color-coded severity
- User location detection and display

### Photo Upload
- Camera capture for mobile devices
- Gallery selection for desktop/mobile
- Image preview before hazard type selection
- Location tagging with GPS coordinates

### Real-time Updates
- WebSocket connection for live updates
- Automatic reconnection handling
- Location-based subscriptions for relevant updates

### Responsive Design
- Mobile-first approach
- Bottom navigation for mobile
- Sidebar navigation for desktop
- Optimized touch targets and interactions

## Deployment

### Environment Variables for Production
```
REACT_APP_API_URL=https://your-fastapi-backend.com
REACT_APP_WS_URL=https://your-fastapi-backend.com
```

### Build and Deploy
```bash
npm run build
# Deploy the build/ folder to your web server
```

## Contributing

1. Follow the existing code structure and naming conventions
2. Ensure responsive design for all new components
3. Add proper error handling for API calls
4. Test on both mobile and desktop devices
5. Update this README for any new features

## License

This project is part of the SIH Hackathon submission for INCOIS ocean hazard reporting platform.