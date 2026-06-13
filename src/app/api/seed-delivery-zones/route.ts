import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });

    // 1. Şubeleri kontrol et
    const branches = await payload.find({
      collection: 'branches' as any,
    });

    let mainBranchId = '';

    if (branches.totalDocs === 0) {
      const newBranch = await payload.create({
        collection: 'branches' as any,
        data: {
          name: 'Kavacık Merkez Şube',
          address: 'Rüzgarlıbahçe Mah. Cumhuriyet Cad. Acarlar İş Merkezi Beykoz/İstanbul',
          phone: '+90 505 963 80 21',
          workingHours: '08:00 - 22:00',
        },
      });
      mainBranchId = newBranch.id;
    } else {
      mainBranchId = branches.docs[0].id;
    }

    // 2. Teslimat Bölgelerini Oluştur
    const zonesToCreate = [
      { name: 'Kavacık', deliveryFee: 0 },
      { name: 'Çubuklu', deliveryFee: 30 },
      { name: 'Göksu', deliveryFee: 20 },
      { name: 'Anadolu Hisarı', deliveryFee: 50 },
      { name: 'Kanlıca', deliveryFee: 50 },
      { name: 'Beykoz Merkez', deliveryFee: 70 },
      { name: 'Rüzgarlıbahçe', deliveryFee: 0 },
      { name: 'Acarlar', deliveryFee: 10 },
      { name: 'Göztepe (Kadıköy)', deliveryFee: 150 },
      { name: 'Ataşehir', deliveryFee: 120 }
    ];

    let count = 0;

    for (const zone of zonesToCreate) {
      const existing = await payload.find({
        collection: 'delivery-zones' as any,
        where: { name: { equals: zone.name } },
      });

      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'delivery-zones' as any,
          data: {
            name: zone.name,
            deliveryFee: zone.deliveryFee,
            isActive: true,
            branch: mainBranchId,
          },
        });
        count++;
      }
    }

    return NextResponse.json({ success: true, message: `${count} yeni teslimat bölgesi başarıyla oluşturuldu ve şubeye bağlandı!` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
