# Dini İçerik Kaynakları

Sükût fetva veren bir uygulama gibi konumlandırılmayacaktır. İçerikler kaynaklı, ölçülü ve manevi destek diliyle hazırlanmalıdır.

## Seçilen Ana Kaynaklar

1. **Kur'an ayetleri, meal ve tefsir referansı**
   - Diyanet İşleri Başkanlığı Kur'an Yolu Türkçe Meal ve Tefsir ana kaynak olarak kullanılacak.
   - Web referansı: https://kuran.diyanet.gov.tr

2. **Hadis referansları**
   - Diyanet Hadislerle İslam külliyatı ana hadis referansı olarak kullanılacak.
   - Web referansı: https://hadislerleislam.diyanet.gov.tr

3. **Kavram ve özel gün açıklamaları**
   - Türkiye Diyanet Vakfı İslam Ansiklopedisi destekleyici referans olarak kullanılacak.
   - Web referansı: https://islamansiklopedisi.org.tr

4. **Namaz vakitleri**
   - Birincil tercih: Aladhan API.
   - Calculation method: `13` - Diyanet İşleri Başkanlığı, Turkey.
   - Referans: https://aladhan.com/prayer-times-api
   - Method listesi: https://aladhan.com/calculation-methods
   - API hatası veya internet yoksa mevcut seed/cache fallback kullanılır.

## İçerik İlkeleri

- Her içerikte `source` alanı doldurulmalıdır.
- Kaynağı net olmayan içerik yayınlanmamalıdır.
- Kesin hüküm, fetva veya kişiyi yönlendiren bağlayıcı dini karar dili kullanılmamalıdır.
- Ruh hali önerileri psikolojik/ruhani destek tonu taşır; tıbbi veya dini hüküm iddiası taşımaz.
- Türkçe karakterler doğrudan UTF-8 saklanır.

## Admin İçerik Girişi

Admin panel kayıt öncesi mojibake uyarısı üretir. Örnek bozuk karakterler:

- `Ý`
- `þ`
- `ð`
- `Ä±`
- `Ã§`
- `Ã¼`

## Kaynak Ekleme Standardı

Kaynakları tek tek elle kod dosyasına yazmak zorunda değilsin. Admin panelde içerik eklerken `Kaynak` alanı doldurulmalıdır. Seed içerikler için başlangıç kaynakları kod içinde eklidir.

Önerilen format:

- Ayet için: `Bakara Suresi 201. ayet`
- Hadis için: `Buhârî, Ezân, 155; Müslim, Mesâcid, 146`
- Kavram/özel gün için: `TDV İslâm Ansiklopedisi, Cuma maddesi`
- Diyanet içerikleri için: `Diyanet Kur'an Yolu, Bakara 201` veya `Diyanet Hadislerle İslam, ilgili bölüm`

Yayın öncesi kontrol sırası:

1. Arapça metin, Türkçe okunuş ve anlam aynı kaynakla uyumlu mu?
2. Kaynak alanı boş mu?
3. İçerik fetva/kesin hüküm dili taşıyor mu?
4. Ruh hali tavsiyesi psikolojik veya tıbbi iddia gibi duruyor mu?
5. Türkçe karakterlerde bozulma var mı?

Kaynak doğrulaması tamamlanmamış içerik `isActive=false` bırakılmalıdır.
