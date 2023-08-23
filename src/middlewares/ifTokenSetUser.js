import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';

// Este middleware lo usamos antes de entrar al home, u otra pagina que modifique su renderizado si hay un usuario logeado
// Si hay un token valido en las cookies, guarda el payload en res.locals.user, si no, sigue adelante

function ifTokenSetUser(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) return next();

  jwt.verify(token, TOKEN_KEY, (err, decoded) => {
    if (err) {
      return next();
    }
    res.locals.user = decoded;
    next();
  });
}
export { ifTokenSetUser };
