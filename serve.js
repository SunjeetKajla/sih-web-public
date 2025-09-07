const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 3000;
const buildPath = path.join(__dirname, 'build');

// Start server immediately to bind port
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Function to setup routes after build is ready
function setupRoutes() {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Check if build exists, if not build it
if (fs.existsSync(buildPath)) {
  setupRoutes();
} else {
  // Serve loading page while building
  app.get('*', (req, res) => {
    res.send('<h1>Building application...</h1><script>setTimeout(() => location.reload(), 10000)</script>');
  });
  
  // Build the app
  console.log('Building React app...');
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error('Build failed:', error);
      return;
    }
    console.log('Build completed successfully');
    // Clear existing routes and setup new ones
    app._router = null;
    setupRoutes();
  });
}