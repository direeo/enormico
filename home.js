if (!localStorage.getItem("enormicoUser")) {
  window.location.href = "signIn.html";
}


function calculateROI() {
  const range = document.getElementById("investmentRange").value;
  const roiBox = document.getElementById("roiResult");

  let message = "";
  switch (range) {
    case "range1":
      message = "You selected ₦50,000 – ₦500,000 with an ROI of 17%.";
      break;
    case "range2":
      message = "You selected ₦500,000 – ₦2,000,000 with an ROI of 25%.";
      break;
    default:
      message = "Please select a valid investment range.";
  }

  roiBox.textContent = message;
  roiBox.style.display = "block";
  roiBox.style.animation = "fadeIn 0.5s ease-out";
}

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("enormicoUser");
  const nameEl = document.getElementById("userName");

  if (name && nameEl) {
    nameEl.textContent = name + "!";
  }

  const logoutBtn = document.getElementById("logoutLink");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("enormicoUser");
      window.location.href = "signIn.html";
    });
  }
});


