const pool = require('./db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all todos
const getAllTodos = async (userEmail) => {
  try {
    const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail]);
    return todos.rows;
  } catch (err) {
    console.error(err);
  }
};

// Create a new todo
const createTodo = async (userEmail, title, progress, date) => {
    const id = uuidv4();
    try {
      const newTodo = await pool.query(
        `INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`,
        [id, userEmail, title, progress, date]
      );
      return newTodo;
    } catch (err) {
      console.error(err);
    }
  };

  // Edit a todo
const editTodo = async (id, userEmail, title, progress, date) => {
    try {
      const editTodo = await pool.query(
        'UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5',
        [userEmail, title, progress, date, id]
      );
      return editTodo;
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a todo
const deleteTodo = async (id) => {
    try {
      const deleteTodo = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
      return deleteTodo;
    } catch (err) {
      console.error(err);
    }
  };

  // Signup
const signUp = async (email, password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
      const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`, [
        email,
        hashedPassword,
      ]);

      const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

      return { email, token };
    } catch (err) {
      console.error(err);
      if (err) {
        return { detail: err.detail };
      }
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const users = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (!users.rows.length) return { detail: 'User does not exist!' };

      const success = await bcrypt.compare(password, users.rows[0].hashed_password);
      const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });

      if (success) {
        return { email: users.rows[0].email, token };
      } else {
        return { detail: 'Login failed' };
      }
    } catch (err) {
      console.error(err);
    }
  };

  module.exports = {
    getAllTodos,
    createTodo,
    editTodo,
    deleteTodo,
    signUp,
    login,
  };
