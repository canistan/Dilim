import { NextResponse } from 'next/server';
import { iyzipay } from '@/lib/iyzico';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function POST(req: Request) {
  try {
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${hostHeader}`;

    const formData = await req.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.redirect(`${siteUrl}/odeme/basarisiz?reason=MissingToken`);
    }

    if (token === 'mock-token-123') {
      // Mock Success Response
      return NextResponse.redirect(`${siteUrl}/odeme/basarili?orderId=mock-basket`);
    }

    return new Promise<Response>((resolve) => {
      iyzipay.checkoutForm.retrieve({
        locale: 'tr',
        conversationId: 'fallback-id', // Ideally this comes from the token mapping or your DB
        token: token
      }, async (err: any, result: any) => {
        if (err || result.status === 'failure' || result.paymentStatus !== 'SUCCESS') {
          resolve(NextResponse.redirect(`${siteUrl}/odeme/basarisiz?reason=${encodeURIComponent(result?.errorMessage || 'PaymentFailed')}`));
        } else {
          // Payment successful! Update DB order status here.
          try {
            const payload = await getPayload({ config: configPromise });
            await payload.update({
              collection: 'orders',
              id: result.basketId, // Ensure basketId matches order ID format
              data: {
                paymentStatus: 'paid',
                // Use a proper existing field if you have it. Let's assume just updating paymentStatus is enough.
              }
            });
          } catch (updateErr) {
            console.error("Ödeme başarılı oldu ancak sipariş güncellenirken hata oluştu:", updateErr);
          }
          resolve(NextResponse.redirect(`${siteUrl}/odeme/basarili?orderId=${result.basketId}`));
        }
      });
    });
  } catch (error) {
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${hostHeader}`;
    return NextResponse.redirect(`${siteUrl}/odeme/basarisiz?reason=InternalError`);
  }
}
