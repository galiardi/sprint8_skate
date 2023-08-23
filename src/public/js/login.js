const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  e.preventDefault();
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const { error } = await response.json();

    if (error) {
      alert(error);
      return;
    }

    window.location.href = '/';
  } catch (error) {
    alert(error);
  }
});
