import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';

function verifyUserToken(req, res, next) {
  const token = req.cookies.access_token;

  jwt.verify(token, TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid token' });
    }
    res.locals.user = decoded;
    next();
  });
}

export { verifyUserToken };
