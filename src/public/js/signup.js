const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const repeatPassword = document.getElementById('repeat-password').value.trim();
  const experience = document.getElementById('experience').value.trim();
  const specialty = document.getElementById('specialty').value.trim();

  const file = document.getElementById('file').files[0];

  if (!name || !email || !password || !experience || !specialty)
    return alert('Faltan parámetros');
  if (password !== repeatPassword) return alert('Las contraseñas no coinciden');
  if (!file) return alert('Debe seleccionar un archivo');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', email);

  try {
    const response1 = await fetch('/api/images', {
      method: 'POST',
      body: formData,
    });
    const { data, error } = await response1.json();

    if (error) return alert(error);

    const response2 = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        experience,
        specialty,
        image_url: data.image_url,
      }),
    });

    const { error: error2 } = await response2.json();

    if (error2) return alert(error2);

    alert('Usuario registrado correctamente');
    window.location.href = '/';
  } catch (error) {
    alert(error);
  }
});
