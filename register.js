const passwordInput = document.getElementById('password');
const length = document.getElementById('length');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const number = document.getElementById('number');
const special = document.getElementById('special');
const error = document.getElementById('registerError');

passwordInput.addEventListener('input', () => {
 passwordInput.addEventListener('input', () => {
  const value = passwordInput.value;

  updateRequirement(length, value.length >= 8);
  updateRequirement(uppercase, /[A-Z]/.test(value));
  updateRequirement(lowercase, /[a-z]/.test(value));
  updateRequirement(number, /[0-9]/.test(value));
  updateRequirement(special, /[!@#$%^&*(),.?":{}|<>]/.test(value));
});

function updateRequirement(element, conditionMet) {
  if (conditionMet) {
    element.className = 'valid';
    element.textContent = '✅ ' + element.textContent.slice(2);
  } else {
    element.className = 'invalid';
    element.textContent = '❌ ' + element.textContent.slice(2);
  }
}
});

document.getElementById('registerForm').onsubmit = function(e) {
  e.preventDefault();

  const dob = new Date(document.getElementById('dob').value);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

  if (age < 18) {
    error.textContent = 'You must be at least 18 years old to register.';
    return;
  }

  if (
    length.className !== 'valid' ||
    uppercase.className !== 'valid' ||
    lowercase.className !== 'valid' ||
    number.className !== 'valid' ||
    special.className !== 'valid'
  ) {
    error.textContent = 'Please meet all password requirements.';
    return;
  }

  
  error.textContent = '';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('otpSection').style.display = 'block';
  window.generatedOtp = '000000'; 
};

document.getElementById('verifyOtpBtn').onclick = function(e) {
  e.preventDefault();
  const otp = document.getElementById('otpInput').value;

  if (otp === window.generatedOtp) {
    const name = document.querySelector('input[name="name"]').value;
    localStorage.setItem('enormicoUser', name); // 
    window.location.href = 'home.html';
  } else {
    document.getElementById('registerError').textContent = 'Invalid OTP. Please try again.';
  }
};


