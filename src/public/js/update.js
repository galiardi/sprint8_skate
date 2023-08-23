const updateForm = document.getElementById('update-form');

updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const repeatPassword = document.getElementById('repeat-password').value.trim();
  const experience = document.getElementById('experience').value.trim();
  const specialty = document.getElementById('specialty').value.trim();

  if (!name || !email || !password || !experience || !specialty)
    return alert('Faltan parámetros');
  if (password !== repeatPassword) return alert('Las contraseñas no coinciden');

  try {
    // la constante id_user es asignada en un script al renderizar la pagina (profile.hbs)
    const response = await fetch(`/api/users/${id_user}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        experience,
        specialty,
      }),
    });
    const { error } = await response.json();

    if (error) {
      alert(error);
      return;
    }

    alert('Usuario actualizado correctamente');
    window.location.href = '/';
  } catch (error) {
    alert(error);
  }
});
