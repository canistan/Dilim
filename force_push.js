const { spawn } = require('child_process');

// Run npm run dev to trigger payload push
const child = spawn('npm', ['run', 'dev'], {
  env: { ...process.env, CI: 'true', PAYLOAD_MIGRATION_INTERACTIVE: 'false' }
});

child.stdout.on('data', (data) => {
  const str = data.toString();
  process.stdout.write(str);
  
  if (str.includes('❯')) {
    // Send enter when we see a prompt
    child.stdin.write('\r');
  }
  
  if (str.includes('Compiled in')) {
    // Looks like it finished compiling and syncing
    console.log('SUCCESS! Finished pushing.');
    child.kill();
    process.exit(0);
  }
});

child.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

setTimeout(() => {
  console.log('Timeout reached. Exiting.');
  child.kill();
  process.exit(1);
}, 60000);
