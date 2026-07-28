import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Function to send SMS notification via PhilSMS v3 API
async function sendSMSNotification(selectedDate, timeSlot, activityType, film) {
  const apiToken = process.env.PHILSMS_API_TOKEN;
  const phoneEnv = process.env.RECIPIENT_PHONE || '09568964613';
  
  if (!apiToken || apiToken === 'your_philsms_api_token_here') {
    console.log('💡 [SMS Notice] PHILSMS_API_TOKEN not set in .env yet. To send real SMS, paste your token from app.philsms.com in .env!');
    return;
  }

  // Support comma-separated phone numbers (e.g., "09568964613,09568964613")
  const phoneList = phoneEnv.split(',').map(p => p.trim()).filter(Boolean);

  const isEatOut = activityType === 'eat-out' || film === 'Eat Out' || (typeof timeSlot === 'string' && (timeSlot.includes('Dinner') || timeSlot.includes('Meal') || timeSlot.includes('Merienda')));
  const messageText = isEatOut
    ? `Hi! This is Kit. Our eat out schedule is officially confirmed for ${selectedDate} (${timeSlot})! Can't wait to celebrate our hangout with you. See you there! 🍕🎉`
    : `Hi! This is Kit. Your Spider-Man movie hangout schedule is officially confirmed for ${selectedDate} (${timeSlot})! Can't wait to celebrate our hangout with you. See you at the movies! 🍿🎉`;

  const smsPromises = phoneList.map(async (rawPhone) => {
    let formattedPhone = rawPhone;
    if (formattedPhone.startsWith('09')) {
      formattedPhone = '63' + formattedPhone.slice(1);
    }

    try {
      console.log(`📱 [SMS API] Sending ${isEatOut ? 'dinner' : 'movie'} confirmation SMS to ${formattedPhone} via PhilSMS...`);
      const response = await fetch('https://dashboard.philsms.com/api/v3/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          recipient: formattedPhone,
          sender_id: 'PhilSMS',
          type: 'plain',
          message: messageText
        })
      });

      const data = await response.json();
      console.log(`✅ [SMS API] PhilSMS Response for ${formattedPhone}:`, data);
    } catch (err) {
      console.error(`⚠️ [SMS API] Failed to send SMS to ${formattedPhone}:`, err.message);
    }
  });

  await Promise.all(smsPromises);
}

// POST endpoint to save confirmation into PostgreSQL & trigger PhilSMS
app.post('/api/save-schedule', async (req, res) => {
  try {
    const { occasion, film, date, timeSlot, status, activityType } = req.body;
    console.log('📥 [Backend API] Received schedule confirmation:', req.body);

    const query = `
      INSERT INTO hangout_schedules (occasion, film, selected_date, time_slot, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      occasion,
      film,
      date,
      timeSlot,
      status || 'confirmed'
    ];

    const result = await pool.query(query, values);
    console.log('💾 [Backend DB] Saved record to Postgres:', result.rows[0]);
    
    // Trigger SMS notification synchronously so Vercel doesn't freeze the function
    await sendSMSNotification(date, timeSlot, activityType, film);

    res.status(201).json({ success: true, data: result.rows[0], message: 'Schedule saved to PostgreSQL database & SMS triggered!' });
  } catch (err) {
    console.error('❌ [Backend API] Postgres Error:', err.message);
    
    // Return an error so the frontend knows it failed, and do NOT send a false confirmation SMS!
    res.status(500).json({ success: false, message: 'Failed to save schedule to database. SMS aborted.' });
  }
});

// GET endpoint to view all saved hangout schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hangout_schedules ORDER BY created_at DESC');
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 [Spiderman Backend] Server running on http://localhost:${PORT}`);
  });
}

export default app;
