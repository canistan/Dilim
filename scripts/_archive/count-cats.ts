import payload from 'payload';
import config from './payload.config';

async function run() {
  await payload.init({ config, local: true });
  const cats = await payload.find({ collection: 'categories', limit: 100 });
  const counts = [];
  for (const c of cats.docs) {
    const p = await payload.find({ collection: 'products', where: { category: { equals: c.id } }, limit: 100 });
    counts.push({ name: c.title, count: p.totalDocs });
  }
  counts.sort((a,b) => a.count - b.count);
  console.log(counts);
  process.exit(0);
}
run();
