function checkoutWhatsApp() {
    const message = buildMessage();  // Get the order details message
    sendEmailNotification(message); // Send email to backend
    window.open(`https://wa.me/27615136124?text=${message}`, "_blank");  // Open WhatsApp with the order message
    completeOrder();
}

// Send email notification to backend
function sendEmailNotification(message) {
    const orderDetails = {
        message: message,
        toEmail: 'kurnalpiorganics@gmail.com',  // Target email address
    };

    // Send request to backend
    fetch('http://localhost:5000/send-email', { // Make sure to use the correct backend URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Email sent successfully:', data);
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });
}

