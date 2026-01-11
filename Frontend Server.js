<script>
const SHIPPING = 150;

// --------------------
// INPUT ELEMENTS
// --------------------
let inputName, inputPhone, inputEmail, inputAddress, inputNotes;

function initInputs() {
    inputName = document.getElementById("name");
    inputPhone = document.getElementById("phone");
    inputEmail = document.getElementById("email");
    inputAddress = document.getElementById("address");
    inputNotes = document.getElementById("notes");
}

// --------------------
// ORDER REFERENCE GENERATOR (STEP 1)
// --------------------
function generateOrderReference() {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);

    return `KPO-${y}${m}${d}-${rand}`;
}

// --------------------
// CART HELPERS
// --------------------
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function clearCart() {
    localStorage.removeItem("cart");
}

// --------------------
// LOAD CHECKOUT
// --------------------
let ORDER_REF = null;

function loadCheckout() {
    initInputs();
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        window.location.href = "cart.html";
        return;
    }

    ORDER_REF = generateOrderReference();
    const eftRefInput = document.getElementById("eft-ref");
    if (eftRefInput) eftRefInput.textContent = ORDER_REF;

    let subtotal = 0;
    const tbody = document.getElementById("order-items");
    tbody.innerHTML = "";

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>R${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
    });

    document.getElementById("subtotal").textContent = "R" + subtotal.toFixed(2);
    document.getElementById("total").textContent = "R" + (subtotal + SHIPPING).toFixed(2);
}

// --------------------
// BUILD MESSAGE (STEP 2)
// --------------------
function buildMessage(paymentMethod = "Online") {
    const cart = getCart();
    let msg = `🧾 *New Order*\nReference: ${ORDER_REF}\nPayment Method: ${paymentMethod}\n\n`;

    cart.forEach(item => {
        msg += `- ${item.name} x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}\n`;
    });

    msg += `\nTotal (incl shipping): ${document.getElementById("total").textContent}\n`;
    msg += `Name: ${inputName.value}\n`;
    msg += `Phone: ${inputPhone.value}\n`;
    msg += `Email: ${inputEmail.value}\n`;
    msg += `Address: ${inputAddress.value}\n`;
    if (inputNotes.value) msg += `Notes: ${inputNotes.value}\n`;

    return msg;
}

// --------------------
// COMPLETE ORDER
// --------------------
function completeOrder() {
    clearCart();
    document.getElementById("checkout-section").style.display = "none";
    document.getElementById("thank-you").style.display = "block";
}

// --------------------
// SEND EMAIL (STEP 4)
// --------------------
function sendEmailNotification(message, paymentMethod) {
    return fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            orderRef: ORDER_REF,
            paymentMethod,
            toEmail: 'kurnalpiorganics@gmail.com'
        })
    })
    .then(res => {
        if (!res.ok) throw new Error('Email failed');
        return res.json();
    })
    .then(() => console.log(`📧 Email sent (Ref: ${ORDER_REF})`))
    .catch(err => console.error('❌ Email error:', err.message));
}

// --------------------
// CHECKOUT FUNCTIONS (STEP 3)
// --------------------
async function checkoutWhatsApp() {
    const message = buildMessage("WhatsApp");
    window.open(
        `https://wa.me/27615136124?text=${encodeURIComponent(message)}`,
        '_blank'
    );
    await sendEmailNotification(message, "WhatsApp");
    completeOrder();
}

async function checkoutEmail() {
    const message = buildMessage("Email");
    await sendEmailNotification(message, "Email");
    completeOrder();
}

// --------------------
// EFT PAYMENT
// --------------------
function showEFT() {
    const eftBox = document.getElementById("eft-box");
    const eftRefInput = document.getElementById("eft-ref");
    if (!ORDER_REF) ORDER_REF = generateOrderReference();
    if (eftRefInput) eftRefInput.textContent = ORDER_REF;

    eftBox.style.display = "block";
}

async function eftConfirm() {
    const message = buildMessage("EFT");
    await sendEmailNotification(message, "EFT");
    alert(`Thank you! Please use this reference for your EFT payment:\n\n${ORDER_REF}`);
    completeOrder();
}

// --------------------
document.addEventListener("DOMContentLoaded", loadCheckout);
</script>
