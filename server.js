const express = require('express');
const QRCode = require('qrcode');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. مسار التحقق
app.get('/verify', (req, res) => {
    const id = req.query.id || '1299';
    res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تفاصيل تصريح العمل</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding-top: 50px; background-color: #f4f6f9; }
          .card { background: white; max-width: 400px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .status { color: green; font-weight: bold; font-size: 1.2em; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>تفاصيل التصريح رقم (${id})</h2>
          <p class="status">✔ تصريح ساري وصالح للاستخدام</p>
        </div>
      </body>
      </html>
    `);
});

// 2. مسار توليد الـ QR
app.get('/generate-qr', async (req, res) => {
    const id = req.query.id || '1299';
    const verifyUrl = `https://qr-verifier-mwcx.onrender.com/verify?id=${id}`;

    try {
        const qrImage = await QRCode.toDataURL(verifyUrl);
        res.send(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>توليد QR</title>
                <style>
                    body { font-family: sans-serif; text-align: center; padding-top: 40px; }
                    img { border: 1px solid #ccc; border-radius: 8px; padding: 10px; }
                    a { color: #0066cc; word-break: break-all; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h3>رمز QR الخاص بالتصريح رقم (${id})</h3>
                <div>
                    <img src="${qrImage}" style="width: 250px; height: 250px;" alt="QR Code" />
                </div>
                <p>قم بمسح الكود أعلاه بكاميرا الهاتف أو اضغط على الرابط:</p>
                <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
            </body>
            </html>
        `);
    } catch (err) {
        res.status(500).send('خطأ في توليد الـ QR');
    }
});

// 3. تشغيل الخادم (في آخر الملف دائماً)
app.listen(PORT, () => {
    console.log(`✅ الخادم يعمل الآن على المنفذ: ${PORT}`);
});