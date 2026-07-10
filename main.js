/* ============================================================
   FREE NET SOLUTIONS — captive portal logic
   ------------------------------------------------------------
   Pricing tiers live here. Edit BUNDLES to change price/time.
   Payment is currently a MOCK (see payWithMpesa()) — swap that
   function's body for a real fetch() to your Daraja/M-Pesa
   backend once it exists. Everything else stays the same.
   ============================================================ */

const BUNDLES = [
  { id: "b10",  price: 10,  label: "30 mins",  minutes: 30,   best: false },
  { id: "b20",  price: 20,  label: "1 hour",   minutes: 60,   best: false },
  { id: "b50",  price: 50,  label: "3 hours",  minutes: 180,  best: true  },
  { id: "b100", price: 100, label: "6 hours",  minutes: 360,  best: false },
  { id: "b150", price: 150, label: "24 hours", minutes: 1440, best: false },
];

let selectedBundle = null;

/* ---------- render bundle cards ---------- */
const bundlesEl = document.getElementById("bundles");

BUNDLES.forEach((bundle, i) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "bundle" + (bundle.best ? " best" : "");
  card.dataset.id = bundle.id;
  card.innerHTML = `
    <span class="price">${bundle.price}<sup>bob</sup></span>
    <span class="time">${bundle.label}</span>
  `;
  card.addEventListener("click", () => selectBundle(bundle, card));
  bundlesEl.appendChild(card);
});

function selectBundle(bundle, cardEl){
  selectedBundle = bundle;

  document.querySelectorAll(".bundle").forEach(el => el.classList.remove("selected"));
  cardEl.classList.add("selected");

  // signal bars fill in proportion to which tier (1-5) was picked
  const idx = BUNDLES.findIndex(b => b.id === bundle.id) + 1;
  const signal = document.getElementById("signal");
  signal.className = "signal active-" + idx;

  updateButton();
  validate();
}

/* ---------- phone + button state ---------- */
const phoneInput = document.getElementById("phone");
const hint = document.getElementById("hint");
const payBtn = document.getElementById("payBtn");
const btnPrice = document.getElementById("btnPrice");

phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 9);
  validate();
});

function isValidPhone(v){
  // Kenyan mobile: 7XXXXXXXX or 1XXXXXXXX, 9 digits total after +254
  return /^(7|1)\d{8}$/.test(v);
}

function updateButton(){
  if (!selectedBundle) {
    payBtn.querySelector(".btn-label").textContent = "Select a bundle";
    btnPrice.textContent = "";
    return;
  }
  payBtn.querySelector(".btn-label").textContent = "Pay with M-Pesa";
  btnPrice.textContent = `${selectedBundle.price} bob`;
}

function validate(){
  const phone = phoneInput.value;
  const phoneOk = isValidPhone(phone);

  if (!selectedBundle){
    hint.textContent = "Pick a bundle above, then enter the number to pay from.";
    hint.className = "hint";
  } else if (!phoneOk && phone.length > 0){
    hint.textContent = "Enter a valid Safaricom number, e.g. 7XXXXXXXX.";
    hint.className = "hint error";
  } else if (!phoneOk){
    hint.textContent = `Enter the number to receive the M-Pesa prompt on.`;
    hint.className = "hint";
  } else {
    hint.textContent = `You'll pay ${selectedBundle.price} bob for ${selectedBundle.label} of browsing.`;
    hint.className = "hint ready";
  }

  const ready = selectedBundle && phoneOk;
  payBtn.disabled = !ready;
  payBtn.classList.toggle("ready", ready);
}

/* ---------- payment flow ---------- */
const statusEl = document.getElementById("status");
const statusText = document.getElementById("statusText");
const spinner = document.getElementById("spinner");
const formCard = document.querySelector(".form-card");

payBtn.addEventListener("click", async () => {
  if (payBtn.disabled) return;

  formCard.hidden = true;
  statusEl.hidden = false;
  statusEl.className = "status";
  statusText.textContent = "Sending payment request to your phone…";

  const fullPhone = "254" + phoneInput.value;

  try {
    const result = await payWithMpesa({
      phone: fullPhone,
      amount: selectedBundle.price,
      bundleId: selectedBundle.id,
    });

    if (result.success) {
      statusEl.classList.add("success");
      statusText.textContent = `Payment received. You're connected for ${selectedBundle.label}.`;
      // Hook: this is where you'd redirect into the MikroTik hotspot
      // login flow, e.g. submitting the router's $(link-login-only)
      // form with a username/password your backend just generated.
    } else {
      throw new Error(result.message || "Payment was not completed.");
    }
  } catch (err) {
    statusEl.classList.add("error");
    statusText.textContent = err.message || "Something went wrong. Please try again.";
    setTimeout(() => {
      statusEl.hidden = true;
      formCard.hidden = false;
    }, 2500);
  }
});

/* ------------------------------------------------------------
   MOCK payment call — replace with a real request to your
   backend, which itself calls the M-Pesa Daraja STK Push API.
   Expected real flow:
     1. fetch('/api/stk-push', { method:'POST', body: {phone, amount, bundleId} })
     2. backend calls Safaricom Daraja, returns a CheckoutRequestID
     3. frontend polls /api/stk-status/:id (or backend uses a
        webhook/callback URL) until payment confirms or times out
     4. on confirm, backend creates a MikroTik hotspot user via
        RouterOS API scoped to bundle.minutes, returns credentials
   ------------------------------------------------------------ */
function payWithMpesa({ phone, amount, bundleId }){
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true }); // mock: always succeeds after 2.2s
    }, 2200);
  });
    }

