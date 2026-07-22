const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// 5-8. Sınıf Seviyesinde 10 Zor Genel Kültür & Tarih Sorusu
const sorular = [
  { 
    id: 1, 
    soru: "1. Kurtuluş Savaşı'nda Mustafa Kemal Paşa'nın 'Siz orada yalnız düşmanı değil, milletin makus talihini de yendiniz' sözünü söylediği zafer hangisidir?", 
    cevaplar: ["2. inönü", "ikinci inönü", "2. inönü zaferi", "ikinci inönü zaferi"], 
    lat: 40.5018, lng: 30.1585 
  },
  { 
    id: 2, 
    soru: "2. Osmanlı Devleti'nin ilk yazılı anayasası olan Kanun-ı Esasi hangi padişah döneminde ilan edilmiştir?", 
    cevaplar: ["2. abdülhamid", "ikinci abdülhamid", "2. abdulhamid", "ikinci abdulhamid"], 
    lat: 40.5030, lng: 30.1600 
  },
  { 
    id: 3, 
    soru: "3. Doğu Anadolu'da kurulan, madencilik ve taş işçiliğinde uzmanlaşan, başkenti Tuşpa (Van) olan İlk Çağ uygarlığı hangisidir?", 
    cevaplar: ["urartular", "urartu"], 
    lat: 40.5005, lng: 30.1550 
  },
  { 
    id: 4, 
    soru: "4. Büyük Selçuklu Devleti'nin en parlak dönemini yaşatan ve ünlü Nizamiye Medreselerini kuran büyük vezir kimdir?", 
    cevaplar: ["nizamülmülk", "nizamulmulk", "nizamül mülk"], 
    lat: 40.5025, lng: 30.1570 
  },
  { 
    id: 5, 
    soru: "5. Fatih Sultan Mehmet'in İstanbul'un fethi için özel olarak döktürdüğü devasa sur yıkan topun adı nedir?", 
    cevaplar: ["şahi", "sahi", "şahi topu"], 
    lat: 40.5012, lng: 30.1590 
  },
  { 
    id: 6, 
    soru: "6. Milli Mücadele'de 'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır' ilkesi ilk kez hangi genelgede kabul edilmiştir?", 
    cevaplar: ["amasya genelgesi", "amasya"], 
    lat: 40.5040, lng: 30.1565 
  },
  { 
    id: 7, 
    soru: "7. 1. Dünya Savaşı'nda Osmanlı ordusunun İngiliz kuvvetlerini kuşatarak büyük bir zafer kazandığı Irak Cephesi'ndeki ünlü zafer nedir?", 
    cevaplar: ["kut'ül amare", "kutülamare", "kut ul amare", "kut zaferi"], 
    lat: 40.4995, lng: 30.1580 
  },
  { 
    id: 8, 
    soru: "8. Türk tarihinin bilinen ilk yazılı belgeleri olan Orhun Abideleri (Göktürk Kitabeleri) günümüzde hangi ülkenin sınırları içindedir?", 
    cevaplar: ["moğolistan", "mogolistan"], 
    lat: 40.5020, lng: 30.1620 
  },
  { 
    id: 9, 
    soru: "9. İstiklal Marşı'mız TBMM tarafından ilk kez hangi yılda kabul edilmiştir?", 
    cevaplar: ["1921"], 
    lat: 40.5035, lng: 30.1545 
  },
  { 
    id: 10, 
    soru: "10. Osmanlı Devleti'nin 1. Dünya Savaşı'ndan çekilmesine neden olan ve savaşı fiilen bitiren ateşkes antlaşması hangisidir?", 
    cevaplar: ["mondros", "mondros ateşkes antlaşması", "mondros mütarekesi"], 
    lat: 40.5010, lng: 30.1610 
  }
];

let liderler = [];

// Soruları istemciye cevapsız olarak gönder
app.get('/api/sorular', (req, res) => {
  const gonderilecek = sorular.map(s => ({ id: s.id, soru: s.soru, lat: s.lat, lng: s.lng }));
  res.json(gonderilecek);
});

// Liderlik Tablosu
app.get('/api/liderler', (req, res) => {
  res.json(liderler);
});

// Cevap Kontrolü
app.post('/api/cevapla', (req, res) => {
  const { soruIndex, cevap, kullaniciAdi, gecenSure, tamamlandi } = req.body;
  
  if (soruIndex < 0 || soruIndex >= sorular.length) {
    return res.json({ durum: false, mesaj: "Geçersiz soru numarası!" });
  }

  const hedefSoru = sorular[soruIndex];
  const temizCevap = (cevap || "").trim().toLowerCase().replace(/[''"]/g, '');

  // Esnek cevap kontrolü
  const dogruMu = hedefSoru.cevaplar.some(c => temizCevap === c || temizCevap.includes(c));

  if (dogruMu) {
    if (tamamlandi) {
      liderler.push({ kullaniciAdi: kullaniciAdi || "Anonim Oyuncu", sure: parseFloat(gecenSure) });
      liderler.sort((a, b) => a.sure - b.sure);
      return res.json({ durum: true, bitti: true, mesaj: "🎉 TEBRİKLER! 10 sorunun tamamını başarıyla tamamladınız!", tablo: liderler });
    }
    return res.json({ durum: true, bitti: false, mesaj: "✅ Doğru Cevap! Bir sonraki soruya geçiliyor..." });
  } else {
    return res.json({ durum: false, bitti: false, mesaj: "❌ Yanlış cevap, tekrar deneyin!" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Sunucu sorunsuz çalışıyor: http://localhost:${PORT}`);
});
