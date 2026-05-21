const express = require("express");
const cors = require("cors");
const db = require("./config/database");

// PENTING: LOAD RELASI MODEL
require("./models");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile"); 
const recipeRoutes = require("./routes/recipe");
const savedRecipeRoutes = require("./routes/SavedRecipes");
const reviewRoutes = require("./routes/review");

const app = express();

app.use("/uploads", express.static("uploads"));

// middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// routes
app.use("/api", authRoutes);

app.use("/api/profile", profileRoutes); 

app.use("/api/recipes", recipeRoutes);

app.use("/api/saved-recipes", savedRecipeRoutes);

app.use("/api/reviews", reviewRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// database
db.authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("DB Error:", err));


app.post("/api/login", (req, res) => {
  res.send("LOGIN SERVER LANGSUNG");
});


app.listen(5000, () => {
  console.log("Server jalan di http://localhost:5000");
});