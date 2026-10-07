const express = require('express');
const QRCode = require('qrcode');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 💾 قاعدة البيانات المحلية للسجلات
const permitsDatabase = {
    "1299": {
        id: "1299",
        employeeName: "AHMED NASSER ABDELMONTTALEB ALI",
        jobTitle: "نشيط",
        nationality: "27-03-2027",
        nationalId: "26-03-2026",
        providerName: "نقليات منصور احمد",
        providerCode: "14-8541201",
        beneficiaryName: "شركة الريادة الخليجية للمقاولات",
        beneficiaryCode: "7033892717",
        contractType: "عقد خدمات",
        startDate: "2026-09-28",
        endDate: "2027-03-27",
        workLocation: "المملكة العربية السعودية"
    }
};

// 1. التوجيه التلقائي للمسار الرئيسي إلى صفحة الـ QR
app.get('/', (req, res) => {
    res.redirect('/qr');
});

// 2. مسار عرض تفاصيل السجل (يفتح تلقائياً عند مسح الـ QR)
app.get('/verify', (req, res) => {
    const id = req.query.id || '1299';
    const permit = permitsDatabase[id] || permitsDatabase['1299'];

    res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تصريح أجير لحلول الموارد
البشرية - ${permit.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: 'Tajawal', sans-serif; 
            background-color: #f8fafc; 
            color: #334155;
            padding: 20px;
          }
          ..footer-section {
            text-align: center;
            margin-top: 30px;
            padding: 20px 10px;
            color: #64748b;
            font-size: 14px;
            line-height: 1.8;
          }
          .footer-section p { margin-bottom: 6px; }
          .lang-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 15px;
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
          }
            <div class="card-header">معلومات التصريح</div>
            <div class="card-body">
              <div class="grid-2">
                <div class="field-box"><span class="label">اسم الشخص:</span><span class="value">${permit.employeeName}</span></div>
                <div class="field-box"><span class="label">حالة التصريح:</span><span class="value">${permit.jobTitle}</span></div>
              </div>
              <div class="grid-2">
                <div class="field-box"><span class="label">تاريخ بداية التصريح::</span><span class="value">${permit.nationalId}</span></div>
                <div class="field-box"><span class="label">تاريخ إنتهاء التصريح::</span><span class="value">${permit.nationality}</span></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">شركة الإستقدام</div>
            <div class="card-body">
              <div class="grid-2">
                <div class="field-box"><span class="label">اسم المنشأة::</span><span class="value">${permit.providerName}</span></div>
                <div class="field-box"><span class="label">رقم المنشأة:</span><span class="value">${permit.providerCode}</span></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">بيانات المستفيد من الخدمة</div>
            <div class="card-body">
              <div class="grid-2">
                <div class="field-box"><span class="label">المنشأة المستفيدة:</span><span class="value">${permit.beneficiaryName}</span></div>
                <div class="field-box"><span class="label">رقم المنشأة:</span><span class="value">${permit.beneficiaryCode}</span></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">بيانات الصلاحية والتاريخ</div>
            <div class="card-body">
              <div class="grid-2">
                <div class="field-box"><span class="label">نوع العقد:</span><span class="value">${permit.contractType}</span></div>
                <div class="field-box"><span class="label">مكان العمل:</span><span class="value">${permit.workLocation}</span></div>
              </div>
              <div class="grid-2">
                <div class="field-box"><span class="label">تاريخ بداية العقد:</span><span class="value">${permit.startDate}</span></div>
                <div class="field-box"><span class="label">تاريخ نهاية العقد:</span><span class="value">${permit.endDate}</span></div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
});

// 3. مسار توليد بطاقة رمز الـ QR لاستخراجها واستخدامها في المستندات
app.get(['/qr', '/generate-qr'], async (req, res) => {
    const id = req.query.id || '1299';
    <!-- النص المضاف واللغة -->
          <div class="footer-section">
            <p>أهلاً بك في شركتنا</p>
            <p>إدارة الموارد البشرية ترحب بك</p>
            <p>برجاء مراجعة لائحة العمل لعام 1447</p>
            <div>
              <a href="#" class="lang-btn">
                <span>English</span>
                <span>🌐</span>
              </a>
            </div>
          </div>
    // التوجيه يتم حصراً إلى خادم مشروعك على Render
    const targetUrl = `https://qr-verifier-mwcx.onrender.com/verify?id=${id}`;

    try {
        const qrImageData = await QRCode.toDataURL(targetUrl, {
            width: 280,
            margin: 2,
            color: {
                dark: '#0f172a',
                light: '#ffffff'
            }
        });

        res.send(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>رمز الاستجابة السريعة</title>
                <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@500;700&display=swap" rel="stylesheet">
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { 
                        font-family: 'Tajawal', sans-serif; 
                        background-color: #f1f5f9; 
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        padding: 20px;
                    }
                    .qr-card { 
                        background: #ffffff; 
                        padding: 32px 24px; 
                        border-radius: 12px; 
                        border: 1px solid #e2e8f0; 
                        text-align: center;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                        max-width: 360px;
                        width: 100%;
                    }
                    .qr-wrapper {
                        background: #ffffff;
                        padding: 12px;
                        border-radius: 8px;
                        border: 1px solid #cbd5e1;
                        display: inline-block;
                    }
                    .qr-wrapper img {
                        display: block;
                        max-width: 100%;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                <div class="qr-card">
                    <div class="qr-wrapper">
                        <img src="${qrImageData}" alt="QR Code" />
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        res.status(500).send('حدث خطأ أثناء توليد رمز الـ QR');
    }
});

app.listen(PORT, () => {
    console.log(`✅ الخادم يعمل بنجاح على المنفذ: ${PORT}`);
});