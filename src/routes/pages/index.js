import { Router } from 'express';
import { ifTokenSetUser } from '../../middlewares/ifTokenSetUser.js';
import { verifyUserToken } from '../../middlewares/verifyUserToken.js';
import { verifyAdminToken } from '../../middlewares/verifyAdminToken.js';

const router = Router();

// home // si usuario esta logeado modificamos el renderizado de la pagina (mainLayout.hbs)
router.get('/', ifTokenSetUser, (req, res) => {
  res.render('home', {
    title: 'Inicio',
    layout: 'layouts/mainLayout',
  });
});

// profile // si el token no es valido no permite entrar
router.get('/profile', verifyUserToken, (req, res) => {
  res.render('profile', {
    title: 'Mi perfil',
    layout: 'layouts/mainLayout',
  });
});

// admin-dashboard
router.get('/admin', verifyAdminToken, (req, res) => {
  res.render('admin', {
    title: 'Admin',
    layout: 'layouts/mainLayout',
  });
});

export default router;
