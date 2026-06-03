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
