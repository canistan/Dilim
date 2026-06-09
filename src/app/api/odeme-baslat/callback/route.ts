import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { iyzipay } from '@/lib/iyzico'

const retrieveCheckoutForm = (request: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(request, (err: any, result: any) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export async function POST(req: Request) {
  try {
    // Iyzico sends data as application/x-www-form-urlencoded
    const formData = await req.formData()
    const token = formData.get('token') as string

    if (!token) {
      return NextResponse.redirect(new URL('/odeme/basarisiz', req.url))
    }

    const request = {
      locale: 'tr',
      token: token
    };

    const result = await retrieveCheckoutForm(request);

    if (result.paymentStatus === 'SUCCESS') {
      const payload = await getPayload({ config: configPromise })
      
      // Update order status in Payload
      const orders = await payload.find({
        collection: 'orders',
        where: {
          id: {
            equals: result.basketId
          }
        }
      });

      if (orders.docs.length > 0) {
        await payload.update({
          collection: 'orders',
          id: orders.docs[0].id,
          data: {
            paymentStatus: 'paid',
            status: 'preparing'
          }
        })
        
        return NextResponse.redirect(new URL(`/odeme/basarili?orderNumber=${orders.docs[0].orderNumber}`, req.url))
      }

      return NextResponse.redirect(new URL(`/odeme/basarili`, req.url))
    } else {
      // Payment failed
      return NextResponse.redirect(new URL(`/odeme/basarisiz?reason=${encodeURIComponent(result.errorMessage || 'Ödeme başarısız')}`, req.url))
    }

  } catch (error: any) {
    console.error('Checkout callback error:', error)
    return NextResponse.redirect(new URL('/odeme/basarisiz', req.url))
  }
}
