const os = require('os');

setInterval(() => {
  const usage = os.loadavg()[0] / os.cpus().length;
  const percent = usage * 100;

  console.log(`CPU Usage: ${percent.toFixed(2)}%`);

  if (percent > 70) {
    console.warn('CPU above 70%, restarting...');
    process.exit(1); // or exec('pm2 restart all')
  }
}, 10000);
