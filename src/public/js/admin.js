const usersDiv = document.getElementById('users');

const data = await getData();
renderUsers(data);

window.updateUser = async (checkbox, id_user) => {
  const state = checkbox.checked;

  const response = await fetch(`/api/users/update-state/${id_user}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });
  const { error } = await response.json();

  if (error) return alert(error);

  alert(`Estado del usuario actualizado a ${state ? 'Aprobado' : 'En revisión'}`);
};

async function getData() {
  const response = await fetch('/api/users');
  const { data, error } = await response.json();
  if (error) return console.log(error);
  console.log(data);
  return data;
}

function renderUsers(data) {
  const users = data.map((user) => {
    const { image_url, name, experience, specialty, id_user } = user;
    return `
    <tr>
      <th scope="row">1</th>
      <td>
        <div>
          <img src="${image_url}" alt="foto del skater" class="img-fluid" />   
        </div>
      </td>
      <td>${name}</td>
      <td>${experience}</td>
      <td>${specialty}</td>
      <td>
        <input onclick="updateUser(this, ${id_user})" type="checkbox" checked />
      </td>
    </tr>
    `;
  });

  usersDiv.innerHTML = users.join('');
}
