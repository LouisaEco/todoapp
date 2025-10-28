const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Connecting to PostgreSQL
const pool = new Pool({
  user: "postgres",     // your postgres username
  host: "localhost",
  database: "todo_db",  // your database name
  password: "12345678",  
  port: 5432,
});


pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    priority VARCHAR(10),
    completed BOOLEAN DEFAULT false
  );
`);

// Routes
app.get("/tasks", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
  res.json(result.rows);
});

app.post("/tasks", async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  if (!title.trim()) return res.status(400).json({ error: "Title required" });

  const result = await pool.query(
    "INSERT INTO tasks (title, description, due_date, priority) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, description, dueDate, priority]
  );
  res.json(result.rows[0]);
});

app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, completed } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           due_date = COALESCE($3, due_date),
           priority = COALESCE($4, priority),
           completed = COALESCE($5, completed)
       WHERE id = $6 
       RETURNING *`,
      [title, description, dueDate, priority, completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(500).json({ error: "Database update failed" });
  }
});


// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// to start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
