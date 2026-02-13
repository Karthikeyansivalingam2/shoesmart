document.addEventListener('DOMContentLoaded', () => {
    loadCartSummary();

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
});

function loadCartSummary() {
    const cart = JSON.parse(localStorage.getItem('footcap-cart')) || [];
    const container = document.getElementById('cart-items-container');
    const totalElem = document.getElementById('cart-total');

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        totalElem.innerText = '$0.00';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-summary-item" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <div style="flex: 1;">
                    <strong>${item.title}</strong>
                    <div style="font-size: 0.9rem; color: #555;">
                        ₹${item.price} x ${item.quantity}
                    </div>
                </div>
                <div style="text-align: right;">
                    <button onclick="removeFromCart(${index})" style="color: var(--bittersweet); background: none; border: none; font-size: 1.2rem; cursor: pointer; margin-left: 10px;">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                    <div style="font-weight: bold;">₹${itemTotal.toFixed(2)}</div>
                </div>
            </div>
        `;
    }).join('');

    if (totalElem) totalElem.innerText = '₹' + total.toFixed(2);
}

window.removeFromCart = (index) => {
    let cart = JSON.parse(localStorage.getItem('footcap-cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('footcap-cart', JSON.stringify(cart));
    loadCartSummary();
    // Also update header UI if script.js function is available
    if (typeof updateCartUI === 'function') updateCartUI();
};

async function handleCheckout(e) {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem('footcap-cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderData = {
        name,
        email,
        address,
        items: cart,
        total,
        paymentStatus: 'Pending',
        date: new Date().toISOString()
    };

    // Save temporary order data and redirect to payment gateway
    localStorage.setItem('tempOrder', JSON.stringify(orderData));
    window.location.href = 'payment.html';
}
