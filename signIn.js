document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('loginPassword').value;
  const error = document.getElementById('loginError');

  const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  if (!isValid) {
    error.textContent = 'Password must meet the requirements.';
    return;
  }

  

  const email = `${username}@example.com`; 
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  window.signInOtp = otp;

  try {
    await emailjs.send('service_oz95bhk', 'template_j039gcr', {
      to_name: username,
      to_email: email,
      otp_code: otp,
    });

    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('otpSection').style.display = 'block';
  } catch (err) {
    error.textContent = 'Failed to send OTP. Try again.';
  }
});

document.getElementById('verifySignInOtpBtn').onclick = function (e) {
  e.preventDefault();
  const enteredOtp = document.getElementById('signInOtpInput').value;

  if (enteredOtp === window.signInOtp) {
    const username = document.getElementById('username').value;
    localStorage.setItem('enormicoUser', username);
    window.location.href = 'home.html';
  } else {
    document.getElementById('loginError').textContent = 'Invalid OTP.';
  }
};
