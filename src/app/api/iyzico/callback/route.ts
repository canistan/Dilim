import { NextResponse } from 'next/server';
import { iyzipay } from '@/lib/iyzico';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/odeme/basarisiz?reason=MissingToken`);
    }

    return new Promise((resolve) => {
      iyzipay.checkoutForm.retrieve({
        locale: 'tr',
        conversationId: 'fallback-id', // Ideally this comes from the token mapping or your DB
        token: token
      }, (err: any, result: any) => {
        if (err || result.status === 'failure' || result.paymentStatus !== 'SUCCESS') {
          resolve(NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/odeme/basarisiz?reason=${encodeURIComponent(result?.errorMessage || 'PaymentFailed')}`));
        } else {
          // Payment successful! Update DB order status here.
          resolve(NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/odeme/basarili?orderId=${result.basketId}`));
        }
      });
    });
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/odeme/basarisiz?reason=InternalError`);
  }
}
