// -------------------------------------------
// CONFIG (USE YOUR MOCK API URL HERE)
// -------------------------------------------
const API_URL = "https://69369907f8dc350aff3170f8.mockapi.io/plans";

// -------------------------------------------
// HELPER FUNCTIONS
// -------------------------------------------
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

// -------------------------------------------
// SIGNUP
// -------------------------------------------
function signupUser() {
    const name = signupName.value;
    const email = signupEmail.value;
    const mobile = signupMobile.value;
    const password = signupPassword.value;

    if (!name || !email || !mobile || !password) {
        alert("All fields required!");
        return;
    }

    let users = getArray("users");

    users.push({ name, email, mobile, password });
    saveArray("users", users);

    alert("Signup successful!");
    window.location.href = "index.html";
}

// -------------------------------------------
// LOGIN
// -------------------------------------------
function loginUser() {
    const email = loginEmail.value;
    const password = loginPassword.value;

    let users = getArray("users");
    let valid = users.find(u => u.email === email && u.password === password);

    if (!valid) {
        alert("Invalid credentials!");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(valid));
    window.location.href = "recharge.html";
}

// -------------------------------------------
// SAVE RECHARGE INPUT
// -------------------------------------------
function saveRechargeData() {
    const mobile = rechargeMobile.value;
    const operator = rechargeOperator.value;
    const type = document.querySelector("input[name='type']:checked").value;

    if (!mobile || !operator) {
        alert("Fill all fields");
        return;
    }

    const recharge = { mobile, operator, type };
    localStorage.setItem("currentRecharge", JSON.stringify(recharge));

    window.location.href = "plans.html";
}

// -------------------------------------------
// DAY 5 → FETCH PLANS FROM MOCKAPI
// -------------------------------------------
async function loadPlansFromAPI() {
    const container = document.getElementById("plansContainer");
    const info = document.getElementById("plansInfo");

    const recharge = JSON.parse(localStorage.getItem("currentRecharge"));

    info.textContent = `Showing ${recharge.type.toUpperCase()} plans for ${recharge.operator} - ${recharge.mobile}`;

    try {
        let res = await fetch(API_URL);
        let plans = await res.json();

        // Filter by Prepaid/Postpaid type
        const filtered = plans.filter(plan => plan.type === recharge.type);

        filtered.forEach(plan => {
            const card = `
                <div class="p-4 bg-white shadow rounded mb-3">
                    <h3 class="text-xl font-bold">₹${plan.price}</h3>
                    <p>Validity: ${plan.validity}</p>
                    <p>Data: ${plan.data}</p>
                    <p>${plan.description}</p>

                    <button onclick="selectPlan(${plan.id})"
                        class="bg-blue-600 text-white px-4 py-1 rounded mt-2">
                        Select
                    </button>
                </div>
            `;
            container.innerHTML += card;
        });

        localStorage.setItem("apiPlans", JSON.stringify(plans));

    } catch (error) {
        document.getElementById("loading").textContent =
            "Error loading plans. Please check API URL.";
    }
}

// -------------------------------------------
// SELECT PLAN
// -------------------------------------------
function selectPlan(id) {
    localStorage.setItem("selectedPlan", id);
    window.location.href = "payment.html";
}

// -------------------------------------------
// PAYMENT PAGE (SHOW SELECTED PLAN)
// -------------------------------------------
async function loadSelectedPlan() {
    const id = localStorage.getItem("selectedPlan");

    let res = await fetch(`${API_URL}/${id}`);
    let plan = await res.json();

    document.getElementById("summary").innerHTML = `
        <h2 class="text-xl font-bold">₹${plan.price}</h2>
        <p><strong>Validity:</strong> ${plan.validity}</p>
        <p><strong>Data:</strong> ${plan.data}</p>
        <p>${plan.description}</p>
    `;
}

// -------------------------------------------
// COMPLETE PAYMENT
// -------------------------------------------
async function completeRecharge() {
    const id = localStorage.getItem("selectedPlan");
    let res = await fetch(`${API_URL}/${id}`);
    let plan = await res.json();

    const recharge = JSON.parse(localStorage.getItem("currentRecharge"));

    let history = getArray("rechargeHistory");

    history.push({
        date: new Date().toLocaleString(),
        mobile: recharge.mobile,
        operator: recharge.operator,
        price: plan.price,
        plan: plan.description
    });

    saveArray("rechargeHistory", history);

    window.location.href = "success.html";
}

// -------------------------------------------
// DASHBOARD HISTORY
// -------------------------------------------
function loadDashboardHistory() {
    let table = document.getElementById("historyTable");
    let history = getArray("rechargeHistory");

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

// -------------------------------------------
// END OF DAY 5 PROGRAM
// -------------------------------------------
