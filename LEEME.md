# Iniciar la app

1.  Para crear la base de datos, ejecutar en **MySQL** las queries disponibles en el archivo **schema.sql**, ubicado en la raíz del proyecto.

2.  En el archivo **.env** disponible en la raíz del proyecto, modificar las variables **DB_USER** y **DB_PASSWORD** con sus valores locales.

3.  Instalar las dependencias:

```
npm install
```

4. Levantar servidor:

```
npm run dev
```

5. Visitar http://localhost:3000
   <br></br>

# Crear/actualizar un administrador

Existen rutas a las que sólo puede acceder el administrador. Estas rutas son precedidas por el middelware validateAdminToken, el cual, además de validar el token, valida que el rol del usuario sea 1 (admin). Por defecto los usuarios se crean o actualizan con rol 2 (user). Para crear o actualizar un usuario con rol admin, se debe proporcionar la propiedad root_key en el body:

```
"root_key": "root_key"
```

Ejemplo con Postman:

(POST)

```
http://localhost:3000/api/users/register
```

(Body/raw/json:)

```
{
"name": "Pablito",
"lastname": "Galiardi",
"rut": "11.111.111-1",
"email": "galiardi.dev@gmail.com",
"password": "asdf1234",
"root_key": "root_key"
}
```

<br></br>

# Consultas a la base de datos con mysql2

Como se comenta en https://github.com/sidorares/node-mysql2/issues/745,

```
await = pool.execute(query);
```

es equivalente a:

```
const conn = await pool.getConnection();
await conn.execute(query);
conn.release();
```

Considerando lo anterior, cuando sea posible se utilizará la primera alternativa con el objetivo de hacer el código más fácil de leer.
<br></br>

# Almacenamiento de JWT en el cliente

En un principio se enviaba el jwt en el body de la respuesta para que el cliente lo almacenara en el local storage. El cliente lo enviaba después al servidor en Headers/Authorization. Sin embargo, si un cliente ya logeado ingresaba al home escribiendo la direccion en el navegador, no se podía saber si ya estaba logueado, por carecer la petición de Headers. (Se necesitaba saber si estaba logueado o no, para hacer un renderizado diferente de la vista).

Por este motivo **se decidió guardar el jwt en las cookies**, así el jwt sería enviado automáticamente en cualquier petición.
<br></br>

# CSS

Se utiliza bootstrap para utilizar los componentes de bootstrap, como la barra de navegación. También se utiliza para dar estilo a los botones.

El layout de las páginas se realiza con CSS Flexbox y/o CSS Grid, además del uso de media queries.

Se han creado las clases **"container-column-row"** y **"container-column"**.
**La primera**, utiliza "flex-direction: column" hasta 576px y "flex-direcction: row" en pantallas mas grandes.
**La segunda** utiliza siempre "flex direction-column". Una de estas dos clases se utiliza para envolver el contenido de las distintas vistas, antes de ser envueltas por el layout.

El breakpoint utilizado(576px) coincide con el breakpoint **sm** de bootstrap.
<br></br>

# Aclaración sobre la estructura del HTML

Las páginas presentan la siguiente organización general:

```
<nav></nav>
<main>
<header></header>
</main>
<footer></footer>
```

La barra de navegación y el footer son renderizados en el layout, mientras que el main es renderizado por las vistas parciales. El header se ha incluido dentro del main, lo cual rompe con la estructura tradicional, pero nos resulta práctico en este proyecto.

Las páginas de autenticación no incluyen barra de navegación.
<br></br>
