# 📝 Dilim Projesi - Görevler ve Notlar

> **Not:** Bu dosya, IDE çökmesi veya sohbetin kapanması durumunda nerede kaldığımızı hatırlamak için oluşturulmuştur. Yeni bir sohbete başladığınızda asistanınız (ben) burayı kontrol ederek projeye kaldığı yerden devam edebilir.

## 🚧 Aktif Görevler
*(Ekran görüntünüzden ve açık dosyalardan toparlanan görevler)*

### 🔥 Yeni Gelen Talepler (Dilim Site)
- [x] **Karışık petifür yok - oluşturulacak.**
- [x] **Ürünlerde filtre kırılımında geri geldiğimizde aynı filtreye düşelim.** (URL parametresi ile State senkronizasyonu)
- [x] **Ürünler kategorileri tekrar gözden geçirilecek.**
- [x] **AI Destekli GEO & SEO Optimizasyonu:** Bütün ürün ve kategorilerin bozuk slug'ları temizlendi. Eski linklerin 404 vermemesi için akıllı 301 (Permanent Redirect) fallback sistemi eklendi. Kavacık & Ümraniye hedefli SEO metinleri ve sitemap yapılandırıldı.
- [x] **Kavacık & Ümraniye Odaklı Local SEO Blog İçerikleri:** Kavacık ve Ümraniye yerel aramaları için 3 adet SEO makalesi yazıldı ve sisteme eklendi (`/blog`).


- [x] Sipariş oluşturma hatalarını Türkçeleştir ve kurumsal bir yapıya dönüştür (`odeme/page.tsx`).
- [x] Ürün kartlarındaki "Tasarla" butonunu Pastalar hariç diğer ürünlerde "Hızlı Ekle" yap (`ProductsClient.tsx`).
- [x] Kendi Pastanı Tasarla takvimine "Pazar kapalı" ve "Cumartesi öğlen -> Pazartesi öğlen teslimat" kuralını ekle (`CakeBuilder.tsx`).
- [ ] **Ürün Görselleri Üretimi:** Hazırlanan `generate_all_images.ts` scriptini çalıştırarak tüm dummy ürünler için yapay zeka ile görsel üret (Yaklaşık 110 ürün).
- [x] **Ana Sayfa CMS Entegrasyonu:**
  - [x] `scripts/seed_homepage.ts` scriptini çalıştırıp sabit metinleri/görselleri veritabanına aktarmak.
  - [x] Ön yüzde (frontend) değişikliklerin sorunsuz çalıştığını doğrulamak.
- [x] `ContactMessages.ts`: İletişim mesajları koleksiyonunun ayarlanması/güncellenmesi.
- [x] `auth.ts`: Kullanıcı doğrulama/giriş işlemlerinin tamamlanması.
- [x] `PayloadLogo.tsx`: Admin panelindeki logonun özelleştirilmesi.
- [x] `iptal-iade/page.tsx`: İptal ve İade politikasının sayfaya eklenmesi/düzenlenmesi.
- [x] **Menü İçin Logolu QR Kod:** Menüye yönlendirecek ve ortasında Dilim Pastaneleri logosu bulunan bir QR kod oluşturulacak.
- [/] **Eksik Ürün Görsellerinin Üretilmesi:** (Kota sıfırlandığında devam edilecek)
  - [x] 56 eksik görsel kategorilere ayrılacak.
  - [/] Sitedeki diğer görseller standardında, yüksek kaliteli ve düşük boyutlu (WEBP formatında) yapay zeka ile görseller üretilecek. (23/65 görsel tamamlandı — Kota ~18:44'te sıfırlanacak)
  - [/] Üretilen görseller sisteme yüklenecek.
  - 📝 **Not (Görsel Üretimi Nasıl Çalışır):** Görsel üretimi `scripts/generate_all_images.ts` üzerinden Payload CMS'in `products` koleksiyonundan görseli olmayan (veya test/default görseli olan) ürünleri otomatik olarak çekerek DALL-E 3 ile yüksek kaliteli (WEBP) görsel üretip sisteme yükler. Komutu `npx tsx scripts/generate_all_images.ts` şeklinde çalıştırarak üretimi yapıyoruz.
- [ ] **Birlikte İyi Gider (Cross-Sell) Optimizasyonu:**
  - Sepete eklenen ürüne göre mantıklı tamamlayıcı ürünler sunan (Çapraz Satış) sisteminin iyileştirilmesi (Örn: Tatlı alanlara dondurma önermek).

## 🅿️ Park Edilen Konular
- [x] **Apple Business Connect Doğrulaması:** Turhost cPanel'e eklenen TXT kaydı (`apple-domain-verification=SncrGRwVx0sB5fkc`) dünya genelindeki DNS sunucularında başarıyla doğrulandı. Apple ekranındaki "Doğrula" butonuna basılıp "İnceleme İçin Gönder" onayına sunuldu.
- [x] **IHS Yönlendirme & SSL Yapılandırması (`dilimpastaneleri.com` & `dilimpastaneleri.com.tr`):**
  - [x] IHS panelinde iki domain için de **DNS Zone** kısmından A Kaydı IP adresi `76.76.21.21` (Vercel IP) olarak ayarlandı.
  - [x] Vercel projesine (`dilim`) iki alan adı da (`dilimpastaneleri.com` ve `dilimpastaneleri.com.tr`) başarıyla eklendi. DNS yayılımı sonrası Otomatik Let's Encrypt SSL sertifikaları tanımlanacak ve `https://www.dilim.com.tr` adresine sorunsuz yönlendirilecek.
- [x] **İyzico Canlı Ortam Geçişi:** İyzico live (canlı) API anahtarları tanımlandı ve test edildi.
- [x] **Facebook ile Giriş Hatası:** Facebook ile girişlerde (login) yaşanan problem yeni App oluşturularak ve Vercel env'leri güncellenerek tamamen çözüldü!
- [ ] **İyzico Sandbox Anahtar Rotasyonu:** Git geçmişinde kalan eski sandbox (test) API anahtarlarının iyzico panelinden rotate (yenilenmesi) edilmesi gerekiyor. Güvenlik riski düşük (sandbox ortamı, gerçek ödeme işlemi yapılamaz) ama best practice olarak yapılmalıdır.

## 🔒 Güvenlik & Uyumluluk
- [x] **Kritik: Boyut/Fiyat Manipülasyonu Düzeltmesi:** Ödeme akışında (`odeme-baslat/route.ts`) client'ın gönderdiği serbest metin üzerinden boyut eşleştirmesi yapılıyordu — saldırgan ucuz boyutun ID'sini gönderip pahalı boyutun adını yazarak fark ödemeden büyük boy alabiliyordu. Sunucu tarafında boyut doğrulaması ve options üretimi güvenceye alındı.
- [x] **Google Consent Mode v2 (KVKK Uyumu):** GA4 artık kullanıcı çerez onayını vermeden (`CookiePopup`) hiçbir analitik/reklam verisi toplamıyor. `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` varsayılan olarak `denied` başlatılıyor.
- [x] **Duplicate Content Koruması:** `dilimpastaneleri.com` ve `.com.tr` alan adları `middleware.ts` ile 301 kalıcı yönlendirmeye alındı.
- [x] **Google Search Console Uyarıları:** `hasMerchantReturnPolicy` (gıda kanunlarına uygun iade yok) ve `shippingDetails` (1 gün teslimat, İstanbul) ürün sayfalarına eklendi.

## ✅ Tamamlananlar
- 
