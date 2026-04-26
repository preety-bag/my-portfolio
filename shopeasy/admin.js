const ADMIN_USER = 'admin';
const ADMIN_PASS = 'shop123';

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

function logout() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('section-' + name).style.display = 'block';
  event.target.classList.add('active');
  if (name === 'products') loadProducts();
  if (name === 'reviews') loadReviews();
  if (name === 'stats') loadStats();
}

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

function addProduct() {
  const name = document.getElementById('p-name').value;
  const price = document.getElementById('p-price').value;
  const emoji = document.getElementById('p-emoji').value;
  const category = document.getElementById('p-category').value;
  if (!name || !price || !emoji || !category) {
    alert('Please fill all fields!');
    return;
  }
  const newProduct = { id: Date.now(), name, price: parseInt(price), emoji, category };
  adminProducts.push(newProduct);
  loadProducts();
  loadStats();
  document.getElementById('p-name').value = '';
  document.getElementById('p-price').value = '';
  document.getElementById('p-emoji').value = '';
  document.getElementById('p-category').value = '';
  alert('✅ Product added successfully!');
}

function deleteProduct(id) {
  if (confirm('Delete this product?')) {
    adminProducts = adminProducts.filter(p => p.id !== id);
    loadProducts();
    loadStats();
  }
}

function loadReviews() {
  const list = document.getElementById('admin-review-list');
  list.innerHTML = '<p style="color:#6d5cae;text-align:center;padding:20px;">Loading reviews...</p>';

  fetch('http://localhost:5000/api/reviews')
  .then(res => res.json())
  .then(reviews => {
    adminReviews = reviews;
    if (reviews.length === 0) {
      list.innerHTML = '<p style="color:#6d5cae;text-align:center;padding:20px;">No reviews yet!</p>';
      return;
    }
    list.innerHTML = reviews.map((r) => `
      <div class="product-row">
        <div class="product-emoji">${r.emoji || '📦'}</div>
        <div class="product-info">
          <div class="pname">${r.productName} — ${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
          <div class="pcat">"${r.comment}" — ${r.name}</div>
        </div>
        <button class="delete-btn" onclick="deleteReview('${r._id}')">🗑 Delete</button>
      </div>
    `).join('');
    loadStats();
  })
  .catch(err => {
    list.innerHTML = '<p style="color:#f87171;">Error loading reviews! Server chal raha hai?</p>';
  });
}

function deleteReview(id) {
  if (confirm('Delete this review?')) {
    fetch(`http://localhost:5000/api/reviews/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => {
      loadReviews();
      loadStats();
    });
  }
}

function loadStats() {
  document.getElementById('total-products').textContent = adminProducts.length;
  document.getElementById('total-reviews').textContent = adminReviews.length;
}
