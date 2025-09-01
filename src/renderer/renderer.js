/* global CashCalc */
(function () {
  const grid = document.getElementById('denoms-grid');
  const runningGrandTotalEl = document.getElementById('running-grand-total');
  const totalCountEl = document.getElementById('total-count');
  const descInput = document.getElementById('description');
  // print-only elements
  const prRows = document.getElementById('print-rows');
  const prGrandTotal = document.getElementById('print-grand-total');
  const prTotalCount = document.getElementById('print-total-count');
  const prDesc = document.getElementById('print-description');

  // Build inputs dynamically
  const inputs = new Map();
  const subtotalEls = new Map();
  CashCalc.DENOMINATIONS.forEach((d, idx) => {
    const label = document.createElement('label');
    label.className = 'label';
    label.htmlFor = d.key;
    label.textContent = d.label;

    const input = document.createElement('input');
    input.id = d.key;
    input.name = d.key;
    input.className = 'input';
    input.type = 'text';
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.placeholder = '0';

    // Allow only whole non-negative integers
    input.addEventListener('input', () => {
      const v = input.value.trim();
      if (v === '') {
        input.classList.remove('error');
        updatePerDenomSubtotal(d.key);
        return;
      }
      if (/^\d+$/.test(v)) {
        input.classList.remove('error');
      } else {
        input.classList.add('error');
      }
      // live update subtotal and running grand total
      updatePerDenomSubtotal(d.key);
    });

    // Enter triggers calculation; Tab is default browser behavior already
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doCalculate();
      }
    });

    // On blur, show per-denomination subtotal
    input.addEventListener('blur', () => {
      updatePerDenomSubtotal(d.key);
    });

    grid.appendChild(label);
    grid.appendChild(input);
    // Per-denomination subtotal element
    const sub = document.createElement('div');
    sub.className = 'subtotal';
    sub.textContent = '$0.00';
    grid.appendChild(sub);

    inputs.set(d.key, input);
    subtotalEls.set(d.key, sub);
  });

  function getCounts() {
    const counts = {};
    for (const d of CashCalc.DENOMINATIONS) {
      counts[d.key] = inputs.get(d.key).value.trim();
    }
    return counts;
  }

  function updatePerDenomSubtotal(key) {
    const d = CashCalc.DENOMINATIONS.find(x => x.key === key);
    if (!d) return;
    const v = inputs.get(key).value.trim();
    if (!/^\d+$/.test(v) && v !== '') {
      subtotalEls.get(key).textContent = '$0.00';
      // still update running total using current valid fields
      updateRunningGrandTotal();
      return;
    }
    const qty = v === '' ? 0 : Number(v);
    const cents = qty * d.value;
    subtotalEls.get(key).textContent = CashCalc.toCurrency(cents);
    updateRunningGrandTotal();
  }

  function updateRunningGrandTotal() {
    const counts = getCounts();
    const { rows, totalFormatted } = CashCalc.computeTotals(counts);
    if (runningGrandTotalEl) runningGrandTotalEl.textContent = totalFormatted;
    // total items is sum of all quantities
    const totalItems = rows.reduce((acc, r) => acc + Number(r.quantity || 0), 0);
    if (totalCountEl) totalCountEl.textContent = String(totalItems);
  }

  function doCalculate() {
    const counts = getCounts();
    const errors = CashCalc.validateCounts(counts);
    // mark errors
    const errorKeys = new Set(errors.map(e => e.key));
    for (const d of CashCalc.DENOMINATIONS) {
      const el = inputs.get(d.key);
      if (errorKeys.has(d.key)) el.classList.add('error'); else el.classList.remove('error');
      // keep per-denom subtotals in sync on calculate
      updatePerDenomSubtotal(d.key);
    }
    if (errors.length) return;
    // Update running total/count to ensure it's current
    updateRunningGrandTotal();
  }

  // Calculate button may not exist; calculation can be triggered via Ctrl+C
  const btnCalc = document.getElementById('btn-calc');
  if (btnCalc) btnCalc.addEventListener('click', doCalculate);

  document.getElementById('btn-print').addEventListener('click', async () => {
    try {
      // update print timestamp
      const ts = document.getElementById('print-timestamp');
      if (ts) ts.textContent = new Date().toLocaleString();
      populatePrintReport();
      await window.cashAPI.print();
    } catch (e) {
      console.error('Print failed', e);
    }
  });

  document.getElementById('btn-export').addEventListener('click', async () => {
    try {
      // update print timestamp
      const ts = document.getElementById('print-timestamp');
      if (ts) ts.textContent = new Date().toLocaleString();
      populatePrintReport();
      await window.cashAPI.exportPdf();
    } catch (e) {
      console.error('Export failed', e);
    }
  });

  document.getElementById('btn-exit').addEventListener('click', async () => {
    try { await window.cashAPI.exit(); } catch {}
  });

  // Reset all inputs and totals (reusable)
  function resetAll() {
    CashCalc.DENOMINATIONS.forEach(d => {
      const el = inputs.get(d.key);
      el.value = '';
      el.classList.remove('error');
      updatePerDenomSubtotal(d.key);
    });
    if (descInput) descInput.value = '';
    updateRunningGrandTotal();
  }
  document.getElementById('btn-reset').addEventListener('click', resetAll);
  if (window.cashAPI && typeof window.cashAPI.onReset === 'function') {
    window.cashAPI.onReset(() => resetAll());
  }

  // Keyboard shortcuts: Ctrl+P/E
  window.addEventListener('keydown', (e) => {
    const ctrlOrCmd = e.ctrlKey || e.metaKey;
    if (!ctrlOrCmd) return;
    if (e.key.toLowerCase() === 'p') {
      e.preventDefault();
      document.getElementById('btn-print').click();
    } else if (e.key.toLowerCase() === 'e') {
      e.preventDefault();
      document.getElementById('btn-export').click();
    }
  });

  function populatePrintReport() {
    const counts = getCounts();
    const { rows, totalFormatted } = CashCalc.computeTotals(counts);
    const totalItems = rows.reduce((acc, r) => acc + Number(r.quantity || 0), 0);
    if (prDesc) prDesc.textContent = (descInput && descInput.value || '').trim();
    if (prRows) {
      prRows.innerHTML = '';
      rows.forEach(r => {
        if (r.quantity > 0) {
          const tr = document.createElement('tr');
          const td1 = document.createElement('td');
          const td2 = document.createElement('td');
          const td3 = document.createElement('td');
          td1.textContent = r.label;
          td2.textContent = String(r.quantity);
          td3.textContent = CashCalc.toCurrency(r.subtotalCents);
          tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
          prRows.appendChild(tr);
        }
      });
    }
    if (prTotalCount) prTotalCount.textContent = String(totalItems);
    if (prGrandTotal) prGrandTotal.textContent = totalFormatted;
  }
})();
