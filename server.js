const express = require('express');
const QRCode = require('qrcode');
const app = express();
const PORT = 3000;

// قاعدة بيانات وهمية تجريبية للتصاريح
const permits = {
    "1299": {
        permitNumber: "1299",
        establishment: "شركة الحلول المتقدمة للمقاولات",
        workerName: "أحمد محمد علي",
        idNumber: "2498765432",
        profession: "مهندس مدني",
        status: "نشط",
        expiryDate: "2027-12-31"
    },
    "1300": {
        permitNumber: "1300",
        establishment: "مؤسسة الأفق للخدمات",
        workerName: "خالد عبد الله",
        idNumber: "2311223344",
        profession: "فني كهرباء",
        status: "منتهي",
        expiryDate: "2025-01-15"
    }
};

// 1. صفحة التحقق عند فتح الرابط المربوط بالـ QR
app.get('/verify', (req, res) => {
    const id = req.query.id;
    const permit = permits[id];

    if (!permit) {
        return res.send(`
            <html dir="rtl" lang="ar">
            <head><meta charset="UTF-8"><title>تنبيه</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h2 style="color: red;">⚠️ التصريح غير موجود أو غير صحيح!</h2>
            </body>
            </html>
        `);
    }

    const statusColor = permit.status === 'نشط' ? '#198754' : '#dc3545';

    res.send(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تفاصيل تصريح العمل</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
                .card { max-width: 500px; margin: 30px auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); padding: 25px; }
                .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px; }
                .status { display: inline-block; padding: 6px 16px; color: white; background-color: ${statusColor}; border-radius: 20px; font-weight: bold; }
                .row { display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px dashed #eee; }
                .label { color: #666; font-weight: bold; }
                .value { color: #222; }
                .btn { display: block; width: 100%; text-align: center; background: #0d6efd; color: white; padding: 12px; border: none; border-radius: 6px; margin-top: 20px; cursor: pointer; text-decoration: none; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <h2>منصة التحقق الرقمي</h2>
                    <span class="status">الحالة: ${permit.status}</span>
                </div>
                <div class="row"><span class="label">رقم التصريح:</span><span class="value">${permit.permitNumber}</span></div>
                <div class="row"><span class="label">اسم المنشأة:</span><span class="value">${permit.establishment}</span></div>
                <div class="row"><span class="label">اسم العامل:</span><span class="value">${permit.workerName}</span></div>
                <div class="row"><span class="label">رقم الهوية / الإقامة:</span><span class="value">${permit.idNumber}</span></div>
                <div class="row"><span class="label">المهنة:</span><span class="value">${permit.profession}</span></div>
                <div class="row"><span class="label">تاريخ الانتهاء:</span><span class="value">${permit.expiryDate}</span></div>
                <button class="btn" onclick="window.print()">طباعة التصريح</button>
            </div>
        </body>
        </html>
    `);
});

// 2. رابط توليد الـ QR لأي تصريح
app.get('/generate-qr', async (req, res) => {
    const verifyUrl = `http://localhost:${PORT}/verify?id=${id}`;
const verifyUrl = `https://qr-verifier-mmcx.onrender.com/verify?id=${id}`;

    const verifyUrl = `http://localhost:${PORT}/verify?id=${id}`;
    
    try {
        const qrImage = await QRCode.toDataURL(verifyUrl);
        res.send(`
            <html dir="rtl" lang="ar">
            <head><meta charset="UTF-8"><title>توليد QR</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h3>رمز QR الخاص بالتصريح رقم (${id}):</h3>
                <img src="${qrImage}" style="width: 250px; height: 250px; border: 1px solid #ccc; padding: 10px; border-radius: 8px;" />
                <p>قم بمسح الكود أعلاه بكاميرا الهاتف أو اضغط على الرابط:</p>
                <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
            </body>
            </html>
        `);
    } catch (err) {
        res.status(500).send('خطأ في توليد الـ QR');
    }
});

app.listen(PORT, () => {
    console.log(`✅ الخادم يعمل الآن على الرابط: http://localhost:${PORT}`);
    console.log(`🔗 لتوليد QR افتح: http://localhost:${PORT}/generate-qr?id=1299`);
});
