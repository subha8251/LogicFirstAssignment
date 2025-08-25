const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const connectDB = require("./config/db");
const propertyRoutes = require("./routes/propertyRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDB();

app.use("/api/property", propertyRoutes);

app.use((req,res)=> res.status(404).json({error:"Route not found"}));

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server @ http://localhost:${process.env.PORT || 5000}`)
);
