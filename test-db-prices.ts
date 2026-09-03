import payload from 'payload';
import config from './payload.config';

async function checkPrices() {
  await payload.init({ config, local: true });
  const products = await payload.find({
    collection: 'products',
    limit: 5,
  });
  console.log(products.docs.map(p => ({ title: p.title, price: p.price, sizes: p.sizes })));
  process.exit(0);
}
checkPrices();
