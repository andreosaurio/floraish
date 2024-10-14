import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDatabase from "./config/database.js";
import {
  handleNotFound,
  globalErrorHandler,
} from "./middleware/error_middleware.js";
import product_routes from "./routes/product_routes.js";
import user_routes from "./routes/user_routes.js";
import purchases_routes from "./routes/purchases_routes.js";
import upload_routes from "./routes/upload_routes.js";

const port = process.env.PORT || 5000;

connectDatabase();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/products", product_routes);
app.use("/api/users", user_routes);
app.use("/api/purchases", purchases_routes);
app.use("/api/upload", upload_routes);

app.get("/api/config/stripe", (req, res) =>
  res.send({ publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY })
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  // static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  //cualquier ruta q no es api se envía a index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("La API está en marcha");
  });
}

app.use(handleNotFound);

app.use(globalErrorHandler);

app.listen(port, () =>
  console.log(`El servidor está funcionando en el puerto ${port}`)
);
