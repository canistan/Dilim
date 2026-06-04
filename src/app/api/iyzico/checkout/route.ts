import { NextResponse } from 'next/server';
import { iyzipay } from '@/lib/iyzico';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerInfo, amount } = body;
    
    // In a real application, you would save this to Payload CMS Orders collection here
    // and use the real database ID for conversationId
    const orderId = uuidv4(); 

    const requestData = {
      locale: 'tr',
      conversationId: orderId,
      price: amount.toString(),
      paidPrice: amount.toString(),
      currency: 'TRY',
      basketId: `B-${orderId.substring(0, 8)}`,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/iyzico/callback`,
      enabledInstallments: [2, 3, 6, 9],
      buyer: {
        id: 'BY789',
        name: customerInfo.name.split(' ')[0] || 'Müşteri',
        surname: customerInfo.name.split(' ').slice(1).join(' ') || 'Soyadı',
        gsmNumber: customerInfo.phone || '+905320000000',
        email: customerInfo.email || 'email@email.com',
        identityNumber: '74300864791',
        lastLoginDate: '2015-10-05 12:43:35',
        registrationDate: '2013-04-21 15:12:09',
        registrationAddress: customerInfo.address || 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732',
      },
      shippingAddress: {
        contactName: customerInfo.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: customerInfo.address || 'Adres',
        zipCode: '34732',
      },
      billingAddress: {
        contactName: customerInfo.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: customerInfo.address || 'Adres',
        zipCode: '34732',
      },
      basketItems: [
        {
          id: 'ITEM1',
          name: 'Dilim Özel Sipariş',
          category1: 'Pasta',
          itemType: 'PHYSICAL',
          price: amount.toString(),
        },
      ],
    };

    return new Promise<Response>((resolve) => {
      // API Anahtarları girilmemişse (Sandbox veya boş) Demo Modu Çalıştır
      if (!process.env.IYZICO_API_KEY || process.env.IYZICO_API_KEY === 'sandbox-api-key') {
        const mockForm = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 40px; background: #ffffff; border-radius: 16px; border: 1px solid #f0f0f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: center; margin-bottom: 24px;">
              <svg width="120" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M48.8 33.6C48.8 42.4 41.6 49.6 32.8 49.6C24 49.6 16.8 42.4 16.8 33.6C16.8 24.8 24 17.6 32.8 17.6C41.6 17.6 48.8 24.8 48.8 33.6Z" fill="#1B44FA"/>
                <path d="M32.8 57.6C24 57.6 16.8 64.8 16.8 73.6V82.4H48.8V73.6C48.8 64.8 41.6 57.6 32.8 57.6Z" fill="#1B44FA"/>
                <path d="M80.8 17.6H112.8L96.8 57.6L80.8 17.6Z" fill="#1B44FA"/>
                <path d="M120.8 17.6H152.8V82.4H120.8V17.6Z" fill="#1B44FA"/>
                <text x="170" y="65" font-family="Arial" font-weight="bold" font-size="48" fill="#1B44FA">iyzico</text>
              </svg>
            </div>
            <h3 style="color: #1a1a1a; margin-bottom: 12px; font-size: 20px;">Test Ödeme Simülasyonu</h3>
            <p style="color: #666; margin-bottom: 30px; font-size: 14px; line-height: 1.5; max-width: 400px; margin-left: auto; margin-right: auto;">Gerçek API anahtarları yapılandırılmadığı için sistem <b>Test (Mock)</b> modunda çalışmaktadır. Bu ekranda gerçek bir kart bilgisi girmenize gerek yoktur.</p>
            
            <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; max-width: 360px; margin: 0 auto; text-align: left; border: 1px solid #e9ecef;">
               <div style="display: flex; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px dashed #ccc; padding-bottom: 16px;">
                 <span style="color: #666; font-size: 14px;">Ödenecek Tutar</span>
                 <span style="color: #1a1a1a; font-size: 18px; font-weight: bold;">${amount} TL</span>
               </div>
               
               <form method="POST" action="/api/iyzico/callback" style="margin: 0;">
                 <input type="hidden" name="token" value="mock-token-123" />
                 <button type="submit" style="width: 100%; background: #1B44FA; color: white; border: none; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 12px rgba(27, 68, 250, 0.3);">
                   Ödemeyi Tamamla
                 </button>
               </form>
               <p style="text-align: center; color: #999; font-size: 12px; margin-top: 16px; margin-bottom: 0;">Iyzico Test Ortamı</p>
            </div>
          </div>
        `;
        return resolve(NextResponse.json({ 
          token: "mock-token-123", 
          checkoutFormContent: mockForm
        }));
      }

      iyzipay.checkoutFormInitialize.create(requestData, (err: any, result: any) => {
        if (err || result.status === 'failure') {
          resolve(NextResponse.json({ error: err || result.errorMessage }, { status: 400 }));
        } else {
          resolve(NextResponse.json({ 
            token: result.token, 
            checkoutFormContent: result.checkoutFormContent,
            pageUrl: result.paymentPageUrl 
          }));
        }
      });
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
