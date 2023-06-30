const express = require('express');
const cors = require('cors');
const app = express();
const repository = require('./repository');

app.use(cors());
app.use(express.json());

// Get all todos
app.get('/todos/:userEmail', async (req, res) => {
  const { userEmail } = req.params;
  const todos = await repository.getAllTodos(userEmail);
  res.json(todos);
});

// Create a new todo
app.post('/todos', async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  const newTodo = await repository.createTodo(user_email, title, progress, date);
  res.json(newTodo);
});

// Edit a todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  const editTodo = await repository.editTodo(id, user_email, title, progress, date);
  res.json(editTodo);
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const deleteTodo = await repository.deleteTodo(id);
  res.json(deleteTodo);
});

// Signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const signUpResponse = await repository.signUp(email, password);
  res.json(signUpResponse);
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const loginResponse = await repository.login(email, password);
  res.json(loginResponse);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
