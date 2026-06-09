// @ts-ignore
import Iyzipay from 'iyzipay';

export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'sandbox-pF6JPex6gGBfpAWiHeXPomDJVBEr4RCs',
  secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-ARBM7yLcE2ndXcHwwY7nDtmJQOyz9WTJ',
  uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com',
});
