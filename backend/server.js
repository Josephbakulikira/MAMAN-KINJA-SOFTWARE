import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import cors from 'cors'

import root from "./routes/root.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import morgan from 'morgan';
import chalk from 'chalk';
import { morganMiddleware } from "./middleware/morganMiddlware.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// DEBUG -> MORGAN SETUP FOR
morgan.token('statusColor', (req, res, args) => {
  const status = res.headersSent ? res.statusCode : undefined;
  const color =
      status >= 500 ? 31 : status >= 400 ? 33 : status >= 300 ? 36 : status >= 200 ? 32 : 0;
  return `\x1b[${color}m${status}\x1b[0m`;
});
// TODO -> DEGUB -> uncomment the line bellow to debug
// app.use(morganMiddleware);
app.use(morgan(`:method :url :statusColor :response-time ms - length|:res[content-length]`));

app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", root);

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/rooms", roomRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
