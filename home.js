document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }


  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("mouseenter", () => {
      const menu = dropdown.querySelector(".dropdown-menu");
      if (menu) {
        const rect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        if (rect.right > viewportWidth) {
          menu.style.left = "auto";
          menu.style.right = "0";
        } else {
          menu.style.left = "0";
          menu.style.right = "auto";
        }
      }
    });
  });

  const userNameSpan = document.getElementById("userName");
  const storedUsername = localStorage.getItem("enormicoUser") || "Investor";
  if (userNameSpan) userNameSpan.textContent = storedUsername;


  const dashboardLink = document.getElementById("dashboardLink");
  const logoutLink = document.getElementById("logoutLink");

  if (dashboardLink) {
    dashboardLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Logging out...");
      localStorage.removeItem("username");
      window.location.href = "index.html";
    });
  }
});
