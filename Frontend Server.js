function checkoutWhatsApp() {
  const message = buildMessage(); // Build order message

  // Send email to backend (non-blocking)
  sendEmailNotification(message);

  // Open WhatsApp with encoded message
  window.open(
    `https://wa.me/27615136124?text=${encodeURIComponent(message)}`,
    '_blank'
  );

  // Complete order (clear cart, redirect, etc.)
  completeOrder();
}

// Send email notification to backend
function sendEmailNotification(message) {
  fetch('http://localhost:5000/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      toEmail: 'kurnalpiorganics@gmail.com',
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      return response.json();
    })
    .then((data) => {
      console.log('📧 Email sent successfully:', data);
    })
    .catch((error) => {
      console.error('❌ Error sending email:', error.message);
    });
}
