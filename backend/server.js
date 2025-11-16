import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import prisma from "./prismaClient.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =========================
//        ROUTES
// =========================

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.tasks.findMany({
      orderBy: { id: "desc" },
    });

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title.trim()) {
      return res.status(400).json({ error: "Title required" });
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        due_date: dueDate,
        priority,
      },
    });

    res.json(task);
  } catch (err) {
    console.error("Error adding task:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, completed } = req.body;

    const task = await prisma.tasks.update({
      where: { id: Number(id) },
      data: {
        title: title || undefined,
        description: description || undefined,
        due_date: dueDate || undefined,
        priority: priority || undefined,
        completed: completed ?? undefined,
      },
    });

    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err.message);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(500).json({ error: "Database update failed" });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.tasks.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err.message);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
