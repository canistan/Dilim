import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function run() {
  const payload = await getPayload({ config: configPromise })

  try {
    const res = await payload.update({
      collection: 'products',
      id: 366, // The ID from the previous error log
      data: {
        images: [284]
      }
    });
    console.log("Success!", res.images);
  } catch (err: any) {
    console.error(err);
    if (err.data && err.data.errors) {
      console.error(JSON.stringify(err.data.errors, null, 2));
    }
  }

  process.exit(0);
}

run().catch(console.error);
