import { spawn } from 'child_process';

console.log('[Dev] Starting Tiger Data Hypertable Studio...');

const server = spawn('node', ['server.js'], { stdio: 'inherit', shell: true });
const client = spawn('npx', ['vite', '--host'], { stdio: 'inherit', shell: true });

function cleanup() {
  console.log('\n[Dev] Shutting down services...');
  server.kill();
  client.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
