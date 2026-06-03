import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import diagramRoutes from "./routes/diagramRoutes.js";



const app = express();
const port = process.env.PORT || 4000;



const mongoUri = process.env.MONGODB_URI;
if(!mongoUri){
  console.log("mongo uri is req");
  process.exit(1);
}
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});


app.use("/api/auth", authRoutes);
app.use("/api/diagrams", diagramRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Something went wrong" });
});



mongoose.connect(mongoUri).then(() =>{
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  }).catch((error) => {
    console.error("MongoDB connection failed  :", error.message);
    process.exit(1);
  });

export default app;
