// 1. DATA: our product list (an array of objects)
const products = [
  { id: 1,  name: "Bananas (1 lb)",   price: 0.58,  category: "Grocery",     emoji: "🍌" },
  { id: 2,  name: "Whole Milk",       price: 3.48,  category: "Grocery",     emoji: "🥛" },
  { id: 3,  name: "Bread Loaf",       price: 2.25,  category: "Grocery",     emoji: "🍞" },
  { id: 4,  name: "Eggs (dozen)",     price: 4.12,  category: "Grocery",     emoji: "🥚" },
  { id: 5,  name: "Wireless Earbuds", price: 24.99, category: "Electronics", emoji: "🎧" },
  { id: 6,  name: "Phone Charger",    price: 9.97,  category: "Electronics", emoji: "🔌" },
  { id: 7,  name: "Gaming Mouse",     price: 19.88, category: "Electronics", emoji: "🖱️" },
  { id: 8,  name: "T-Shirt",          price: 7.50,  category: "Clothing",    emoji: "👕" },
  { id: 9,  name: "Running Shoes",    price: 29.98, category: "Clothing",    emoji: "👟" },
  { id: 10, name: "Baseball Cap",     price: 6.00,  category: "Clothing",    emoji: "🧢" },
  { id: 11, name: "Desk Lamp",        price: 15.47, category: "Home",        emoji: "💡" },
  { id: 12, name: "Coffee Mug",       price: 3.99,  category: "Home",        emoji: "☕" }
];

// 2. STATE: things that change while the user shops
let selectedCategory = "All";
let searchText = "";
let cart = {}; // { productId: quantity }

try { cart = JSON.parse(localStorage.getItem("cart")) || {}; } catch (e) { cart = {}; }

// 3. Grab page elements
const grid = document.getElementById("grid");
const cats = document.getElementById("cats");
const panel = document.getElementById("panel");
const itemsBox = document.getElementById("items");

// 4. Draw the category buttons
function renderCategories() {
  const names = ["All", ...new Set(products.map(p => p.category))];
  cats.innerHTML = "";
  names.forEach(name => {
    const btn = document.createElement("button");
    btn.className = "cat" + (name === selectedCategory ? " active" : "");
    btn.textContent = name;
    btn.onclick = () => { selectedCategory = name; renderCategories(); renderProducts(); };
    cats.appendChild(btn);
  });
}

// 5. Draw the product cards (filtered by category + search)
function renderProducts() {
  const list = products.filter(p =>
    (selectedCategory === "All" || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchText)
  );
  if (list.length === 0) { grid.innerHTML = `<div class="none">No products found.</div>`; return; }
  grid.innerHTML = list.map(p => `
    <div class="card">
      <div class="emoji">${p.emoji}</div>
      <div>${p.name}</div>
      <div class="price">$${p.price.toFixed(2)}</div>
      <button class="add" onclick="addToCart(${p.id})">Add to cart</button>
    </div>`).join("");
}

// 6. Cart actions
function addToCart(id) { cart[id] = (cart[id] || 0) + 1; updateCart(); }
function changeQty(id, amount) {
  cart[id] += amount;
  if (cart[id] <= 0) delete cart[id];
  updateCart();
}

// 7. Redraw the cart panel, count, and total
function updateCart() {
  let total = 0, count = 0;
  const ids = Object.keys(cart);
  itemsBox.innerHTML = ids.length ? "" : `<div class="none">Your cart is empty.</div>`;
  ids.forEach(id => {
    const p = products.find(item => item.id === Number(id));
    const qty = cart[id];
    total += p.price * qty;
    count += qty;
    itemsBox.innerHTML += `
      <div class="row">
        <span>${p.emoji} ${p.name}<br>$${(p.price * qty).toFixed(2)}</span>
        <span class="qty">
          <button onclick="changeQty(${p.id}, -1)">−</button>
          ${qty}
          <button onclick="changeQty(${p.id}, 1)">+</button>
        </span>
      </div>`;
  });
  document.getElementById("total").textContent = total.toFixed(2);
  document.getElementById("count").textContent = count;
  try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {}
}

// 8. Events
document.getElementById("search").addEventListener("input", e => {
  searchText = e.target.value.toLowerCase();
  renderProducts();
});
document.getElementById("cartBtn").onclick = () => panel.classList.add("open");
document.getElementById("closeBtn").onclick = () => panel.classList.remove("open");
document.getElementById("checkoutBtn").onclick = () => {
  if (Object.keys(cart).length === 0) return alert("Your cart is empty!");
  alert("Thank you for your order! Total: $" + document.getElementById("total").textContent);
  cart = {};
  updateCart();
  panel.classList.remove("open");
};

// 9. Start the app
renderCategories();
renderProducts();
updateCart();
