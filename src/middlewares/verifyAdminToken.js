import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';

function verifyAdminToken(req, res, next) {
  const token = req.cookies.access_token;

  // verifica token
  jwt.verify(token, TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }
    // verifica si es administrador (id_rol 1)
    if (decoded.id_rol != 1) {
      return res.status(403).send({ error: 'Not enough privileges' });
    }
    res.locals.user = decoded;
    next();
  });
}

export { verifyAdminToken };
