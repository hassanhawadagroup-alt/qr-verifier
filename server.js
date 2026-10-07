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
        jobTitle: "فورمان",
        nationality: "مصر",
        nationalId: "2560347466",
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

// 1. مسار عرض تفاصيل السجل (النموذج)
app.get(['/', '/verify'], (req, res) => {
    const id = req.query.id || '1299';
    const permit = permitsDatabase[id] || permitsDatabase['1299'];

    res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تفاصيل سجل البيانات</title>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: 'Tajawal', sans-serif; 
            background-color: #f8fafc; 
            color: #334155;
            padding: 20px;
          }
          .container { max-width: 650px; margin: 20px auto; }
          .header-title { text-align: center; font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 20px; }
          .card { background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 15px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
          .card-header { background-color: #f1f5f9; padding: 12px 16px; font-size: 15px; font-weight: 700; color: #475569; text-align: center; border-bottom: 1px solid #e2e8f0; }
          .card-body { padding: 16px; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 12px; }
          .grid-2:last-child { margin-bottom: 0; }
          .field-box { background: #fafafa; padding: 10px 12px; border-radius: 6px; border: 1px solid #f1f5f9; }
          .label { font-size: 12px; color: #64748b; display: block; margin-bottom: 4px; }
          .value { font-size: 14px; font-weight: 600; color: #0f172a; }
          @media (max-width: 480px) { .grid-2 { grid-template-columns: 1fr; } }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header-title">تفاصيل سجل البيانات الإلكتروني</h1>
          
          <div class="card">
            <div class="card-header">بيانات الفرد</div>
            <div class="card-body">
              <div class="grid-2">
                <div class="field-box"><span class="label">اسم الشخص:</span><span class="value">${permit.employeeName}</span></div>
                <div class="field-box"><span class="label">المهنة:</span><span class="value">${permit.jobTitle}</span></div>
              </div>
              <div class="grid-2">
                <div class="field-box"><span class="label">رقم الهوية / الإقامة:</span><span class="value">${permit.nationalId}</span></div>
                <div class="field-box"><span class="label">الجنسية:</span><span class="value">${permit.nationality}</span></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">بيانات مقدم الخدمة</div>
            <div class="card-body">
              <div class="grid-2">
                <div class="field-box"><span class="label">المنشأة المقدمة:</span><span class="value">${permit.providerName}</span></div>
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

// 2. مسار عرض بطاقة الـ QR النظيفة الخالية من الشعارات
app.get(['/qr', '/generate-qr'], async (req, res) => {
    const id = req.query.id ||
    // إعادة توجيه أي زائر يدخل الصفحة الرئيسية مباشرة إلى صفحة الـ QR
app.get('/', (req, res) => {
    res.redirect('/qr');
});