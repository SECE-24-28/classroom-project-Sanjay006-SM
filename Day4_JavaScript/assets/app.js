// ------------------------------
// DAY 4 — JAVASCRIPT FUNCTIONALITY
// ------------------------------

// Helper functions -------------------
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
    if (!localStorage.getItem("currentUser")) {
        window.location.href = "index.html";
    }
}

// ------------------------------
// SIGNUP FUNCTION
// ------------------------------
function signupUser() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const mobile = document.getElementById("signupMobile").value;
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !mobile || !password) {
        alert("All fields are required");
        return;
    }

    let users = getArray("users");

    users.push({ name, email, mobile, password });
    saveArray("users", users);

    alert("Signup successful!");
    window.location.href = "index.html";
}

// ------------------------------
// LOGIN FUNCTION
// ------------------------------
function loginUser() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    let users = getArray("users");
    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid login");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "recharge.html";
}

// ------------------------------
// SAVE RECHARGE DETAILS
// ------------------------------
function saveRechargeData() {
    const mobile = document.getElementById("rechargeMobile").value;
    const operator = document.getElementById("rechargeOperator").value;
    const type = document.querySelector("input[name='type']:checked").value;

    if (!mobile || !operator) {
        alert("Fill all fields");
        return;
    }

    const recharge = { mobile, operator, type };
    localStorage.setItem("currentRecharge", JSON.stringify(recharge));

    window.location.href = "plans.html";
}

// ------------------------------
// LOAD PLANS (LOCAL ONLY FOR DAY 4)
// ------------------------------
function loadLocalPlans() {
    const container = document.getElementById("plansContainer");

    const samplePlans = [
        { id: 1, price: 199, validity: "28 days", data: "1.5GB/day", description: "Unlimited calls" },
        { id: 2, price: 299, validity: "28 days", data: "2GB/day", description: "Unlimited calls + SMS" },
        { id: 3, price: 399, validity: "56 days", data: "1.5GB/day", description: "All-rounder pack" },
    ];

    samplePlans.forEach(p => {
        const card = `
            <div class="p-4 bg-white shadow rounded mb-3">
                <h3 class="text-xl">₹${p.price}</h3>
                <p>Validity: ${p.validity}</p>
                <p>Data: ${p.data}</p>
                <p>${p.description}</p>
                <button onclick="selectPlan(${p.id})"
                        class="bg-blue-600 text-white px-4 py-1 rounded mt-2">
                    Select
                </button>
            </div>`;
        container.innerHTML += card;
    });

    localStorage.setItem("day4Plans", JSON.stringify(samplePlans));
}

// ------------------------------
// SELECT PLAN
// ------------------------------
function selectPlan(id) {
    localStorage.setItem("selectedPlan", id);
    window.location.href = "payment.html";
}

// ------------------------------
// PAYMENT PAGE LOAD
// ------------------------------
function loadPayment() {
    const plans = JSON.parse(localStorage.getItem("day4Plans"));
    const id = localStorage.getItem("selectedPlan");
    const plan = plans.find(p => p.id == id);

    document.getElementById("summary").innerHTML = `
        <h2 class="text-xl font-bold">₹${plan.price}</h2>
        <p>Validity: ${plan.validity}</p>
        <p>Data: ${plan.data}</p>
        <p>${plan.description}</p>
    `;
}

// ------------------------------
// COMPLETE PAYMENT
// ------------------------------
function completeRecharge() {
    const plans = JSON.parse(localStorage.getItem("day4Plans"));
    const id = localStorage.getItem("selectedPlan");
    const plan = plans.find(p => p.id == id);

    let history = getArray("rechargeHistory");

    history.push({
        date: new Date().toLocaleString(),
        mobile: JSON.parse(localStorage.getItem("currentRecharge")).mobile,
        operator: JSON.parse(localStorage.getItem("currentRecharge")).operator,
        price: plan.price,
        plan: plan.description
    });

    saveArray("rechargeHistory", history);

    window.location.href = "success.html";
}

// ------------------------------
// LOAD DASHBOARD
// ------------------------------
function loadDashboard() {
    let history = getArray("rechargeHistory");
    let table = document.getElementById("historyTable");

    history.forEach(h => {
        table.innerHTML += `
            <tr>
                <td class="p-2">${h.date}</td>
                <td class="p-2">${h.mobile}</td>
                <td class="p-2">${h.operator}</td>
                <td class="p-2">${h.plan}</td>
                <td class="p-2">₹${h.price}</td>
            </tr>
        `;
    });
}
