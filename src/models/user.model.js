import { promisePool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';
import { sendEmail } from '../functions/sendEmail.js';
import { getRandomNumN } from '../functions/getRandomNum.js';
import { ROOT_KEY } from '../config.js';

class User {
  // state DEFAULT FALSE
  // image_url se seteara al subir una imagen
  constructor({
    id_user = null,
    name,
    email,
    password,
    experience = null,
    specialty = null,
    image_url = null,
    root_key = null,
  }) {
    this.id_user = id_user;
    this.name = name;
    this.email = email;
    this.password = password;
    this.experience = experience;
    this.specialty = specialty;
    this.image_url = image_url;
    this.id_rol = root_key === ROOT_KEY ? 1 : 2; // si se provee root_key, se crea un administrador, si no, un usuario
  }

  async create() {
    let conn = null;

    try {
      conn = await promisePool.getConnection();
      await conn.beginTransaction();

      const hashed_password = await bcrypt.hash(this.password, 10);

      const [result] = await conn.execute(
        'INSERT INTO users (name, email, password, experience, specialty, image_url, id_rol ) VALUES (?, ?, ?, ?, ?, ?, ?);',
        [
          this.name,
          this.email,
          hashed_password,
          this.experience,
          this.specialty,
          this.image_url,
          this.id_rol,
        ]
      );

      // solicita los datos del usuario para crear un token
      const [rows] = await conn.execute(
        `
        SELECT id_user, name, email, experience, specialty, image_url, state, id_rol 
        FROM users WHERE id_user = ?`,
        [result.insertId]
      );
      console.log(rows);
      // crea un token
      const token = jwt.sign(rows[0], TOKEN_KEY, { expiresIn: '1d' });

      await conn.commit();
      conn.release();
      return { token };
    } catch (error) {
      console.log(error);

      if (conn) {
        await conn.rollback();
        conn.release();
      }

      if (error.code === 'ER_DUP_ENTRY') return 'Email already exists'; // email UNIQUE
      return null;
    }
  }

  async create2() {
    try {
      const hashed_password = await bcrypt.hash(this.password, 10);

      const [result] = await promisePool.execute(
        'INSERT INTO users (name, email, password, experience, specialty, image_url, id_rol ) VALUES (?, ?, ?, ?, ?, ?, ?);',
        [
          this.name,
          this.email,
          hashed_password,
          this.experience,
          this.specialty,
          this.image_url,
          this.id_rol,
        ]
      );

      // solicita los datos del usuario para crear un token
      const [rows] = await promisePool.execute(
        `
        SELECT id_user, name, email, experience, specialty, image_url, state, id_rol 
        FROM users WHERE id_user = ?`,
        [result.insertId]
      );
      console.log(rows);
      // crea un token
      const token = jwt.sign(rows[0], TOKEN_KEY, { expiresIn: '1d' });

      return { token };
    } catch (error) {
      console.log(error);

      if (error.code === 'ER_DUP_ENTRY') return 'Email already exists'; // email UNIQUE
      return null;
    }
  }

  static async login({ email, password }) {
    try {
      // solicita el usuario a la base de datos
      const [rows] = await promisePool.execute(
        'SELECT id_user, name, email, password, specialty, experience, id_rol FROM users WHERE email = ?;',
        [email]
      );
      if (rows.length === 0) return false;

      // compara los passwords
      const hashed_password = rows[0].password;
      const passwordMatches = await bcrypt.compare(password, hashed_password);

      if (passwordMatches === false) return false;

      // crea un token
      delete rows[0].password;
      const token = jwt.sign(rows[0], TOKEN_KEY, { expiresIn: '1d' });

      return { token };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async recoverPassword(email) {
    try {
      const [rows] = await promisePool.execute('SELECT * FROM users WHERE email = ?;', [
        email,
      ]);
      if (rows.length === 0) return 'Email not found';

      // Creamos un password provisorio para enviar al cliente
      const tempPassword = String(getRandomNumN(6)); // numero aleatorio de 6 cifras (string)

      const hashed_password = await bcrypt.hash(tempPassword, 10);

      const [result] = await promisePool.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashed_password, email]
      );

      if (result.affectedRows !== 1) return null;

      await sendEmail({
        email: email,
        subject: 'Recuperacion de contrasena',
        message: `Su contrasena temporal es ${tempPassword}`,
      });

      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getAllUsers(user) {
    try {
      const [rows] = await promisePool.query(`
        SELECT id_user, image_url, name, experience, specialty, state FROM users WHERE id_rol = 2
      `);
      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update() {
    let conn = null;

    try {
      conn = await promisePool.getConnection();
      await conn.beginTransaction();

      const hashed_password = await bcrypt.hash(this.password, 10);

      // actauliza el usuario
      const [result] = await conn.execute(
        `
        UPDATE users SET name = ?, password = ?, experience = ?, specialty = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id_user = ?;`,
        [this.name, hashed_password, this.experience, this.specialty, this.id_user]
      );

      if (result.affectedRows === 0) {
        conn.commit(); // nos se hizo nada, de igual forma se cierra la transaccion
        conn.release(); // se cierra la coneccion
        return 'User not found';
      }

      // solicita los datos del usuario para crear el nuevo token
      const [rows] = await promisePool.execute(
        `
        SELECT id_user, name, email, experience, specialty, image_url, state, id_rol 
        FROM users WHERE id_user = ?`,
        [this.id_user]
      );

      // crea el nuevo token
      const token = jwt.sign(rows[0], TOKEN_KEY, { expiresIn: '1d' });

      await conn.commit();
      conn.release();
      return { token };
    } catch (error) {
      console.log(error);
      // conn podria ser null
      if (conn) {
        await conn.rollback();
        conn.release();
      }

      return null;
    }
  }

  static async updateState(id_user, state) {
    try {
      const [result] = await promisePool.execute(
        'UPDATE users SET state = ? WHERE id_user = ?',
        [state, id_user]
      );
      if (result.affectedRows === 0) {
        return 'User not found';
      }

      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Para poder pedir la informacion del usuario cuando, por ejemplo, se quiera mandar un mail de confirmacion
  static async getUserById(id_user) {
    try {
      const [rows] = await promisePool.execute('SELECT * from users WHERE id_user = ?', [
        id_user,
      ]);
      if (rows.length === 0) return null;
      return rows[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async deleteUser(id_user) {
    try {
      const [result] = await promisePool.execute('DELETE FROM users WHERE id_user = ?', [
        id_user,
      ]);
      if (result.affectedRows === 0) return 'User not found';
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export { User };
