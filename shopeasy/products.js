const products = [
  { id: 1, name: "Wireless Headphones", price: 1499, emoji: "🎧", category: "electronics", stars: 5, reviews: 128 },
  { id: 2, name: "Smart Watch", price: 2999, emoji: "⌚", category: "electronics", stars: 4, reviews: 89 },
  { id: 3, name: "Bluetooth Speaker", price: 999, emoji: "🔊", category: "electronics", stars: 4, reviews: 74 },
  { id: 4, name: "Floral Dress", price: 899, emoji: "👗", category: "fashion", stars: 5, reviews: 56 },
  { id: 5, name: "Running Shoes", price: 1299, emoji: "👟", category: "fashion", stars: 5, reviews: 203 },
  { id: 6, name: "Sunglasses", price: 599, emoji: "🕶️", category: "fashion", stars: 4, reviews: 41 },
  { id: 7, name: "The Alchemist", price: 299, emoji: "📚", category: "books", stars: 5, reviews: 312 },
  { id: 8, name: "Atomic Habits", price: 349, emoji: "📖", category: "books", stars: 5, reviews: 198 },
  { id: 9, name: "Desk Lamp", price: 799, emoji: "💡", category: "home", stars: 4, reviews: 67 },
  { id: 10, name: "Coffee Mug", price: 249, emoji: "☕", category: "home", stars: 5, reviews: 143 },
  { id: 11, name: "Yoga Mat", price: 699, emoji: "🧘", category: "sports", stars: 5, reviews: 88 },
  { id: 12, name: "Water Bottle", price: 399, emoji: "🍶", category: "sports", stars: 4, reviews: 55 },
];

let cart = [];
let currentCategory = "all";

// Display products
function displayProducts(list) {
  const grid = document.getElementById("product-grid");
  if (list.length === 0) {
    grid.innerHTML = `<p style="color:#6d5cae;padding:20px;">No products found!</p>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <span class="badge">${p.category}</span>
        <div class="product-name">${p.name}</div>
        <div class="stars">${'★'.repeat(p.stars)}${'☆'.repeat(5 - p.stars)} (${p.reviews})</div>
        <div class="price">₹${p.price.toLocaleString()}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart 🛒</button>
        <button class="review-btn" onclick="openReview(${p.id})">⭐ Write Review</button>
      </div>
    </div>
  `).join('');
}

// Filter by category
function filterCat(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

// Search
document.getElementById("search").addEventListener("input", applyFilters);

function applyFilters() {
  const query = document.getElementById("search").value.toLowerCase();
  let filtered = products;
  if (currentCategory !== "all") {
    filtered = filtered.filter(p => p.category === currentCategory);
  }
  if (query) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
  }
  displayProducts(filtered);
}

// Cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  document.getElementById("cart-count").textContent = cart.length;
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  document.getElementById("cart-total").textContent = total.toLocaleString();

  const cartItems = document.getElementById("cart-items");
  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Cart is empty!</p>`;
    return;
  }
  cartItems.innerHTML = cart.map((p, i) => `
    <div class="cart-item">
      <div class="cart-item-emoji">${p.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">₹${p.price.toLocaleString()}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
    </div>
  `).join('');
}

function toggleCart() {
  document.getElementById("cart-sidebar").classList.toggle("open");
  document.getElementById("cart-overlay").classList.toggle("open");
}

// Load on start
displayProducts(products);
// Review system
let currentReviewProduct = null;
let selectedRating = 0;

function openReview(id) {
  currentReviewProduct = products.find(p => p.id === id);
  document.getElementById('review-product-name').textContent = '📦 ' + currentReviewProduct.name;
  document.getElementById('review-name').value = '';
  document.getElementById('review-comment').value = '';
  setRating(0);
  document.getElementById('review-modal').classList.add('open');
  document.getElementById('review-overlay').classList.add('open');
}

function closeReview() {
  document.getElementById('review-modal').classList.remove('open');
  document.getElementById('review-overlay').classList.remove('open');
}

function setRating(rating) {
  selectedRating = rating;
  document.querySelectorAll('.star-rating span').forEach((star, i) => {
    star.classList.toggle('active', i < rating);
  });
}

function submitReview() {
  const name = document.getElementById('review-name').value;
  const comment = document.getElementById('review-comment').value;

  if (!name || !comment || selectedRating === 0) {
    alert('Please fill all fields and select a rating!');
    return;
  }

  const review = {
    productId: currentReviewProduct.id,
    productName: currentReviewProduct.name,
    emoji: currentReviewProduct.emoji,
    name,
    stars: selectedRating,
    comment,
    date: new Date().toLocaleDateString()
  };

  // Save to localStorage
  const reviews = JSON.parse(localStorage.getItem('shopeasy-reviews') || '[]');
  reviews.push(review);
  localStorage.setItem('shopeasy-reviews', JSON.stringify(reviews));

  alert('✅ Review submitted! Thank you!');
  closeReview();
}
