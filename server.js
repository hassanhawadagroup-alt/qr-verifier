const express = require('express');
const QRCode = require('qrcode');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 💾 قاعدة بيانات التصاريح - يمكنك إضافة أو تعديل البيانات هنا بسهولة
const permitsDatabase = {
    "1299": {
        id: "1299",
        employeeName: "AHMED NASSER ABDELMONTTALEB ALI",
        status: "نشط",
        startDate: "2026-09-28",
        endDate: "2027-03-27",
        facilityName: "شركة الريادة الخليجية للمقاولات",
        facilityId: "7033892717"
    }
};

// 1. صفحة عرض التحقق من تصريح أجير
app.get('/verify', (req, res) => {
    const id = req.query.id || '1299';
    const permit = permitsDatabase[id];

    if (!permit) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head><meta charset="UTF-8"><title>التصريح غير موجود</title></head>
            <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
                <h2>⚠️️ التصريح رقم (${id}) غير موجود أو ملغى.</h2>
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
        <title>تصريح أجير لحلول الموارد البشرية</title>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: 'Tajawal', sans-serif; 
            background-color: #f8fafc; 
            margin: 0; 
            padding: 0; 
            color: #1e293b;
          }
          .top-bar {
            padding: 20px 40px;
            background-color: #ffffff;
            border-bottom: 1px solid #f1f5f9;
          }
          .logo-text {
            color: #0d233a;
            font-weight: 700;
            font-size: 24px;
            letter-spacing: -0.5px;
          }
          .logo-sub {
            font-size: 10px;
            color: #00a884;
            display: block;
            margin-top: -5px;
          }
          .main-title {
            text-align: center;
            margin: 40px 0 30px;
            color: #0f172a;
            font-size: 22px;
            font-weight: 700;
            line-height: 1.5;
          }
          .container {
            max-width: 460px;
            margin: 0 auto 50px;
            padding: 0 15px;
          }
          .card {
            background: #ffffff;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            border: 1px solid #f1f5f9;
          }
          .card-title {
            text-align: center;
            color: #64748b;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 20px;
            border-bottom: 1px solid #f8fafc;
            padding-bottom: 12px;
          }
          .field-group {
            margin-bottom: 16px;
            text-align: center;
          }
          .field-group:last-child {
            margin-bottom: 0;
          }
          .label {
            font-size: 13px;
            color: #94a3b8;
            margin-bottom: 6px;
            display: block;
          }
          .value {
            font-size: 15px;
            color: #1e293b;
            font-weight: 500;
            direction: ltr;
            display: inline-block;
          }
          .value-rtl {
            font-size: 15px;
            color: #1e293b;
            font-weight: 500;
          }
          .badge-active {
            background-color: #f0fdf4;
            color: #166534;
            border: 1px solid #bbf7d0;
            padding: 4px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            display: inline-block;
          }
          .help-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 42px;
            height: 42px;
            background-color: #1d3557;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            cursor: pointer;
          }
        </style>
      </head>
      <body>

        <div class="top-bar">
          <div class="logo-text">أجير<span class="logo-sub">AJEER</span></div>
        </div>

        <h2 class="main-title">تصريح أجير لحلول الموارد<br>البشرية</h2>

        <div class="container">
          
          <!-- معلومات التصريح -->
          <div class="card">
            <div class="card-title">معلومات التصريح</div>
            
            <div class="field-group">
              <span class="label">اسم الموظف:</span>
              <span class="value">${permit.employeeName}</span>
            </div>

            <div class="field-group">
              <span class="label">حالة التصريح:</span>
              <div><span class="badge-active">${permit.status}</span></div>
            </div>

            <div class="field-group">
              <span class="label">تاريخ بداية التصريح:</span>
              <span class="value">${permit.startDate}</span>
            </div>

            <div class="field-group">
              <span class="label">تاريخ إنتهاء التصريح:</span>
              <span class="value">${permit.endDate}</span>
            </div>
          </div>

          <!-- المنشأة المستفيدة -->
          <div class="card">
            <div class="card-title">المنشأة المستفيدة</div>

            <div class="field-group">
              <span class="label">اسم المنشأة:</span>
              <span class="value-rtl">${permit.facilityName}</span>
            </div>

            <div class="field-group">
              <span class="label">رقم المنشأة:</span>
              <span class="value">${permit.facilityId}</span>
            </div>
          </div>

        </div>

        <div class="help-btn">؟</div>

      </body>
      </html>
    `);
});

// 2. صفحة توليد رمز الـ QR
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
                <title>توليد رمز QR - أجير</title>
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 40px 20px; background-color: #f8fafc; }
                    .card { background: white; max-width: 400px; margin: 0 auto; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                    img { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; background: #fff; }
                    a { color: #0284c7; word-break: break-all; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h3>رمز QR التصريح رقم (${id})</h3>
                    <div style="margin: 20px 0;">
                        <img src="${qrImage}" style="width: 220px; height: 220px;" alt="QR Code" />
                    </div>
                    <p style="color:#64748b; font-size:14px;">امسح الكود بكاميرا الهاتف أو افتح الرابط:</p>
                    <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        res.status(500).send('خطأ في توليد الـ QR');
    }
});

app.listen(PORT, () => {
    console.log(`✅ الخادم يعمل على المنفذ: ${PORT}`);
});