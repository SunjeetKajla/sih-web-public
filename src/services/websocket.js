import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(url = process.env.REACT_APP_WS_URL || 'https://sih-web-server.onrender.com') {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.emit('connection_status', { connected: false });
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.emit('connection_error', error);
    });

    // Listen for real-time hazard reports
    this.socket.on('new_hazard_report', (data) => {
      this.emit('new_hazard_report', data);
    });

    // Listen for report status updates
    this.socket.on('report_status_update', (data) => {
      this.emit('report_status_update', data);
    });

    // Listen for emergency alerts
    this.socket.on('emergency_alert', (data) => {
      this.emit('emergency_alert', data);
    });

    // Listen for hotspot updates
    this.socket.on('hotspot_update', (data) => {
      this.emit('hotspot_update', data);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Subscribe to events
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // If socket is available, also listen on socket
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Unsubscribe from events
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit events to listeners
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Send data to server
  send(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected. Cannot send data.');
    }
  }

  // Join a room (for location-based updates)
  joinLocationRoom(latitude, longitude, radius = 10) {
    this.send('join_location_room', {
      latitude,
      longitude,
      radius
    });
  }

  // Leave a room
  leaveLocationRoom(latitude, longitude) {
    this.send('leave_location_room', {
      latitude,
      longitude
    });
  }

  // Subscribe to real-time updates for a specific area
  subscribeToAreaUpdates(bounds) {
    this.send('subscribe_area_updates', bounds);
  }

  // Unsubscribe from area updates
  unsubscribeFromAreaUpdates() {
    this.send('unsubscribe_area_updates');
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;