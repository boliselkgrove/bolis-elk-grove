// === CONFIGURE YOUR STOCK & PRICING ===
const FLAVORS = [
  { name: 'Mango',        price: 3, stock: 50 },
  { name: 'Mango Chili',  price: 3, stock: 30 },
  { name: 'Oreo',         price: 3, stock: 40 },
  { name: 'Nutella',      price: 3, stock: 20 },
  { name: 'Gansito',      price: 3, stock: 25 },
  { name: 'Strawberry',   price: 3, stock: 35 },
  { name: 'Strw & Cream', price: 3, stock: 15 },
  { name: 'Mazapan',      price: 3, stock: 10 },
  { name: 'Coconut',      price: 3, stock: 18 }
];

const BUNDLES = [
  { qty: 100, price: 200 },
  { qty:  48, price: 104 },
  { qty:  36, price:  84 },
  { qty:  24, price:  60 },
  { qty:  12, price:  32 },
  { qty:   1, price:   3 }
];
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('orderForm');
  const grid       = document.getElementById('flavorGrid');
  const displayTtl = document.getElementById('displayTotal');
  const hiddenSum  = document.getElementById('order_summary');
  const hiddenTot  = document.getElementById('order_total');
  const submitBtn  = document.getElementById('submitBtn');

  // 1) Build flavor inputs
  FLAVORS.forEach((f,i) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <label>${f.name} ($${f.price})</label>
      <input
        type="number"
        min="0"
        max="${f.stock}"
        value="
