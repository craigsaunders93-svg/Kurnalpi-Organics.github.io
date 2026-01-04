let cartTotal = localStorage.getItem('cartTotal') ? parseFloat(localStorage.getItem('cartTotal')) : 0;

function updateCartDisplay() {
    const cartTotalElement = document.getElementById('cart-total');
    if(cartTotalElement) {
        cartTotalElement.textContent = `R${cartTotal.toFixed(2)}`;
    }
}

function addToCart(price) {
    cartTotal += price;
    localStorage.setItem('cartTotal', cartTotal);
    updateCartDisplay();
    alert(`Added to cart! Total: R${cartTotal.toFixed(2)}`);
}

window.onload = updateCartDisplay;
