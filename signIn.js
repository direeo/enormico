const loginForm = document.getElementById('loginForm');
const otpSection = document.getElementById('otpSection');
const loginError = document.getElementById('loginError');
const verifySignInOtpBtn = document.getElementById('verifySignInOtpBtn');
const signInOtpInput = document.getElementById('signInOtpInput');
let currentUsername = "";
let currentUserEmail = "";
let currentUserName = "";
let generatedOtp = "";

// Make sure EmailJS is initialized in your index.html
// <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
// <script>emailjs.init("YOUR_EMAILJS_USER_ID");</script>

loginForm.onsubmit = async function(e) {
  e.preventDefault();
  loginError.textContent = "";
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('loginPassword').value;

  // Send username and password to backend to verify
  const res = await fetch('http://localhost:3001/api/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();

  if (!data.success) {
    loginError.textContent = data.error || "Login failed.";
    return;
  }

  // Get user details for EmailJS
  currentUsername = username;
  currentUserEmail = data.user.email;
  currentUserName = data.user.name || data.user.username || username;

  // Generate OTP
  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Send OTP via EmailJS (same template as register page)
  emailjs.send("service_oz95bhk", "template_j039gcr", {
    to_email: currentUserEmail,
    otp: generatedOtp,
    user_name: currentUserName
  }).then(function() {
    otpSection.style.display = "block";
    loginForm.style.display = "none";
  }, function(error) {
    loginError.textContent = "Failed to send OTP email.";
  });
};

verifySignInOtpBtn.onclick = function() {
  loginError.textContent = "";
  const otp = signInOtpInput.value.trim();

  if (otp === generatedOtp) {
    localStorage.setItem("enormicoUser", currentUsername);
    localStorage.setItem("enormicoUserEmail", currentUserEmail);
    window.location.href = "dashboard.html";
  } else {
    loginError.textContent = "Invalid OTP.";
  }
};