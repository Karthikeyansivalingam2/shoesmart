document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        document.querySelector('.product-details').innerHTML = "<h1>Product not found (No ID)</h1>";
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');

        const product = await response.json();

        // Populate details
        document.getElementById('detail-title').innerText = product.title;
        document.getElementById('detail-price').innerText = "₹" + product.price;
        const mrp = (parseFloat(product.price) * 1.25).toFixed(2);
        document.getElementById('mrp-price').innerText = "₹" + mrp;

        const mainImg = document.getElementById('detail-img');
        mainImg.src = product.image;

        // Populate mock thumbnails with the same image (or variations if we had them)
        const thumbs = [product.image, product.image, product.image, product.image];
        const thumbEls = document.querySelectorAll('.thumb-img');
        thumbEls.forEach((el, index) => {
            if (thumbs[index]) {
                el.src = thumbs[index];
                el.onclick = () => window.changeImage(thumbs[index]);
            }
        });

        // Update the Add to Cart button to work with global event delegation
        const btn = document.getElementById('add-to-cart-detail');
        if (btn) {
            btn.classList.add('add-to-cart-btn'); // Add class for script.js delegation
            btn.setAttribute('data-id', product.id); // Although API is numeric, ID in JSON is numeric, dataset might be string
            btn.setAttribute('data-title', product.title);
            btn.setAttribute('data-price', product.price);
        }

        // Wishlist Logic
        const wishlistBtn = document.getElementById('add-to-wishlist-detail');
        if (wishlistBtn) {
            // Check if already in wishlist
            let wishlist = JSON.parse(localStorage.getItem('footcap-wishlist') || '[]');
            const exists = wishlist.find(item => item.id == product.id);
            if (exists) {
                wishlistBtn.style.color = 'var(--bittersweet)';
                wishlistBtn.querySelector('ion-icon').name = 'heart';
            }

            wishlistBtn.addEventListener('click', () => {
                wishlist = JSON.parse(localStorage.getItem('footcap-wishlist') || '[]');
                const index = wishlist.findIndex(item => item.id == product.id);

                if (index > -1) {
                    // Remove
                    wishlist.splice(index, 1);
                    wishlistBtn.style.color = 'inherit';
                    wishlistBtn.querySelector('ion-icon').name = 'heart-outline';
                    alert('Removed from Wishlist');
                } else {
                    // Add
                    wishlist.push({
                        id: String(product.id),
                        title: product.title,
                        price: product.price,
                        image: product.image
                    });
                    wishlistBtn.style.color = 'var(--bittersweet)';
                    wishlistBtn.querySelector('ion-icon').name = 'heart';
                    alert('Added to Wishlist');
                }
                localStorage.setItem('footcap-wishlist', JSON.stringify(wishlist));

                // Try to update UI if function is available globally
                if (typeof updateWishlistUI === 'function') {
                    updateWishlistUI();
                } else {
                    // Manual update fallback
                    const badge = document.querySelector("button.nav-action-btn:has(ion-icon[name='heart-outline']) .nav-action-badge");
                    if (badge) badge.innerText = wishlist.length;
                }
            });
        }

        // Render Reviews
        const reviewsHtml = (product.reviews || []).map(r => `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <strong>${r.user}</strong> <span style="color:gold;">${'★'.repeat(r.rating)}</span>
                <p>${r.comment}</p>
                <small style="color:#888;">${new Date(r.date).toLocaleDateString()}</small>
            </div>
        `).join('');

        const reviewSection = document.createElement('section');
        reviewSection.className = 'section';
        reviewSection.innerHTML = `
            <div class="container">
                <h2 class="h2 section-title">Reviews</h2>
                <div id="reviews-list" style="margin-bottom: 30px;">
                    ${reviewsHtml.length > 0 ? reviewsHtml : '<p>No reviews yet.</p>'}
                </div>
                
                <h3>Write a Review</h3>
                <form id="review-form" style="max-width: 500px; margin-top: 20px;">
                    <div style="margin-bottom: 10px;">
                        <label>Name</label>
                        <input type="text" id="review-user" required style="width:100%; padding: 10px; border: 1px solid #ddd;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label>Rating</label>
                        <select id="review-rating" style="width:100%; padding: 10px; border: 1px solid #ddd;">
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label>Comment</label>
                        <textarea id="review-comment" required style="width:100%; padding: 10px; border: 1px solid #ddd;"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit Review</button>
                </form>
            </div>
        `;

        document.querySelector('main').appendChild(reviewSection);

        // Review Form Handler
        document.getElementById('review-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = document.getElementById('review-user').value;
            const rating = document.getElementById('review-rating').value;
            const comment = document.getElementById('review-comment').value;

            try {
                const res = await fetch(`/api/products/${product.id}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user, rating, comment })
                });

                if (res.ok) {
                    alert('Review added!');
                    window.location.reload();
                } else {
                    alert('Failed to add review.');
                }
            } catch (err) {
                console.error(err);
            }
        });

    } catch (error) {
        console.error(error);
        document.querySelector('.product-details').innerHTML = "<h1>Product not found</h1>";
    }
});
