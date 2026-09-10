// @ts-ignore
import Iyzipay from 'iyzipay';

export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'dummy_api_key_to_pass_build',
  secretKey: process.env.IYZICO_SECRET_KEY || 'dummy_secret_key_to_pass_build',
  uri: process.env.IYZICO_URI || 'https://api.iyzipay.com',
});

// Vercel NFT Workaround
// The iyzipay package uses dynamic requires for its models. Vercel's Node File Trace (NFT)
// fails to detect these, which means their dependencies (like postman-request) are not included
// in the serverless function bundle. We statically require them here so NFT traces them.
if (process.env.NODE_ENV === 'production') {
  try {
    require('iyzipay/lib/IyzipayResource');
    require('iyzipay/lib/resources/CheckoutFormInitialize');
    require('iyzipay/lib/resources/CheckoutForm');
  } catch (e) {
    // Ignore in case of local execution without dependencies
  }
}
