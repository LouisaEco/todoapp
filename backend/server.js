import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import prisma from "./prismaClient.js";
import authRoutes from "./routes/auth.js";

const app = express();

// =========================
//       MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json()); // REQUIRED for req.body
app.use("/auth", authRoutes); // Auth routes

// =========================
//        TASK ROUTES
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

    if (!title?.trim()) {
      return res.status(400).json({ error: "Title required" });
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        due_date: dueDate ? new Date(dueDate) : null,
        priority,
      },
    });

    res.json(task);
  } catch (err) {
    console.error("Error adding task:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, completed } = req.body;

    const task = await prisma.tasks.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        due_date: dueDate ? new Date(dueDate) : undefined,
        priority,
        completed,
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

// Delete task
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
