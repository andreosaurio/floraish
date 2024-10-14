import jwt from "jsonwebtoken";
import handle_async from "./handle_async.js";
import UserData from "../schemas/user-data.js";

const protect = handle_async(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserData.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("No autorizado, el token ha fallado");
    }
  } else {
    res.status(401);
    throw new Error("No autorizado, no hay token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("No autorizado por administrador");
  }
};

export { protect, admin };
