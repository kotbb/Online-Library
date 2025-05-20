document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('error-message');
  const maxAttempts = 3;
  let attempts = 0;

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

      try {
        const response = await fetch(loginForm.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });

        const data = await response.json();

        if (response.ok) {
          if (data.redirect_url) {
            window.location.href = data.redirect_url;
          }
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            errorMessage.textContent = 'Too many failed attempts. Please try again later.';
            loginForm.querySelector('button').disabled = true;
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          } else {
            errorMessage.textContent = data.error || `Invalid credentials. ${maxAttempts - attempts} attempts remaining.`;
          }
        }
      } catch (error) {
        errorMessage.textContent = 'Network error. Please try again.';
      }
    });
  }
});