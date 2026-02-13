document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.querySelector(".product-list");

  if (!productList) return;

  try {
    const response = await fetch('/api/products');
    let products = await response.json();

    // Search Filter
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');

    if (q) {
      const lowerQ = q.toLowerCase();
      products = products.filter(p =>
        (p.title && p.title.toLowerCase().includes(lowerQ)) ||
        (p.category && p.category.toLowerCase().includes(lowerQ))
      );
    }

    // Clear existing static content if any (though we will remove it in HTML too)
    productList.innerHTML = '';

    if (products.length === 0) {
      productList.innerHTML = `<p style="text-align: center; width: 100%;">No products found matching "${q || ''}".</p>`;
      return;
    }

    productList.innerHTML = products.map(product => `
      <li class="product-item">
        <div class="product-card" tabindex="0">
          <figure class="card-banner">
            <a href="product-details.html?id=${product.id}" style="display: block; width: 100%; height: 100%;">
              <img src="${product.image}" width="312" height="350" loading="lazy"
                alt="${product.title}" class="image-contain">
            </a>
            ${product.badge ? `<div class="card-badge">${product.badge}</div>` : ''}

            <ul class="card-action-list">
              <li class="card-action-item">
                <button class="card-action-btn add-to-cart-btn" data-id="${product.id}"
                  data-price="${product.price}" data-title="${product.title}">
                  <ion-icon name="cart-outline"></ion-icon>
                </button>
                <div class="card-action-tooltip">Add to Cart</div>
              </li>
              <li class="card-action-item">
                <button class="card-action-btn">
                  <ion-icon name="heart-outline"></ion-icon>
                </button>
                <div class="card-action-tooltip">Add to Whishlist</div>
              </li>
              <li class="card-action-item">
                <button class="card-action-btn">
                  <ion-icon name="eye-outline"></ion-icon>
                </button>
                <div class="card-action-tooltip">Quick View</div>
              </li>
              <li class="card-action-item">
                <button class="card-action-btn">
                  <ion-icon name="repeat-outline"></ion-icon>
                </button>
                <div class="card-action-tooltip">Compare</div>
              </li>
            </ul>
          </figure>
          <div class="card-content">
            <div class="card-cat">
                ${product.category ? product.category.split(' / ').map(c => `<a href="#" class="card-cat-link">${c}</a>`).join(' / ') : '<a href="#" class="card-cat-link">Men</a> / <a href="#" class="card-cat-link">Sports</a>'}
            </div>
            <h3 class="h3 card-title">
              <a href="product-details.html?id=${product.id}" class="product-link">${product.title}</a>
            </h3>
            <data class="card-price" value="${product.price}">$${product.price}
              ${product.oldPrice ? `<del>$${product.oldPrice}</del>` : ''}
            </data>
          </div>
        </div>
      </li>
    `).join('');

    // Trigger translation update if available
    if (window.updateLanguage) {
      window.updateLanguage(localStorage.getItem('footcap-lang') || 'en');
    }

  } catch (error) {
    console.error('Error loading products:', error);
    productList.innerHTML = '<p>Failed to load products.</p>';
  }
});
