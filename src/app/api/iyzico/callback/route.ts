import { NextResponse } from 'next/server';
// import { iyzipay } from '@/lib/iyzico';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function POST(req: Request) {
  try {
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${hostHeader}`;

    const redirectHtml = (url: string) => `
      <!DOCTYPE html>
      <html>
        <head><title>Yönlendiriliyor...</title></head>
        <body>
          <script>
            window.top.location.href = "${url}";
          </script>
        </body>
      </html>
    `;

    const bodyText = await req.text();
    let token = '';
    try {
      if (bodyText.trim().startsWith('{')) {
        const json = JSON.parse(bodyText);
        token = json.token;
      } else {
        const params = new URLSearchParams(bodyText);
        token = params.get('token') || '';
      }
    } catch (e) {
      console.error("Callback body parse error", e);
    }

    if (!token) {
      return new NextResponse(redirectHtml(`${siteUrl}/odeme/basarisiz?reason=MissingToken`), { headers: { 'Content-Type': 'text/html' } });
    }

    if (token === 'mock-token-123') {
      return new NextResponse(redirectHtml(`${siteUrl}/odeme/basarili?orderId=mock-basket`), { headers: { 'Content-Type': 'text/html' } });
    }

    const { iyzipay } = await import('@/lib/iyzico');

    const result = await new Promise((resolve) => {
      iyzipay.checkoutForm.retrieve({
        locale: 'tr',
        conversationId: 'fallback-id', 
        token: token
      }, async (err: any, result: any) => {
        if (err || result.status === 'failure' || result.paymentStatus !== 'SUCCESS') {
          resolve(new NextResponse(redirectHtml(`${siteUrl}/odeme/basarisiz?reason=${encodeURIComponent(result?.errorMessage || 'PaymentFailed')}`), { headers: { 'Content-Type': 'text/html' } }));
        } else {
          try {
            const payload = await getPayload({ config: configPromise });
            await payload.update({
              collection: 'orders',
              id: result.basketId, 
              data: {
                paymentStatus: 'paid',
              }
            });
          } catch (updateErr) {
            console.error("Ödeme başarılı oldu ancak sipariş güncellenirken hata oluştu:", updateErr);
          }
          resolve(new NextResponse(redirectHtml(`${siteUrl}/odeme/basarili?orderId=${result.basketId}`), { headers: { 'Content-Type': 'text/html' } }));
        }
      });
    });
    return result as Response;
  } catch (error) {
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${hostHeader}`;
    const fallbackHtml = `<html><body><script>window.top.location.href = "${siteUrl}/odeme/basarisiz?reason=InternalError";</script></body></html>`;
    return new NextResponse(fallbackHtml, { headers: { 'Content-Type': 'text/html' } });
  }
}
