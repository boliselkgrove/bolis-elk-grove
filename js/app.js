// === CONFIG: Flavors + Stock + Bundle Pricing ===
const FLAVORS = [
  { name:'Mango',        stock:50 },
  { name:'Mango Chili',  stock:30 },
  { name:'Oreo',         stock:40 },
  { name:'Nutella',      stock:20 },
  { name:'Gansito',      stock:25 },
  { name:'Strawberry',   stock:35 },
  { name:'Strawberries & Cream', stock:15 },
  { name:'Mazapan',      stock:10 },
  { name:'Coconut',      stock:18 }
];

const BUNDLES = [
  { qty:100, price:200 },
  { qty: 48, price:104 },
  { qty: 36, price: 84 },
  { qty: 24, price: 60 },
  { qty: 12, price: 32 },
  { qty:  1, price:  3 }
];
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('orderForm');
  const grid        = document.getElementById('flavorGrid');
  const displayTotal= document.getElementById('displayTotal');
  const hiddenSum   = document.getElementById('order_summary');
  const hiddenTot   = document.getElementById('order_total');
  const submitBtn   = document.getElementById('submitBtn');

  // 1) Build the flavor input grid
  FLAVORS.forEach(flavor => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <label for="flavor-${flavor.name}">${flavor.name} (in stock: ${flavor.stock})</label>
      <input
        id="flavor-${flavor.name}"
        name="${flavor.name}"
        type="number"
        min="0"
        max="${flavor.stock}"
        value="0"
        data-flavor="${flavor.name}"
      >
    `;
    grid.appendChild(wrapper);
  });

  // 2) Recalculate summary + total whenever any flavor changes
  grid.addEventListener('input', recalc);
  recalc(); // initial calculation

  // 3) On submit, ensure at least one bolis
  form.addEventListener('submit', e => {
    if (parseInt(hiddenTot.value) === 0) {
      e.preventDefault();
      alert('Please select at least one bolis flavor.');
    }
    // otherwise let Formspree handle the POST
  });

  // ===== Helper Functions =====
  function recalc() {
    const counts = {};
    FLAVORS.forEach(f => {
      const val = parseInt(
        document.getElementById(`flavor-${f.name}`).value
      ) || 0;
      if (val > 0) counts[f.name] = val;
    });

    // Build summary lines
    const lines = Object.entries(counts)
      .map(([flavor, qty]) => `${flavor}: ${qty}`);
    hiddenSum.value = lines.join('\n') || 'None';

    // Calculate bundle pricing
    hiddenTot.value = calculateTotal(counts);
    displayTotal.textContent = `Total: $${hiddenTot.value}`;
  }

  function calculateTotal(orderCounts) {
    let remaining = Object.values(orderCounts)
                          .reduce((sum, v) => sum + v, 0);
    return BUNDLES.reduce((sum, {qty, price}) => {
      const bundles = Math.floor(remaining / qty);
      sum += bundles * price;
      remaining %= qty;
      return sum;
    }, 0);
  }
});
