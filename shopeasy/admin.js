// Admin credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'shop123';

// Products data (same as products.js)
let adminProducts = [
  { id: 1, name: "Wireless Headphones", price: 1499, emoji: "🎧", category: "electronics" },
  { id: 2, name: "Smart Watch", price: 2999, emoji: "⌚", category: "electronics" },
  { id: 3, name: "Bluetooth Speaker", price: 999, emoji: "🔊", category: "electronics" },
  { id: 4, name: "Floral Dress", price: 899, emoji: "👗", category: "fashion" },
  { id: 5, name: "Running Shoes", price: 1299, emoji: "👟", category: "fashion" },
  { id: 6, name: "Sunglasses", price: 599, emoji: "🕶️", category: "fashion" },
  { id: 7, name: "The Alchemist", price: 299, emoji: "📚", category: "books" },
  { id: 8, name: "Atomic Habits", price: 349, emoji: "📖", category: "books" },
  { id: 9, name: "Desk Lamp", price: 799, emoji: "💡", category: "home" },
  { id: 10, name: "Coffee Mug", price: 249, emoji: "☕", category: "home" },
  { id: 11, name: "Yoga Mat", price: 699, emoji: "🧘", category: "sports" },
  { id: 12, name: "Water Bottle", price: 399, emoji: "🍶", category: "sports" },
];

let adminReviews = [];

// Login
function adminLogin() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    loadProducts();
  } else {
    document.getElementById('login-error').textContent = '❌ Wrong username or password!';
  }
}

// Logout
function logout() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

// Show Section
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('section-' + name).style.display = 'block';
  event.target.classList.add('active');
  if (name === 'products') loadProducts();
  if (name === 'reviews') loadReviews();
  if (name === 'stats') loadStats();
}

// Load Products
function loadProducts() {
  const list = document.getElementById('admin-product-list');
  if (adminProducts.length === 0) {
    list.innerHTML = '<p style="color:#6d5cae;">No products yet!</p>';
    return;
  }
  list.innerHTML = adminProducts.map(p => `
    <div class="product-row">
      <div class="product-emoji">${p.emoji}</div>
      <div class="product-info">
        <div class="pname">${p.name}</div>
        <div class="pcat">${p.category}</div>
      </div>
      <div class="product-price">₹${p.price.toLocaleString()}</div>
      <button class="delete-btn" onclick="deleteProduct(${p.id})">🗑 Delete</button>
    </div>
  `).join('');
}

// Add Product
function addProduct() {
  const name = document.getElementById('p-name').value;
  const price = document.getElementById('p-price').value;
  const emoji = document.getElementById('p-emoji').value;
  const category = document.getElementById('p-category').value;

  if (!name || !price || !emoji || !category) {
    alert('Please fill all fields!');
    return;
  }

  const newProduct = {
    id: Date.now(),
    name,
    price: parseInt(price),
    emoji,
    category
  };

  adminProducts.push(newProduct);
  loadProducts();
  loadStats();

  // Clear form
  document.getElementById('p-name').value = '';
  document.getElementById('p-price').value = '';
  document.getElementById('p-emoji').value = '';
  document.getElementById('p-category').value = '';

  alert('✅ Product added successfully!');
}

// Delete Product
function deleteProduct(id) {
  if (confirm('Delete this product?')) {
    adminProducts = adminProducts.filter(p => p.id !== id);
    loadProducts();
    loadStats();
  }
}

// Load Reviews
function loadReviews() {
  const list = document.getElementById('admin-review-list');
  
  // Get reviews from localStorage
  const reviews = JSON.parse(localStorage.getItem('shopeasy-reviews') || '[]');
  adminReviews = reviews;

  if (reviews.length === 0) {
    list.innerHTML = '<p style="color:#6d5cae;text-align:center;padding:20px;">No reviews yet!</p>';
    return;
  }

  list.innerHTML = reviews.map((r, i) => `
    <div class="product-row">
      <div class="product-emoji">${r.emoji || '📦'}</div>
      <div class="product-info">
        <div class="pname">${r.productName} — ${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
        <div class="pcat">"${r.comment}" — ${r.name}</div>
      </div>
      <button class="delete-btn" onclick="deleteReview(${i})">🗑 Delete</button>
    </div>
  `).join('');
}

// Delete Review
function deleteReview(index) {
  if (confirm('Delete this review?')) {
    const reviews = JSON.parse(localStorage.getItem('shopeasy-reviews') || '[]');
    reviews.splice(index, 1);
    localStorage.setItem('shopeasy-reviews', JSON.stringify(reviews));
    loadReviews();
    loadStats();
  }
}

// Load Stats
function loadStats() {
  document.getElementById('total-products').textContent = adminProducts.length;
  const reviews = JSON.parse(localStorage.getItem('shopeasy-reviews') || '[]');
  document.getElementById('total-reviews').textContent = reviews.length;
}
