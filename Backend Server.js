require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Nodemailer transport using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error('Gmail connection error:', error);
  else console.log('✅ Gmail ready to send emails');
});

app.post('/send-email', async (req, res) => {
  try {
    const { message, toEmail, orderRef, paymentMethod } = req.body;
    if (!message || !toEmail || !orderRef)
      return res.status(400).json({ error: 'Missing message, toEmail, or orderRef' });

    const mailOptions = {
      from: `"Kurnalpi Organics" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `New Order: ${orderRef} (${paymentMethod || 'Online'})`,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Order email sent: ${orderRef}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
