const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 3000;
const buildPath = path.join(__dirname, 'build');
let buildReady = false;

// Check if build exists
if (fs.existsSync(path.join(buildPath, 'index.html'))) {
  buildReady = true;
} else {
  // Build the app
  console.log('Building React app...');
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error('Build failed:', error);
      return;
    }
    console.log('Build completed successfully');
    buildReady = true;
  });
}

// Middleware to handle routing based on build status
app.use((req, res, next) => {
  if (buildReady) {
    express.static(buildPath)(req, res, next);
  } else {
    next();
  }
});

app.get('*', (req, res) => {
  if (buildReady) {
    res.sendFile(path.join(buildPath, 'index.html'));
  } else {
    res.send('<h1>Building application...</h1><script>setTimeout(() => location.reload(), 5000)</script>');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});