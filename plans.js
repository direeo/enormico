const amountInput = document.getElementById("amount");
const summary = document.querySelector(".summary");
const getMatchedBtn = document.getElementById("getMatchedBtn");
const investWhollyBtn = document.getElementById("investWhollyBtn");
const viewMatchesBtn = document.getElementById("viewMatchesBtn");
const planSelect = document.getElementById("planSelect");
const waitingRoomSection = document.getElementById("waitingRoomSection");
const waitingRoomList = document.getElementById("waitingRoomList");
const closeWaitingRoomBtn = document.getElementById("closeWaitingRoomBtn");

let selectedPlan = null;

const tierCapacities = { 10: 5, 12: 4, 14: 3, 16: 3, 18: 2 };
let tierUsage = JSON.parse(localStorage.getItem("tierUsage")) || { 10: 0, 12: 0, 14: 0, 16: 0, 18: 0 };

planSelect.addEventListener("change", () => {
  const selectedOption = planSelect.selectedOptions[0];
  selectedPlan = {
    rate: parseInt(selectedOption.value),
    min: parseInt(selectedOption.dataset.min),
    max: parseInt(selectedOption.dataset.max)
  };
  updateSummary();
});

amountInput.addEventListener("input", updateSummary);

function updateSummary() {
  const amount = parseFloat(amountInput.value);
  if (!selectedPlan || isNaN(amount)) {
    summary.textContent = '';
    getMatchedBtn.classList.add("hidden");
    investWhollyBtn.classList.add("hidden");
    return;
  }

  const earnings = (selectedPlan.rate / 100) * amount;

  if (amount >= selectedPlan.min && amount <= selectedPlan.max) {
    summary.textContent = `You qualify for ${selectedPlan.rate}% ROI. Earnings: ₦${earnings.toLocaleString()}`;
    getMatchedBtn.classList.remove("hidden");
    investWhollyBtn.classList.remove("hidden");
  } else if (amount < selectedPlan.min) {
    summary.textContent = `Needs ₦${(selectedPlan.min - amount).toLocaleString()} more to qualify. Potential earnings: ₦${earnings.toLocaleString()}`;
    getMatchedBtn.classList.remove("hidden");
    investWhollyBtn.classList.add("hidden");
  } else {
    summary.textContent = `Amount too high. Try a higher tier or reduce your investment.`;
    getMatchedBtn.classList.add("hidden");
    investWhollyBtn.classList.add("hidden");
  }
}

// Invest Wholly logic with Flutterwave integration
investWhollyBtn.addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  if (!selectedPlan || isNaN(amount) || amount < selectedPlan.min || amount > selectedPlan.max) {
    alert("Please enter a valid amount and choose a plan.");
    return;
  }

  // Get user email or fallback
  let userEmail = localStorage.getItem("enormicoUserEmail") || "test@example.com";
  let userName = localStorage.getItem("enormicoUser") || "Enormico User";

  // FLUTTERWAVE PAYMENT
  FlutterwaveCheckout({
    public_key: 'FLWPUBK_TEST-1bdeca2aafdbb93da95d5bea96622e6a-X', // <-- Replace with your real key
    tx_ref: 'ENM-' + Date.now(),
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,banktransfer',
    customer: {
      email: userEmail,
      name: userName
    },
    customizations: {
      title: 'Enormico Investment',
      description: `${selectedPlan.rate}% ROI Plan`,
      logo: 'enormino.jpeg'
    },
    callback: function(response) {
      if (response.status === 'successful') {
        // Save investment only if payment is successful
        const investment = {
          id: generateId(),
          amount: amount,
          roi: selectedPlan.rate,
          status: "Invested",
          timestamp: new Date().toISOString(),
          type: "wholly",
          paymentRef: response.transaction_id
        };
        const previous = JSON.parse(localStorage.getItem("investments")) || [];
        previous.push(investment);
        localStorage.setItem("investments", JSON.stringify(previous));
        tierUsage[selectedPlan.rate]++;
        localStorage.setItem("tierUsage", JSON.stringify(tierUsage));
        alert("Payment successful! Investment recorded.");
        window.location.href = "dashboard.html";
      } else {
        alert("Payment not completed. Please try again.");
      }
    },
    onclose: function() {
      // Optionally handle modal close
    }
  });
});

// Helper to get or prompt for user email
function getUserEmail() {
  let email = localStorage.getItem("enormicoUserEmail");
  if (!email) {
    email = prompt("Enter your email for payment receipt:");
    if (email) localStorage.setItem("enormicoUserEmail", email);
  }
  return email || "test@example.com";
}

// Match with Someone logic with Flutterwave payment
getMatchedBtn.addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);
  if (!selectedPlan || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount and choose a plan.");
    return;
  }
  let userEmail = getUserEmail();
  let userName = localStorage.getItem("enormicoUser") || "Enormico User";

  FlutterwaveCheckout({
    public_key: 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx-X', // <-- Replace with your real key
    tx_ref: 'ENM-MATCH-' + Date.now(),
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,banktransfer',
    customer: {
      email: userEmail,
      name: userName
    },
    customizations: {
      title: 'Enormico Match Investment',
      description: `${selectedPlan.rate}% ROI Plan (Match)`,
      logo: 'enormino.jpeg'
    },
    callback: function(response) {
      if (response.status === 'successful') {
        // Add to waiting room only if payment is successful
        const matchRequest = {
          id: generateId(),
          amount: amount,
          roi: selectedPlan.rate,
          status: "Waiting",
          timestamp: new Date().toISOString(),
          type: "match",
          paymentRef: response.transaction_id
        };
        addToWaitingRoom(matchRequest);
        alert("Payment successful! You have been added to the waiting room.");
        showWaitingRoom();
      } else {
        alert("Payment not completed. Please try again.");
      }
    },
    onclose: function() {}
  });
});

function generateId() {
  return 'ENM-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function addToWaitingRoom(entry) {
  const waiting = JSON.parse(localStorage.getItem("waitingRoom")) || [];
  waiting.push(entry);
  localStorage.setItem("waitingRoom", JSON.stringify(waiting));
}

function showWaitingRoom() {
  waitingRoomSection.classList.remove("hidden");
  updateWaitingRoomList();
}

function updateWaitingRoomList() {
  const waiting = JSON.parse(localStorage.getItem("waitingRoom")) || [];
  waitingRoomList.innerHTML = "";
  if (waiting.length === 0) {
    waitingRoomList.innerHTML = '<li>No one is currently waiting for a match.</li>';
    return;
  }
  waiting.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `ID: ${entry.id} | ₦${entry.amount.toLocaleString()} | ${entry.roi}% ROI | Status: ${entry.status}`;
    waitingRoomList.appendChild(li);
  });
}

viewMatchesBtn.addEventListener("click", showWaitingRoom);
closeWaitingRoomBtn.addEventListener("click", () => {
  waitingRoomSection.classList.add("hidden");
});
