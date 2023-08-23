import { User } from '../models/user.model.js';

async function registerUser(req, res) {
  const response = {
    message: 'Register user',
    data: null,
    error: null,
  };

  // id_rol (ver user.model.js)
  const { name, email, password, experience, specialty, image_url } = req.body;
  if (!name || !email || !password || !experience || !specialty || !image_url) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const user = new User(req.body);
  const result = await user.create();

  if (result === null) {
    response.error = 'Error registering user';
    return res.status(500).send(response);
  }

  if (result === 'Email already exists') {
    response.error = result;
    return res.status(409).send(response);
  }

  response.data = true;
  // setea el token en las cookies del cliente
  res
    .cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .send(response);
}

async function registerAdmin(req, res) {
  const response = {
    message: 'Register admin',
    data: null,
    error: null,
  };

  // id_rol (ver user.model.js)
  const { name, email, password, root_key } = req.body;
  if (!name || !email || !password || !root_key) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const user = new User(req.body);
  const result = await user.create();

  if (result === null) {
    response.error = 'Error registering admin';
    return res.status(500).send(response);
  }

  if (result === 'Email already exists') {
    response.error = result;
    return res.status(409).send(response);
  }

  response.data = true;
  // setea el token en las cookies del cliente
  res
    .cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .send(response);
}

async function login(req, res) {
  const response = {
    message: 'Login user',
    data: null,
    error: null,
  };

  const { email, password } = req.body;
  if (!email || !password) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const result = await User.login(req.body);

  if (result === null) {
    response.error = 'Error logging in user';
    return res.status(500).send(response);
  }

  if (result === false) {
    response.error = 'Invalid email or password';
    return res.status(401).send(response);
  }

  response.data = true;
  // setea el token en las cookies del cliente
  res
    .cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .send(response);
}

async function recoverPassword(req, res) {
  const response = {
    message: 'Recover password',
    data: null,
    error: null,
  };

  const { email } = req.body;
  if (!email) {
    response.error = 'Missing required parameter';
    return res.status(400).send(response);
  }

  const result = await User.recoverPassword(email);

  if (result === null) {
    response.error = 'Error recovering password';
    return res.status(500).send(response);
  }

  if (result === 'User not found') {
    response.error = result;
    return res.status(404).send(response);
  }

  response.data = `Password sent to ${email}`;
  res.status(200).send(response);
}

async function getAllUsers(req, res) {
  const response = {
    message: 'Get all users',
    data: null,
    error: null,
  };

  const result = await User.getAllUsers();

  if (result === null) {
    response.error = 'Error getting all users';
    return res.status(500).send(response);
  }

  response.data = result;
  return res.status(200).send(response);
}

async function updateUser(req, res) {
  const response = {
    message: 'Update user',
    data: null,
    error: null,
  };

  const { userId } = req.params;

  //valida existencia de parametros
  const { name, password, experience, specialty } = req.body;
  if (!name || !password || !experience || !specialty) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const user = new User({ id_user: userId, ...req.body });
  const result = await user.update();

  if (result === null) {
    response.error = 'Error updating user';
    return res.status(500).send(response);
  }

  if (result === 'User not found') {
    response.error = result;
    return res.status(400).send(response);
  }

  response.data = true;
  // setea el token en las cookies del cliente
  return res
    .cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .send(response);
}

async function updateState(req, res) {
  const response = {
    message: 'Update user',
    data: null,
    error: null,
  };

  const { userId } = req.params;

  const { state } = req.body;

  //valida existencia de parametros
  if (!Object.keys(req.body).includes('state')) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const result = await User.updateState(userId, state);

  if (result === null) {
    response.error = 'Error updating user state';
    return res.status(500).send(response);
  }

  if (result === 'User not found') {
    response.error = result;
    return res.status(400).send(response);
  }

  response.data = true;
  return res.status(200).send(response);
}

async function deleteUser(req, res) {
  const response = {
    message: 'Delete user',
    data: null,
    error: null,
  };

  const { userId } = req.params;

  const result = await User.delete(userId);

  if (result === null) {
    response.error = 'Error deleting user';
    return res.status(500).send(response);
  }

  if (result === 'User not found') {
    response.error = result;
    return res.status(404).send(response);
  }

  response.data = true;
  return res.status(200).send(response);
}

export {
  registerUser,
  registerAdmin,
  login,
  recoverPassword,
  getAllUsers,
  updateUser,
  updateState,
  deleteUser,
};

// PENDIENTE: crear updateAdmin. Por el momento un admin se puede actualizar proporcionando la root_key en el body enviado a la ruta updateUser. Si no proporciona el root_key, pierde su calidad de admin

// PENDIENTE: state null, false al crear un usuario, null al crear un admin
