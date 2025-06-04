document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('loginPassword').value;
  const error = document.getElementById('loginError');

  const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  if (!isValid) {
    error.textContent = 'Password must be 8+ chars, include uppercase, lowercase, number, and special character.';
    return;
  }

  localStorage.setItem('enormicoUser', username);

  window.location.href = 'home.html';
});
