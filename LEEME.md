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

# Crear un administrador

Existen rutas a las que sólo puede acceder el administrador. Estas rutas son precedidas por el middelware verifyAdminToken, el cual, además de validar el token, valida que el rol del usuario sea 1 (admin). Por defecto los usuarios se crean con rol 2 (user). Para crear un usuario con rol admin, se debe proporcionar la propiedad root_key en el body.

Ejemplo con Postman:

(POST)

```
http://localhost:3000/api/users/register-admin
```

(Body/raw/json:)

```
{
"name": "Pablo G",
"email": "pablog@gmail.com",
"password": "asdf1234",
"root_key": "root_key"
}
```

<br></br>

# Almacenamiento de JWT en el cliente

En un principio se enviaba el jwt en el body de la respuesta para que el cliente lo almacenara en el local storage. El cliente lo enviaba después al servidor en Headers/Authorization. Sin embargo, si un cliente ya logeado ingresaba al home escribiendo la direccion en el navegador, no se podía saber si ya estaba logueado, por carecer la petición de Headers. (Se necesitaba saber si estaba logueado o no, para hacer un renderizado diferente de la vista).

Por este motivo **se decidió guardar el jwt en las cookies**, así el jwt sería enviado automáticamente en cualquier petición.
<br></br>
