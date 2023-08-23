const usersDiv = document.getElementById('users');

const data = await getData();
renderUsers(data);

async function getData() {
  const response = await fetch('/api/users');
  const { data, error } = await response.json();
  if (error) return console.log(error);
  console.log(data);
  return data;
}

function renderUsers(data) {
  const users = data.map((user) => {
    const { image_url, name, experience, specialty, state } = user;
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
      <td class="text-success font-weight-bold">${state ? 'Aprobado' : 'En Revisión'}</td>
    </tr>
    `;
  });

  usersDiv.innerHTML = users.join('');
}
