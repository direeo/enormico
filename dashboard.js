document.addEventListener("DOMContentLoaded", () => {
  const usernameEl = document.getElementById("username");
  const storedUser = localStorage.getItem("enormicoUser") || localStorage.getItem("username") || "Guest";
  if (usernameEl) {
    usernameEl.textContent = storedUser;
  }

  const profileInput = document.getElementById("profilePicInput");
  const previewImg = document.getElementById("profilePreview");

  if (profileInput && previewImg) {
    profileInput.addEventListener("change", () => {
      const file = profileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Investments section
  const investments = JSON.parse(localStorage.getItem("investments")) || [];
  const list = document.getElementById("investmentList");
  list.innerHTML = ""; // Clear previous
  // Remove any previous empty message
  const parent = list.parentElement;
  const prevEmpty = parent.querySelector(".empty-investments-msg");
  if (prevEmpty) prevEmpty.remove();

  if (investments.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No ongoing investments yet.";
    emptyMsg.className = "empty-investments-msg";
    parent.appendChild(emptyMsg);
  } else {
    investments.forEach(investment => {
      const li = document.createElement("li");
      li.textContent = `₦${investment.amount.toLocaleString()} - ${investment.roi}% ROI - Status: ${investment.status}`;
      list.appendChild(li);
    });
  }
});

