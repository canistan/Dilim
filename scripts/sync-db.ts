import { getPayload } from 'payload'
import configPromise from './src/payload.config.js'

async function run() {
  console.log('Initializing payload...');
  await getPayload({ config: configPromise });
  console.log('Done!');
  process.exit(0);
}

run();
