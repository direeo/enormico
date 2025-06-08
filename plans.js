const amountInput = document.getElementById("amount");
const cards = document.querySelectorAll(".plan-card");
const summary = document.getElementById("summary");
const getMatchedBtn = document.getElementById("getMatchedBtn");

let selectedPlan = null;

cards.forEach(card => {
  card.addEventListener("click", () => {
    cards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    selectedPlan = {
      rate: parseFloat(card.dataset.rate),
      min: parseInt(card.dataset.min),
      max: parseInt(card.dataset.max),
    };

    updateSummary();
  });
});

amountInput.addEventListener("input", updateSummary);

function updateSummary() {
  const amount = parseFloat(amountInput.value);
  if (!selectedPlan || isNaN(amount)) {
    summary.textContent = "";
    getMatchedBtn.classList.add("hidden");
    return;
  }

  const earnings = (selectedPlan.rate / 100) * amount;

  if (amount >= selectedPlan.min && amount <= selectedPlan.max) {
    summary.innerHTML = `✅ You're eligible for <strong>${selectedPlan.rate}% ROI</strong>. You’ll earn ₦${earnings.toLocaleString()}.`;
  } else if (amount < selectedPlan.min) {
    const needed = selectedPlan.min - amount;
    summary.innerHTML = `🔗 You'll be matched with someone else. You need ₦${needed.toLocaleString()} more to qualify for this tier.<br><strong>Your earnings: ₦${earnings.toLocaleString()}</strong>`;
  } else {
    summary.innerHTML = `⚠️ Your amount exceeds the selected plan. Please choose a higher plan or lower your input.`;
  }

  getMatchedBtn.classList.remove("hidden");
}

getMatchedBtn.addEventListener("click", () => {
  const amount = parseFloat(amountInput.value);

  if (!selectedPlan || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount and select a plan.");
    return;
  }

  const investment = {
    amount: amount,
    roi: selectedPlan.rate,
    status: "Pending",
    timestamp: new Date().toISOString()
  };

  const previous = JSON.parse(localStorage.getItem("investments")) || [];
  previous.push(investment);
  localStorage.setItem("investments", JSON.stringify(previous));

  alert("You’ve been matched successfully! Redirecting...");
  window.location.href = "dashboard.html";
});

