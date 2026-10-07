const express = require('express');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ==========================================
// 💾 البيانات الأساسية والاعدادات العامة
// ==========================================
const DEFAULT_ID = "1299";

// 🖼️ الروابط المباشرة الصحيحة للصور (Direct Image Links)
const LOGO_MAIN = "https://i.postimg.cc/gxg7wPtc/logo.png";    // الشعار الرئيسي
const LOGO_BOTTOM_1 = "https://i.postimg.cc/Ln6wmXvg/logo1.png"; // شعار الفوتر الأول
const LOGO_BOTTOM_2 = "https://i.postimg.cc/5jfkm0hT/logo2.png"; // شعار الفوتر الثاني

const permitsDatabase = {
    "1299": {
        id: "1299",
        employeeName: "AHMED NASSER ABDELMONTTALEB ALI",
        status: "نشيط",
        startDate: "26-03-2026",
        endDate: "27-03-2027",
        beneficiaryName: "شركة الريادة الخليجية للمقاولات",
        beneficiaryCode: "7033892717",
        providerName: "نقليات منصور احمد",
        providerCode: "14-8541201"
    }
};

// ==========================================
// 🎨 دوال التنسيق وعرض الصفحات
// ==========================================

function renderVerifyPage(permit) {
    return `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تفاصيل السجل - ${permit.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: 'Tajawal', sans-serif; 
            background-color: #f8fafc; 
            color: #334155;
            padding: 20px;
          }
          .container { max-width: 500px; margin: 20px auto; }
          
          .header-bar {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 20px;
          }
          .top-left-logo {
            max-height: 55px;
            width: auto;
          }

          .card { 
            background: #ffffff; 
            border-radius: 12px; 
            border: 1px solid #e2e8f0; 
            margin-bottom: 20px; 
            overflow: hidden; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.02); 
          }
          .card-header { 
            background-color: #ffffff; 
            padding: 16px 20px; 
            font-size: 16px; 
            font-weight: 700; 
            color: #475569; 
            border-bottom: 1px solid #f1f5f9; 
          }
          .card-body { padding: 20px; }
          .field-box { 
            margin-bottom: 16px; 
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .field-box:last-child { margin-bottom: 0; }
          .label { font-size: 13px; color: #94a3b8; display: block; margin-bottom: 6px; }
          .value { 
            font-size: 14px; 
            font-weight: 600; 
            color: #1e293b;
          }
          .status-badge {
            background-color: #f1f5f9; 
            padding: 6px 14px; 
            border-radius: 6px; 
            display: inline-block;
            border: 1px solid #e2e8f0;
          }

          .footer-section {
            text-align: center;
            margin-top: 30px;
            padding: 20px 10px;
            color: #64748b;
            font-size: 14px;
            line-height: 1.8;
          }
          .center-logo {
            max-height: 70px;
            width: auto;
            margin-bottom: 15px;
          }
          .footer-section p { margin-bottom: 6px; }
          
          .bottom-logos-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
          }
          .bottom-logo {
            max-height: 45px;
            width: auto;
          }

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
        </style>
      </head>
      <body>
        <div class="container">
          
          <!-- الشعار أعلى اليسار -->
          <div class="header-bar">
            <img src="${LOGO_MAIN}" alt="لوجو الشركة" class="top-left-logo" />
          </div>

          <!-- معلومات التصريح -->
          <div class="card">
            <div class="card-header">معلومات التصريح</div>
            <div class="card-body">
              <div class="field-box"><span class="label">اسم الشخص:</span><span class="value">${permit.employeeName}</span></div>
              <div class="field-box"><span class="label">حالة التصريح:</span><span class="value status-badge">${permit.status}</span></div>
              <div class="field-box"><span class="label">تاريخ بداية التصريح:</span><span class="value">${permit.startDate}</span></div>
              <div class="field-box"><span class="label">تاريخ إنتهاء التصريح:</span><span class="value">${permit.endDate}</span></div>
            </div>
          </div>

          <!-- المنشأة المستفيدة -->
          <div class="card">
            <div class="card-header">المنشأة المستفيدة</div>
            <div class="card-body">
              <div class="field-box"><span class="label">اسم المنشأة:</span><span class="value">${permit.beneficiaryName}</span></div>
              <div class="field-box"><span class="label">رقم المنشأة:</span><span class="value">${permit.beneficiaryCode}</span></div>
            </div>
          </div>

          <!-- شركة الاستقدام -->
          <div class="card">
            <div class="card-header">شركة الإستقدام</div>
            <div class="card-body">
              <div class="field-box"><span class="label">اسم المنشأة:</span><span class="value">${permit.providerName}</span></div>
              <div class="field-box"><span class="label">رقم المنشأة:</span><span class="value">${permit.providerCode}</span></div>
            </div>
          </div>

          <!-- الفوتر والشعارات -->
          <div class="footer-section">
            <div>
              <img src="${LOGO_MAIN}" alt="لوجو الشركة" class="center-logo" />
            </div>
            
            <p>أهلاً بك في شركتنا</p>
            <p>إدارة الموارد البشرية ترحب بك</p>
            <p>برجاء مراجعة لائحة العمل لعام 1447</p>

            <div>
              <a href="#" class="lang-btn">
                <span>English</span>
                <span>🌐</span>
              </a>
            </div>

            <div class="bottom-logos-container">
              <img src="${LOGO_BOTTOM_1}" alt="لوجو الشركة 1" class="bottom-logo" />
              <img src="${LOGO_BOTTOM_2}" alt="لوجو الشركة 2" class="bottom-logo" />
            </div>
          </div>

        </div>
      </body>
      </html>
    `;
}

function renderQRPage(qrImageData) {
    return `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">