const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Pamukova Bulmacası
const bulmaca = {
  id: 1,
  soru: "Pamukova'nın en ünlü tarım ürünü nedir?",
  cevap: "ayva",
  lat: 40.5018,
  lng: 30.1585
};

let liderler = [];

// Bulmaca bilgisini gönder
app.get('/api/bulmaca', (req, res) => {
  res.json({ soru: bulmaca.soru, lat: bulmaca.lat, lng: bulmaca.lng });
});

// Güncel sıralamayı gönder
app.get('/api/liderler', (req, res) => {
  res.json(liderler);
});

// Cevap kontrolü
app.post('/api/cevapla', (req, res) => {
  const { kullaniciAdi, cevap, gecenSure } = req.body;
  
  if (cevap.trim().toLowerCase() === bulmaca.cevap) {
    liderler.push({ kullaniciAdi, sure: parseFloat(gecenSure) });
    liderler.sort((a, b) => a.sure - b.sure); // En hızlıları üste koy
    res.json({ durum: true, mesaj: "🎉 Tebrikler! Doğru Cevap!", tablo: liderler });
  } else {
    res.json({ durum: false, mesaj: "❌ Yanlış cevap, tekrar deneyin!" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Sunucu sorunsuz çalışıyor: http://localhost:${PORT}`);
});