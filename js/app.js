// =============================================================================
// CONFIG: Flavors + Stock + Bundle Pricing
// =============================================================================
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
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const form          = document.getElementById('orderForm');
  const grid          = document.getElementById('flavorGrid');
  const bundleWarning = document.getElementById('bundleWarning');
  const displayTotal  = document.getElementById('displayTotal');
  const hiddenSum     = document.getElementById('order_summary');
  const hiddenTot     = document.getElementById('order_total');
  const submitBtn     = document.getElementById('submitBtn');
  const bundleRadios  = document.getElementsByName('bundle');

  // 1) Render flavor inputs
  FLAVORS.forEach(flavor => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <label for="flavor-${flavor.name}">
        ${flavor.name} (stock: ${flavor.stock})
      </label>
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

  // 2) Recalculate on any input or bundle change
  grid.addEventListener('input', recalc);
  bundleRadios.forEach(r => r.addEventListener('change', recalc));
  recalc();

  // 3) Validate on submit
  form.addEventListener('submit', e => {
    const totalItems = getTotalItems();
    const bundleVal  = getSelectedBundle();
    if (bundleVal !== 'custom') {
      if (totalItems !== parseInt(bundleVal)) {
        e.preventDefault();
        alert(`Please select exactly ${bundleVal} Bolis for this bundle.`);
      }
    } else if (totalItems === 0) {
      e.preventDefault();
      alert('Please select at least one Bolis flavor.');
    }
    // otherwise allow form POST to Formspree
  });

  // ===== Helper Functions =====

  function getSelectedBundle() {
    const checked = [...bundleRadios].find(r => r.checked);
    return checked ? checked.value : 'custom';
  }

  function getTotalItems() {
    return FLAVORS.reduce((sum, f) => {
      const val = parseInt(
        document.getElementById(`flavor-${f.name}`).value
      ) || 0;
      return sum + val;
    }, 0);
  }

  function recalc() {
    const totalItems  = getTotalItems();
    const bundleVal   = getSelectedBundle();
    let totalPrice    = 0;
    let warningText   = '';

    if (bundleVal !== 'custom') {
      const bundleQty   = parseInt(bundleVal);
      const bundlePrice = BUNDLES.find(b => b.qty === bundleQty)?.price || 0;

      if (totalItems > bundleQty) {
        warningText = `You’ve selected ${totalItems}, which exceeds this bundle of ${bundleQty}.`;
        submitBtn.disabled = true;
      }
      else if (totalItems < bundleQty) {
        warningText = `Select ${bundleQty - totalItems} more Bolis to fill this bundle.`;
        submitBtn.disabled = true;
      }
      else {
        warningText = '';
        submitBtn.disabled = false;
      }
      totalPrice = bundlePrice;
    }
    else {
      // custom: apply best-price bundle algorithm
      totalPrice = calculateCustomPrice(totalItems);
      warningText = '';
      submitBtn.disabled = totalItems === 0;
    }

    // Build summary lines
    const lines = FLAVORS.map(f => {
      const qty = parseInt(
        document.getElementById(`flavor-${f.name}`).value
      ) || 0;
      return qty > 0 ? `${f.name}: ${qty}` : null;
    }).filter(Boolean);

    hiddenSum.value = lines.join('\n') || 'None';
    hiddenTot.value = totalPrice;
    displayTotal.textContent = `Total: $${totalPrice}`;

    bundleWarning.textContent = warningText;
  }

  function calculateCustomPrice(totalItems) {
    return BUNDLES.reduce((sum, {qty, price}) => {
      const bundles = Math.floor(totalItems / qty);
      sum += bundles * price;
      totalItems %= qty;
      return sum;
    }, 0);
  }
});
