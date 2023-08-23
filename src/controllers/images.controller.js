import path from 'path';
import fs from 'fs/promises';
import { get__dirname } from '../functions/get__.js';

const __dirname = get__dirname(import.meta.url);

async function createImage(req, res) {
  const response = {
    message: 'Save image',
    data: null,
    error: null,
  };

  const file = req.files?.file;
  const { email } = req.body;

  if (!file || !email) {
    response.error = 'Missing required parameters';
    return res.status(400).send(response);
  }

  const { ext } = path.parse(file.name);
  const fileName = email + Date.now() + ext;
  const folder = path.join(__dirname, '..', 'public', 'images');

  // guarda la imagen
  try {
    await fs.writeFile(path.join(folder, fileName), file.data);
  } catch (error) {
    console.log(error);
    response.error = 'Error saving images';
    return res.status(500).send(response);
  }

  const image_url = `http://${req.headers.host}/images/${fileName}`;

  response.data = { image_url };
  res.status(201).send(response);
}

export { createImage };
