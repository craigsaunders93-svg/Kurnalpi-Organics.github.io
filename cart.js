// ========================
// CART SCRIPT
// ========================

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart total in header
function updateCartDisplay() {
    const cart = getCart();
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    const cartTotalElement = document.getElementById("cart-total");
    if (cartTotalElement) {
        cartTotalElement.textContent = "R" + total.toFixed(2);
    }
}

// Add item to cart
function addToCart(name, price, pack = "", quantity = 1) {
    if (!name || isNaN(price) || price < 0 || quantity < 1) {
        console.error("Invalid cart data");
        return;
    }

    let cart = getCart();

    // Check if same product with same pack already exists
    const existingItem = cart.find(item => item.name === name && item.pack === pack);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: name,
            price: price,
            pack: pack,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartDisplay();
    alert(`Added ${quantity} x ${name} to cart!`);
}

// Render cart page items (cart.html)
function renderCartPage() {
    const cart = getCart();
    const container = document.getElementById("cart-container");
    const totalDisplay = document.getElementById("cart-total-display");

    if (!container || !totalDisplay) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
        totalDisplay.textContent = "";
        updateCartDisplay();
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <img src="images/${item.name.toLowerCase().replace(/ /g, "-")}.png" alt="${item.name}">
            <div class="cart-details">
                <h3>${item.name}</h3>
                <p>${item.pack}</p>
                <div class="cart-quantity">
                    <button class="minus">−</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="plus">+</button>
                    <button class="remove">Remove</button>
                </div>
            </div>
            <div class="item-total">R${(item.price * item.quantity).toFixed(2)}</div>
        `;

        const minusBtn = div.querySelector(".minus");
        const plusBtn = div.querySelector(".plus");
        const removeBtn = div.querySelector(".remove");
        const qtyDisplay = div.querySelector(".qty");

        minusBtn.addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(index, 1);
            }
            saveCart(cart);
            renderCartPage();
            updateCartDisplay();
        });

        plusBtn.addEventListener("click", () => {
            item.quantity++;
            saveCart(cart);
            renderCartPage();
            updateCartDisplay();
        });

        removeBtn.addEventListener("click", () => {
            cart.splice(index, 1);
            saveCart(cart);
            renderCartPage();
            updateCartDisplay();
        });

        container.appendChild(div);
    });

    totalDisplay.textContent = "Total: R" + total.toFixed(2);
    updateCartDisplay();
}

// ========================
// HANDLE PRODUCT BUTTONS ON PRODUCTS PAGE
// ========================
document.addEventListener("DOMContentLoaded", () => {
    // Product page quantity + Add to Cart
    document.querySelectorAll(".product-card").forEach(card => {
        const minusBtn = card.querySelector(".qty-btn.minus");
        const plusBtn = card.querySelector(".qty-btn.plus");
        const qtyDisplay = card.querySelector(".qty");
        const addBtn = card.querySelector(".add-to-cart");

        let quantity = 1;

        if (minusBtn && plusBtn && qtyDisplay) {
            minusBtn.addEventListener("click", () => {
                if (quantity > 1) {
                    quantity--;
                    qtyDisplay.textContent = quantity;
                }
            });
            plusBtn.addEventListener("click", () => {
                quantity++;
                qtyDisplay.textContent = quantity;
            });
        }

        if (addBtn) {
            addBtn.addEventListener("click", () => {
                const name = addBtn.dataset.name;
                const price = Number(addBtn.dataset.price);
                const pack = addBtn.dataset.pack || "";

                addToCart(name, price, pack, quantity);

                // reset quantity
                quantity = 1;
                if (qtyDisplay) qtyDisplay.textContent = 1;
            });
        }
    });

    // Initialize header cart total
    updateCartDisplay();

    // If on cart page, render cart
    if (document.getElementById("cart-container")) {
        renderCartPage();
    }
});
