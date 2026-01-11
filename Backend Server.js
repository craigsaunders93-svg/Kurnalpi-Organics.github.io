const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer transport (Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kurnalpiorganics@gmail.com',
    pass: 'YOUR_NEW_APP_PASSWORD_NO_SPACES',
  },
});

// Verify Gmail connection
transporter.verify((error) => {
  if (error) {
    console.error('Gmail connection error:', error);
  } else {
    console.log('✅ Gmail is ready to send emails');
  }
});

// Send email route
app.post('/send-email', async (req, res) => {
  try {
    const { message, toEmail } = req.body;

    if (!message || !toEmail) {
      return res.status(400).json({ error: 'Missing message or toEmail' });
    }

    const mailOptions = {
      from: '"Kurnalpi Organics" <kurnalpiorganics@gmail.com>',
      to: toEmail,
      subject: 'New Order from Kurnalpi Organics',
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.response);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
