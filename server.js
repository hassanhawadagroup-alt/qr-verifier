const express = require('express');
const QRCode = require('qrcode');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 💾 قاعدة بيانات التصاريح (يمكنك إضافة أو تعديل البيانات هنا لإصدار أكثر من تصريح)
const permitsDatabase = {
    "1299": {
        id: "1299",
        workerName: "محمد أحمد علي",
        nationalId: "2450198234",
        nationality: "مصري",
        jobTitle: "مهندس تقنية معلومات",
        facilityName: "شركة الحلول المتقدمة للمقاولات",
        facilityCr: "1010892341",
        issueDate: "2024-01-15",
        expiryDate: "2025-01-14",
        status: "ساري",
        statusColor: "#28a745"
    },
    "1300": {
        id: "1300",
        workerName: "عبدالله خالد العتيبي",
        nationalId: "1098234512",
        nationality: "سعودي",
        jobTitle: "مشرف مشروع",
        facilityName: "مؤسسة البناء الحديث",
        facilityCr: "1010567890",
        issueDate: "2024-02-01",
        expiryDate: "2025-01-31",
        status: "ساري",
        statusColor: "#28a745"
    }
};

// 1. صفحة التحقق من التصريح (مع عرض كافة العناصر والتفاصيل)
app.get('/verify', (req, res) => {
    const id = req.query.id || '1299';
    const permit = permitsDatabase[id];

    if (!permit) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head><meta charset="UTF-8"><title>غير موجود</title></head>
            <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
                <h2>⚠️ التصريح رقم (${id}) غير موجود أو ملغى.</h2>
            </body>
            </html>
        `);
    }

    res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تفاصيل تصريح العمل - ${permit.id}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e0e0e0; }
          .header { background-color: #1a365d; color: white; padding: 20px; text-align: center; }
          .header h2 { margin: 0; font-size: 22px; }
          .header p { margin: 5px 0 0; font-size: 14px; color: #cbd5e0; }
          .status-bar { background-color: ${permit.statusColor}; color: white; text-align: center; padding: 10px; font-weight: bold; font-size: 16px; }
          .body-content { padding: 20px; }
          .info-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .info-table th, .info-table td { padding: 12px 10px; text-align: right; border-bottom: 1px solid #edf2f7; }
          .info-table th { background-color: #f7fafc; color: #4a5568; font-weight: 600; width: 35%; }
          .info-table td { color: #2d3748; font-weight: 500; }
          .footer { text-align: center; padding: 15px; background: #f7fafc; color: #718096; font-size: 12px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>منصة التحقق من تصاريح العمل</h2>
            <p>تفاصيل التصريح الإلكتروني المعتمد</p>
          </div>
          <div class="status-bar">
            ✔ حالة التصريح: ${permit.status}
          </div>
          <div class="body-content">
            <table class="info-table">
              <tr><th>رقم التصريح</th><td>${permit.id}</td></tr>
              <tr><th>اسم العامل</th><td>${permit.workerName}</td></tr>
              <tr><th>رقم الهوية/الإقامة</th><td>${permit.nationalId}</td></tr>
              <tr><th>الجنسية</th><td>${permit.nationality}</td></tr>
              <tr><th>المهنة</th><td>${permit.jobTitle}</td></tr>
              <tr><th>اسم المنشأة</th><td>${permit.facilityName}</td></tr>
              <tr><th>رقم السجل التجاري</th><td>${permit.facilityCr}</td></tr>
              <tr><th>تاريخ الإصدار</th><td>${permit.issueDate}</td></tr>
              <tr><th>تاريخ الانتهاء</th><td>${permit.expiryDate}</td></tr>
            </table>
          </div>
          <div class="footer">
            تم التحقق من هذه البيانات إلكترونياً وهي صالحة للاستخدام الرسمي.
          </div>
        </div>
      </body>
      </html>
    `);
});

// 2. صفحة توليد الـ QR
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
                <title>توليد رمز QR - تصريح ${id}</title>
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 40px 20px; background-color: #f9f9f9; }
                    .card { background: white; max-width: 450px; margin: 0 auto; padding: 25px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                    img { border: 1px solid #eee; border-radius: 8px; padding: 10px; background: #fff; }
                    a { color: #0066cc; word-break: break-all; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h3>رمز QR التصريح رقم (${id})</h3>
                    <div>
                        <img src="${qrImage}" style="width: 230px; height: 230px;" alt="QR Code" />
                    </div>
                    <p style="margin-top:20px; color:#555;">قم بمسح الكود بكاميرا الهاتف للتحقق أو افتح الرابط التالي:</p>
                    <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        res.status(500).send('خطأ في توليد الـ QR');
    }
});

// 3. تشغيل الخادم
app.listen(PORT, () => {
    console.log(`✅ الخادم يعمل الآن على المنفذ: ${PORT}`);
});