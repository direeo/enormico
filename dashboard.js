// Load username from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const usernameEl = document.getElementById("username");
  const storedUser = localStorage.getItem("enormicoUser");
  if (storedUser && usernameEl) {
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
});
