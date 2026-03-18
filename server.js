const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables from .env
const pool = require("./db"); // Import the database connection
const PORT = process.env.PORT || 3000;
const servicesRouter = require("./routes/api/services");
const usersRouter = require("./routes/api/users");
const salesRouter = require("./routes/api/sales");

// Middleware
app.use(express.static("public"));
app.use("/cashier", express.static("cashier"));
app.use("/admin", express.static("admin"));
app.use(express.json());
app.use("/api/admin/services", servicesRouter); //same route used for cashiers as well since they also need to fetch services for sales
app.use("/api/admin/users", usersRouter);
app.use("/api/sales", salesRouter); // same router used for admins and cashiers since they both need to fetch sales data for the dashboard

// API endpoint to get cashier users
app.get("/api/cashiers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username FROM users WHERE role = 'cashier' ORDER BY username ASC",
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching cashiers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cashier data",
    });
  }
});

//authentication endpoint
app.post("/api/authenticate", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Query database for user
    const result = await pool.query(
      "SELECT id, username, password, role FROM users WHERE username = $1 AND role IN ($2, $3)",
      [username, "cashier", "admin"],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    // Compare password (assuming passwords are hashed in database)
    const isPasswordValid = password === user.password; // Replace with proper hash comparison in production

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      message: "Authentication successful",
      data1: {
        id: user.id,
        username: user.username,
        role: user.role,
        
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
});

//main route to serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
