const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add Task
router.post("/add-task", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = await Task.create({ userId: req.user.userId, title, description });
        res.status(201).json({ task, message: "Task created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error creating task" });
    }
});

// Get Tasks
router.get("/get-tasks", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        res.json({ tasks, message: tasks.length ? "All Tasks fetched successfully" : "No Task Found" });
    } catch (error) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
});

// Edit Task
router.put("/edit-task/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ message: `Task '${task.title}' updated successfully`, task });
    } catch (error) {
        res.status(500).json({ error: "Error updating task" });
    }
});

// Delete Task
router.delete("/delete-task/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ message: `Task '${task.title}' deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: "Error deleting task" });
    }
});

module.exports = router;
