// Password validation logic
const passwordInput = document.getElementById('password');
const requirements = {
  length: document.getElementById('length'),
  uppercase: document.getElementById('uppercase'),
  lowercase: document.getElementById('lowercase'),
  number: document.getElementById('number'),
  special: document.getElementById('special'),
};

passwordInput.addEventListener('input', function () {
  const value = passwordInput.value;
  // Length
  if (value.length >= 8) {
    requirements.length.classList.remove('invalid');
    requirements.length.classList.add('valid');
    requirements.length.textContent = '✔ At least 8 characters';
  } else {
    requirements.length.classList.remove('valid');
    requirements.length.classList.add('invalid');
    requirements.length.textContent = '❌ At least 8 characters';
  }
  // Uppercase
  if (/[A-Z]/.test(value)) {
    requirements.uppercase.classList.remove('invalid');
    requirements.uppercase.classList.add('valid');
    requirements.uppercase.textContent = '✔ One uppercase letter';
  } else {
    requirements.uppercase.classList.remove('valid');
    requirements.uppercase.classList.add('invalid');
    requirements.uppercase.textContent = '❌ One uppercase letter';
  }
  // Lowercase
  if (/[a-z]/.test(value)) {
    requirements.lowercase.classList.remove('invalid');
    requirements.lowercase.classList.add('valid');
    requirements.lowercase.textContent = '✔ One lowercase letter';
  } else {
    requirements.lowercase.classList.remove('valid');
    requirements.lowercase.classList.add('invalid');
    requirements.lowercase.textContent = '❌ One lowercase letter';
  }
  // Number
  if (/[0-9]/.test(value)) {
    requirements.number.classList.remove('invalid');
    requirements.number.classList.add('valid');
    requirements.number.textContent = '✔ One number';
  } else {
    requirements.number.classList.remove('valid');
    requirements.number.classList.add('invalid');
    requirements.number.textContent = '❌ One number';
  }
  // Special character
  if (/[^A-Za-z0-9]/.test(value)) {
    requirements.special.classList.remove('invalid');
    requirements.special.classList.add('valid');
    requirements.special.textContent = '✔ One special character';
  } else {
    requirements.special.classList.remove('valid');
    requirements.special.classList.add('invalid');
    requirements.special.textContent = '❌ One special character';
  }
});

// EmailJS global usage
(function(){
  if (window.emailjs) {
    emailjs.init('H-6A32KO1Z6iOewY8'); 
  }
})();

const registerForm = document.getElementById('registerForm');
const otpSection = document.getElementById('otpSection');
const otpInput = document.getElementById('otpInput');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const registerError = document.getElementById('registerError');
let generatedOtp = '';
let userEmail = '';

registerForm.onsubmit = async function (e) {
  e.preventDefault();
  const dob = new Date(document.getElementById('dob').value);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  if (age < 18) {
    registerError.textContent = 'You must be at least 18 years old to register.';
    return;
  }
  // Password requirements
  const password = passwordInput.value;
  if (!(
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )) {
    registerError.textContent = 'Password does not meet all requirements.';
    return;
  }
  registerError.textContent = '';
  // Generate OTP
  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  userEmail = registerForm.email.value;
  // Send OTP using EmailJS
  if (window.emailjs) {
    try {
      await emailjs.send('service_oz95bhk', 'template_j039gcr', {
        to_email: userEmail,
        otp: generatedOtp,
        user_name: registerForm.name.value // Add the user's name for personalization iykyk
      });
      registerForm.style.display = 'none';
      otpSection.style.display = 'block';
    } catch (err) {
      registerError.textContent = 'Failed to send OTP. Please try again.';
    }
  } else {
    registerError.textContent = 'EmailJS is not loaded.';
  }
};

verifyOtpBtn.onclick = function (e) {
  e.preventDefault();
  if (otpInput.value === generatedOtp) {
    window.location.href = 'home.html';
  } else {
    registerError.textContent = 'Invalid OTP. Please try again.';
  }
};
