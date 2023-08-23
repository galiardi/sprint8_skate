import { createServer } from 'http';
import app from './app.js';
import { PORT } from './config.js';

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
