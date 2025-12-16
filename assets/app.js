// ================================
// CONFIGURATION
// ================================
const MOCK_API_URL = "https://69369907f8dc350aff3170f8.mockapi.io/plans";


// ================================
// HELPER FUNCTIONS
// ================================
function getCurrentPage() {
  return document.body.dataset.page;
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validateMobile(mobile) {
  return /^\d{10}$/.test(mobile);
}

function showError(id, msg) {
  const e = document.getElementById(id);
  e.textContent = msg;
  e.classList.remove("hidden");
}

function hideError(id) {
  const e = document.getElementById(id);
  e.textContent = "";
  e.classList.add("hidden");
}

function getArray(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

function getUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

function requireLogin() {
  if (!getUser()) {
    window.location.href = "index.html";
  }
}


// ================================
// LOGIN PAGE
// ================================
function initLoginPage() {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();

    if (!email || !pass) {
      return showError("loginError", "All fields required!");
    }
    if (!validateEmail(email)) {
      return showError("loginError", "Invalid email format!");
    }

    const users = getArray("users");
    const user = users.find((u) => u.email === email && u.password === pass);

    if (!user) {
      return showError("loginError", "Invalid login credentials!");
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "recharge.html";
  });
}


// ================================
// SIGNUP PAGE
// ================================
function initSignupPage() {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const mobile = document.getElementById("signupMobile").value.trim();
    const pass = document.getElementById("signupPassword").value.trim();
    const cpass = document.getElementById("signupConfirmPassword").value.trim();

    if (!name || !email || !mobile || !pass || !cpass) {
      return showError("signupError", "All fields required!");
    }
    if (!validateEmail(email)) {
      return showError("signupError", "Invalid email!");
    }
    if (!validateMobile(mobile)) {
      return showError("signupError", "Mobile must be 10 digits!");
    }
    if (pass.length < 6) {
      return showError("signupError", "Password must be 6+ characters!");
    }
    if (pass !== cpass) {
      return showError("signupError", "Passwords do not match!");
    }

    const users = getArray("users");
    if (users.find((u) => u.email === email)) {
      return showError("signupError", "Email already registered!");
    }

    users.push({ name, email, mobile, password: pass });
    saveArray("users", users);

    alert("Signup successful! Please login.");
    window.location.href = "index.html";
  });
}


// ================================
// LOGOUT BUTTON
// ================================
function initLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}


// ================================
// RECHARGE PAGE
// ================================
function initRechargePage() {
  requireLogin();
  initLogout();

  const user = getUser();
  document.getElementById("rechargeMobile").value = user.mobile;

  const form = document.getElementById("rechargeForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const mobile = document.getElementById("rechargeMobile").value.trim();
    const operator = document.getElementById("rechargeOperator").value;
    const type = document.querySelector("input[name='connectionType']:checked").value;

    if (!validateMobile(mobile)) {
      return showError("rechargeError", "Enter a valid 10-digit mobile!");
    }
    if (!operator) {
      return showError("rechargeError", "Select an operator!");
    }

    localStorage.setItem(
      "currentRecharge",
      JSON.stringify({ mobile, operator, type })
    );

    window.location.href = "plans.html";
  });
}


// ================================
// PLANS PAGE
// ================================
async function initPlansPage() {
  requireLogin();
  initLogout();

  const recharge = JSON.parse(localStorage.getItem("currentRecharge"));
  const info = document.getElementById("plansInfo");
  const loading = document.getElementById("plansLoading");
  const container = document.getElementById("plansContainer");

  info.textContent = `Showing ${recharge.type.toUpperCase()} plans for ${recharge.operator} - ${recharge.mobile}`;

  try {
    const res = await fetch(MOCK_API_URL);
    const plans = await res.json();

    loading.textContent = "";

    const filtered = plans.filter(p => p.type === recharge.type);

    filtered.forEach(plan => {
      const card = document.createElement("div");
      card.className = "bg-white shadow-md p-4 rounded-lg";

      card.innerHTML = `
        <p class="text-xl font-bold mb-2">₹${plan.price}</p>
        <p>Validity: ${plan.validity}</p>
        <p>Data: ${plan.data}</p>
        <p class="text-sm text-gray-500">${plan.description}</p>
        <button class="btn-primary w-full mt-3">Select</button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        localStorage.setItem("selectedPlan", JSON.stringify(plan));
        window.location.href = "payment.html";
      });

      container.appendChild(card);
    });

  } catch (err) {
    loading.textContent = "";
    showError("plansError", "Unable to load plans. Check API URL.");
  }
}


// ================================
// PAYMENT PAGE
// ================================
function initPaymentPage() {
  requireLogin();
  initLogout();

  const recharge = JSON.parse(localStorage.getItem("currentRecharge"));
  const plan = JSON.parse(localStorage.getItem("selectedPlan"));
  const summary = document.getElementById("paymentSummary");

  summary.innerHTML = `
    <p><strong>Mobile:</strong> ${recharge.mobile}</p>
    <p><strong>Operator:</strong> ${recharge.operator}</p>
    <p><strong>Type:</strong> ${recharge.type.toUpperCase()}</p>
    <hr class="my-2">
    <p><strong>Amount:</strong> ₹${plan.price}</p>
    <p><strong>Validity:</strong> ${plan.validity}</p>
    <p><strong>Data:</strong> ${plan.data}</p>
  `;

  document.getElementById("payBtn").addEventListener("click", () => {
    const history = getArray("rechargeHistory");

    history.push({
      date: new Date().toISOString(),
      mobile: recharge.mobile,
      operator: recharge.operator,
      price: plan.price,
      plan: plan.description
    });

    saveArray("rechargeHistory", history);

    localStorage.removeItem("currentRecharge");
    localStorage.removeItem("selectedPlan");

    window.location.href = "success.html";
  });
}


// ================================
// SUCCESS PAGE
// ================================
function initSuccessPage() {
  requireLogin();
  initLogout();
}


// ================================
// DASHBOARD PAGE
// ================================
function initDashboardPage() {
  requireLogin();
  initLogout();

  const user = getUser();
  document.getElementById("dashboardUserName").textContent = user.name;

  const history = getArray("rechargeHistory");

  const tbody = document.getElementById("historyTableBody");

  history.forEach(h => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-4 py-2">${new Date(h.date).toLocaleString()}</td>
      <td class="px-4 py-2">${h.mobile}</td>
      <td class="px-4 py-2">${h.operator}</td>
      <td class="px-4 py-2">${h.plan}</td>
      <td class="px-4 py-2">₹${h.price}</td>
    `;
    tbody.appendChild(tr);
  });
}


// ================================
// PAGE ROUTER
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const page = getCurrentPage();

  if (page === "login") initLoginPage();
  if (page === "signup") initSignupPage();
  if (page === "recharge") initRechargePage();
  if (page === "plans") initPlansPage();
  if (page === "payment") initPaymentPage();
  if (page === "success") initSuccessPage();
  if (page === "dashboard") initDashboardPage();
});
