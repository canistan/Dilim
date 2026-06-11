// @ts-ignore
import Iyzipay from 'iyzipay';

export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'sandbox-pF6JPex6gGBfpAWiHeXPomDJVBEr4RCs',
  secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-ARBM7yLcE2ndXcHwwY7nDtmJQOyz9WTJ',
  uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com',
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
