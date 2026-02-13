// Search Toggle logic
const searchBtn = document.querySelector("button.nav-action-btn:has(ion-icon[name='search-outline'])");
if (searchBtn) {
  searchBtn.onclick = () => {
    const searchTerm = prompt("Enter text to search products:");
    if (searchTerm) {
      window.location.href = `shop.html?q=${encodeURIComponent(searchTerm)}`;
    }
  };
}


const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");

const navElems = [overlay, navOpenBtn, navCloseBtn];

for (let i = 0; i < navElems.length; i++) {
  navElems[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}



/**
 * header & go top btn active on page scroll
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 80) {
    header.classList.add("active");
    if (goTopBtn) goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    if (goTopBtn) goTopBtn.classList.remove("active");
  }
});


/**
 * Product Filtering (Client Side for static items - dynamic items handled by products-renderer)
 */
const filterBtns = document.querySelectorAll("[data-filter]");
const productItems = document.querySelectorAll("[data-category]");

filterBtns.forEach(btn => {
  btn.addEventListener("click", function () {
    filterBtns.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    const filterValue = this.dataset.filter;

    // Filter dynamic items if products-renderer exposed simple styling
    // But since dynamic items are re-rendered, let's keep this as is for Index Page static placeholders if any
  });
});


/**
 * Shopping Cart Functionality
 */
let cart = [];
let wishlist = [];

// Initialize cart from localStorage if available
if (localStorage.getItem('footcap-cart')) {
  cart = JSON.parse(localStorage.getItem('footcap-cart'));
  updateCartUI();
}
// Initialize wishlist
if (localStorage.getItem('footcap-wishlist')) {
  wishlist = JSON.parse(localStorage.getItem('footcap-wishlist'));
  updateWishlistUI();
}

// Event delegation for Add to Cart buttons
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".add-to-cart-btn");
  if (!btn) return;

  const id = btn.dataset.id;
  const title = btn.dataset.title;
  const price = parseFloat(btn.dataset.price);

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, title, price, quantity: 1 });
  }

  localStorage.setItem('footcap-cart', JSON.stringify(cart));
  updateCartUI();

  // Visual feedback
  const originalContent = btn.innerHTML;
  btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
  setTimeout(() => {
    btn.innerHTML = '<ion-icon name="cart-outline"></ion-icon>';
  }, 1500);
});

// Event delegation for Wishlist (Heart) buttons
document.addEventListener("click", function (e) {
  const wishBtn = e.target.closest("button.card-action-btn:has(ion-icon[name='heart-outline'])");
  if (!wishBtn) return;

  // Find card context
  const card = wishBtn.closest('.product-card');
  if (!card) return;

  // Try to extract data. Some fields might be in data attributes of the cart btn sibling
  const cartBtn = card.querySelector('.add-to-cart-btn');
  if (!cartBtn) return; // Need cart btn for ID

  const id = cartBtn.dataset.id;
  const title = cartBtn.dataset.title;
  const price = cartBtn.dataset.price;
  const image = card.querySelector('img').src;

  const exists = wishlist.find(item => item.id === id);
  if (!exists) {
    wishlist.push({ id, title, price, image });
    localStorage.setItem('footcap-wishlist', JSON.stringify(wishlist));
    updateWishlistUI();

    // Visual feedback
    wishBtn.style.color = 'var(--bittersweet)';
    alert('Added to Wishlist');
  } else {
    alert('Already in Wishlist');
  }
});

function updateCartUI() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const cartBtn = document.querySelector("button.nav-action-btn:has(ion-icon[name='bag-outline'])");
  if (cartBtn) {
    const badge = cartBtn.querySelector(".nav-action-badge");
    const totalText = cartBtn.querySelector(".nav-action-text strong");

    if (badge) {
      badge.innerText = totalItems;
      badge.setAttribute("value", totalItems);
    }
    if (totalText) {
      totalText.innerText = "$" + totalPrice.toFixed(2);
    }

    cartBtn.onclick = () => {
      window.location.href = 'checkout.html';
    };
  }
}

function updateWishlistUI() {
  const count = wishlist.length;
  const wishBtn = document.querySelector("button.nav-action-btn:has(ion-icon[name='heart-outline'])");
  if (wishBtn) {
    const badge = wishBtn.querySelector(".nav-action-badge");
    if (badge) {
      badge.innerText = count;
      badge.setAttribute("value", count);
    }
    wishBtn.onclick = () => {
      window.location.href = 'wishlist.html';
    };
  }
}

// Update Login Button Logic
// Update Login Button Logic to Amazon-style Dropdown
document.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.querySelector("a.nav-action-btn[href='login.html']");
  if (loginLink) {
    const userStr = localStorage.getItem('footcap-user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Change generic Login text/icon to User's Name
      loginLink.removeAttribute('href'); // disable link mostly, handled by click or hover
      loginLink.style.cursor = 'pointer';

      // Create Dropdown Structure
      const parentLi = loginLink.closest('li');
      if (parentLi) {
        parentLi.style.position = 'relative'; // Ensure positioning context

        // Update Badge/Text
        const icon = loginLink.querySelector('ion-icon');
        const text = loginLink.querySelector('.nav-action-text');
        if (icon) icon.name = 'person-circle-outline';
        if (text) text.innerHTML = `Hi, ${user.name} <ion-icon name="caret-down-outline" style="font-size: 0.8em; vertical-align: middle;"></ion-icon>`;

        // Create Dropdown Menu
        const dropdown = document.createElement('ul');
        dropdown.className = 'user-dropdown';
        dropdown.style.cssText = `
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: white;
                    border: 1px solid #eee;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    border-radius: 5px;
                    width: 150px;
                    display: none;
                    z-index: 1000;
                    padding: 10px 0;
                `;

        dropdown.innerHTML = `
                    <li><a href="profile.html" style="display:block; padding:8px 15px; color:#333; transition:0.2s;">My Orders</a></li>
                    <li><a href="wishlist.html" style="display:block; padding:8px 15px; color:#333; transition:0.2s;">Wishlist</a></li>
                    <li><a href="#" id="logout-btn" style="display:block; padding:8px 15px; color:var(--bittersweet); transition:0.2s;">Logout</a></li>
                `;

        // Append to parent
        parentLi.appendChild(dropdown);

        // Event Listeners for Hover
        parentLi.addEventListener('mouseenter', () => dropdown.style.display = 'block');
        parentLi.addEventListener('mouseleave', () => dropdown.style.display = 'none');

        // Logout Logic
        document.getElementById('logout-btn').addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('footcap-user');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
          }
        });
      }
    }
  }
});