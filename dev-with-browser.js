const { exec } = require('child_process');

let browserOpened = false;

// Start Next.js dev server
const server = exec('next dev');

server.stdout.on('data', (data) => {
  process.stdout.write(data);
  
  // Open browser when server is ready (look for the ready message)
  // Next.js typically outputs "Local:" or references to localhost:3000
  if (!browserOpened && (data.includes('Local:') || data.includes('localhost:3000') || data.includes('Ready in'))) {
    browserOpened = true;
    // Small delay to ensure server is fully ready
    setTimeout(async () => {
      console.log('\n🚀 Opening browser...\n');
      try {
        const open = (await import('open')).default;
        await open('http://localhost:3000');
      } catch (err) {
        console.error('Failed to open browser:', err.message);
      }
    }, 1000);
  }
});

server.stderr.on('data', (data) => {
  process.stderr.write(data);
});

server.on('exit', (code) => {
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit();
});

