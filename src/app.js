import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileupload from 'express-fileupload';
import apiRouter from './routes/api/index.js';
import authRouter from './routes/auth/index.js';
import pagesRouter from './routes/pages/index.js';

const app = express();

// setup de handlebars
app.set('view engine', 'hbs');
app.set('views', 'src/views');

// middlewares
app.use(morgan('dev'));
app.use(cors());
// guardaremos el jwt en las cookies para saber si el usuario esta logeado antes de renderizar las vistas
app.use(cookieParser());
app.use(express.json());
// usaremos urlencoded para leer la informacion enviada en el body junto al archivo de la imagen
app.use(express.urlencoded({ extended: false }));
app.use(
  fileupload()
  //   {
  //   limits: {
  //     fileSize: 5000000, //5mb
  //   },
  //   abortOnLimit: true,
  // }
);
app.use(express.static('src/public'));

// rutas
app.use('/api', apiRouter);
app.use('/auth', authRouter); // rutas para renderizar signup, login y para hacer logout
app.use('/', pagesRouter); // rutas para renderizar las paginas

export default app;
