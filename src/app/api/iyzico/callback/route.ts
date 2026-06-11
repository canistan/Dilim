import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${hostHeader}`;

    // iyzico token'ı application/x-www-form-urlencoded olarak POST eder
    const formData = await req.formData()
    const token = formData.get('token')?.toString()

    if (!token) {
      return NextResponse.redirect(new URL('/odeme/basarisiz?neden=token-yok', siteUrl), 303)
    }

    const { iyzipay } = await import('@/lib/iyzico');

    const result: any = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve(
        { locale: 'tr', token },
        (err: unknown, res: any) => (err ? reject(err) : resolve(res)),
      )
    })

    const odemeBasarili = result?.status === 'success' && result?.paymentStatus === 'SUCCESS'
    const basketId = result?.basketId // We use basketId for Payload order id

    if (odemeBasarili && basketId) {
      try {
        const payload = await getPayload({ config: configPromise });
        await payload.update({
          collection: 'orders',
          id: basketId,
          data: {
            paymentStatus: 'paid',
          }
        });
      } catch (updateErr) {
        console.error("Sipariş güncellenirken hata oluştu:", updateErr);
      }

      return NextResponse.redirect(
        new URL(`/odeme/basarili?orderId=${encodeURIComponent(basketId)}`, siteUrl),
        303
      );
    }

    return NextResponse.redirect(
      new URL(`/odeme/basarisiz?neden=${encodeURIComponent(result?.errorMessage ?? 'odeme-onaylanmadi')}`, siteUrl),
      303
    );
  } catch (err) {
    console.error('iyzico callback hatası:', err)
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${hostHeader}`;
    return NextResponse.redirect(
      new URL(`/odeme/basarisiz?neden=sistem-hatasi`, siteUrl),
      303
    );
  }
}

export async function GET(req: NextRequest) {
  const protocol = req.headers.get('x-forwarded-proto') || 'https';
  const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${hostHeader}`;
  return NextResponse.redirect(new URL('/sepet', siteUrl), 303)
}
