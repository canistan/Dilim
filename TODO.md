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
- [x] **Haritalar & Yerel İşletme Vitrin SEO'su:** Apple Business Connect ve Yandex Business (Haritalar) üzerinden Kavacık ve Ümraniye şubeleri yapılandırıldı. Kapak fotoğrafları, menüler ve işletme kategorileri mükemmel şekilde düzenlendi. Yeni adresler onaylandı.


- [x] Sipariş oluşturma hatalarını Türkçeleştir ve kurumsal bir yapıya dönüştür (`odeme/page.tsx`).
- [x] Ürün kartlarındaki "Tasarla" butonunu Pastalar hariç diğer ürünlerde "Hızlı Ekle" yap (`ProductsClient.tsx`).
- [x] Kendi Pastanı Tasarla takvimine "Pazar kapalı" ve "Cumartesi öğlen -> Pazartesi öğlen teslimat" kuralını ekle (`CakeBuilder.tsx`).
- [x] **Özel Tasarım Pasta Hatalarının Giderilmesi:** Kendi Pastanı Tasarla sayfasında seçilen uzun metinli özelliklerin (örn. "Yuvarlak (Klasik)") admin paneline sadece "Diğer" veya "Yuvarlak" gibi kısa kodlarla düşme sorunu `CakeBuilder.tsx` tarafında ID'ler tam adlarıyla eşleştirilerek çözüldü.
- [x] **Ana Sayfa CMS Entegrasyonu:**
  - [x] `scripts/seed_homepage.ts` scriptini çalıştırıp sabit metinleri/görselleri veritabanına aktarmak.
  - [x] Ön yüzde (frontend) değişikliklerin sorunsuz çalıştığını doğrulamak.
- [x] `ContactMessages.ts`: İletişim mesajları koleksiyonunun ayarlanması/güncellenmesi.
- [x] `auth.ts`: Kullanıcı doğrulama/giriş işlemlerinin tamamlanması.
- [x] `PayloadLogo.tsx`: Admin panelindeki logonun özelleştirilmesi.
- [x] `iptal-iade/page.tsx`: İptal ve İade politikasının sayfaya eklenmesi/düzenlenmesi.
- [x] **Menü İçin Logolu QR Kod:** Menüye yönlendirecek ve ortasında Dilim Pastaneleri logosu bulunan bir QR kod oluşturulacak.
- [x] **Blog Görselleri Kırık Link Çözümü:** Bloglara admin panelinden yüklenen resimler Vercel'in geçici (tmp) dizininde kaybolduğu için sitedeki varsayılan görselleri bozuyordu. Veritabanındaki hayalet (`image_id`) kayıtları temizlenerek site standart görselleriyle tekrar aktif edildi. Yeni eklenecek görseller artık sorunsuz çalışacaktır.
- [ ] **Eksik Ürün Görsellerinin Yapay Zeka ile Üretilmesi (Mevcut Odak Noktası):** 
  - [x] "KURABİYE VE BÖREKLER" kategorisi için deneme görselleri üretildi, Cüneyd Bey için masaüstündeki onay klasörüne aktarıldı. "Sakallı" görselindeki yapay zeka çeviri hatası düzeltildi.
  - [ ] **Sıradaki Adım:** KURABİYE VE BÖREKLER görselleri sisteme yüklenmeli ve ardından sıradaki kategoriye (Örn: Şerbetli Tatlılar) geçilerek yapay zeka scripti çalıştırılmalı.
  - 📝 **Not:** Komutu `npx tsx scripts/generate_category_preview.ts "KATEGORİ ADI"` şeklinde çalıştırarak onay klasörüne üretiyoruz.
- [ ] **Birlikte İyi Gider (Cross-Sell) Optimizasyonu:**
  - Sepete eklenen ürüne göre mantıklı tamamlayıcı ürünler sunan (Çapraz Satış) sisteminin iyileştirilmesi (Örn: Tatlı alanlara dondurma önermek).

## 🅿️ Park Edilen Konular
- [x] **Apple Business Connect Doğrulaması:** Turhost cPanel'e eklenen TXT kaydı (`apple-domain-verification=SncrGRwVx0sB5fkc`) dünya genelindeki DNS sunucularında başarıyla doğrulandı. Apple ekranındaki "Doğrula" butonuna basılıp "İnceleme İçin Gönder" onayına sunuldu.
- [x] **IHS Yönlendirme & SSL Yapılandırması (`dilimpastaneleri.com` & `dilimpastaneleri.com.tr`):**
  - [x] IHS panelinde iki domain için de **DNS Zone** kısmından A Kaydı IP adresi `76.76.21.21` (Vercel IP) olarak ayarlandı.
  - [x] Vercel projesine (`dilim`) iki alan adı da (`dilimpastaneleri.com` ve `dilimpastaneleri.com.tr`) başarıyla eklendi. DNS yayılımı sonrası Otomatik Let's Encrypt SSL sertifikaları tanımlanacak ve `https://www.dilim.com.tr` adresine sorunsuz yönlendirilecek.
- [x] **İyzico Canlı Ortam Geçişi:** İyzico live (canlı) API anahtarları tanımlandı ve test edildi.
- [x] **Vercel Build (ETIMEDOUT) Kontrolü:** Veritabanı uykuya daldığı için Next.js build'i ETIMEDOUT vermişti. Redeploy ile veritabanı uyandırılarak sorunsuz deploy edildi.
- [x] **Facebook ile Giriş Hatası:** Facebook ile girişlerde (login) yaşanan problem yeni App oluşturularak ve Vercel env'leri güncellenerek tamamen çözüldü!
- [ ] **İyzico Sandbox Anahtar Rotasyonu:** Git geçmişinde kalan eski sandbox (test) API anahtarlarının iyzico panelinden rotate (yenilenmesi) edilmesi gerekiyor. Güvenlik riski düşük (sandbox ortamı, gerçek ödeme işlemi yapılamaz) ama best practice olarak yapılmalıdır.

## 🔒 Güvenlik & Uyumluluk
- [x] **Kritik: Boyut/Fiyat Manipülasyonu Düzeltmesi:** Ödeme akışında (`odeme-baslat/route.ts`) client'ın gönderdiği serbest metin üzerinden boyut eşleştirmesi yapılıyordu — saldırgan ucuz boyutun ID'sini gönderip pahalı boyutun adını yazarak fark ödemeden büyük boy alabiliyordu. Sunucu tarafında boyut doğrulaması ve options üretimi güvenceye alındı.
- [x] **Google Consent Mode v2 (KVKK Uyumu):** GA4 artık kullanıcı çerez onayını vermeden (`CookiePopup`) hiçbir analitik/reklam verisi toplamıyor. `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` varsayılan olarak `denied` başlatılıyor.
- [x] **Duplicate Content Koruması:** `dilimpastaneleri.com` ve `.com.tr` alan adları `middleware.ts` ile 301 kalıcı yönlendirmeye alındı.
- [x] **Google Search Console Uyarıları:** `hasMerchantReturnPolicy` (gıda kanunlarına uygun iade yok) ve `shippingDetails` (1 gün teslimat, İstanbul) ürün sayfalarına eklendi.

## ✅ Tamamlananlar
- 
