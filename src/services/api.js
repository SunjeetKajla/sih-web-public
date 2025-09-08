import axios from 'axios';

// FastAPI backend URL - update this when your backend is deployed
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Hazard Reports API
export const hazardReportsAPI = {
  // Get all hazard reports
  getReports: async (filters = {}) => {
    try {
      const response = await api.get('/api/reports', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch reports');
    }
  },

  // Create new hazard report
  createReport: async (reportData) => {
    try {
      const response = await api.post('/api/reports', reportData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create report');
    }
  },

  // Upload image for report
  uploadImage: async (imageFile, reportId) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('report_id', reportId);
      
      const response = await api.post('/api/reports/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to upload image');
    }
  },

  // Get report by ID
  getReportById: async (reportId) => {
    try {
      const response = await api.get(`/api/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch report');
    }
  },

  // Update report status
  updateReportStatus: async (reportId, status) => {
    try {
      const response = await api.patch(`/api/reports/${reportId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update report status');
    }
  },
};

// Geospatial API
export const geospatialAPI = {
  // Get hotspots using DBSCAN clustering
  getHotspots: async (params = {}) => {
    try {
      const response = await api.get('/api/geospatial/hotspots', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch hotspots');
    }
  },

  // Get reports within radius
  getReportsInRadius: async (latitude, longitude, radius) => {
    try {
      const response = await api.get('/api/geospatial/reports-in-radius', {
        params: { latitude, longitude, radius }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch nearby reports');
    }
  },
};

// Statistics API
export const statisticsAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/statistics/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch statistics');
    }
  },

  // Get reports by time period
  getReportsByPeriod: async (period = '7d') => {
    try {
      const response = await api.get('/api/statistics/reports-by-period', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch report statistics');
    }
  },
};

// Social Media API
export const socialMediaAPI = {
  // Get social media mentions
  getSocialMentions: async (filters = {}) => {
    try {
      const response = await api.get('/api/social-media/mentions', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch social media mentions');
    }
  },

  // Analyze sentiment of social media posts
  analyzeSentiment: async (text) => {
    try {
      const response = await api.post('/api/social-media/analyze-sentiment', { text });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to analyze sentiment');
    }
  },
};

export default api;