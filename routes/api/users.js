const express = require("express");
const router = express.Router();
const { createUser, getAllUsers, deleteUser } = require("../models/users");

// POST /api/admin/users - Create new user
router.post("/", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const newUser = await createUser({
      username,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
});

// GET /api/admin/users - Get all users
router.get("/", async (req, res) => {
  try {
    const services = await getAllUsers();

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
});

// DELETE /api/admin/users/:id - Delete user by ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await deleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
});

module.exports = router;
