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

// ========================
// HANDLE PRODUCT BUTTONS
// ========================
document.addEventListener("DOMContentLoaded", () => {
    // Select all product cards
    document.querySelectorAll(".product-card").forEach(card => {
        const minusBtn = card.querySelector(".minus");
        const plusBtn = card.querySelector(".plus");
        const qtyDisplay = card.querySelector(".qty");
        const addBtn = card.querySelector(".add-to-cart");

        let quantity = 1;

        // Quantity controls
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

        // Add to cart button
        if (addBtn) {
            addBtn.addEventListener("click", () => {
                const name = addBtn.dataset.name;
                const price = Number(addBtn.dataset.price);
                const pack = addBtn.dataset.pack || "";

                addToCart(name, price, pack, quantity);

                // Reset quantity to 1 after adding
                quantity = 1;
                if (qtyDisplay) qtyDisplay.textContent = 1;
            });
        }
    });

    // Initialize cart total
    updateCartDisplay();
});
