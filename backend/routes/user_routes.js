import express from "express";
const router = express.Router();

import {
  userLogin,
  userSignUp,
  userLogout,
  usersProfile,
  updateUsersProfile,
  getAllProfiles,
  getUsersId,
  deleteUser,
  updateUser,
} from "../actions/user_actions.js";
import { protect, admin } from "../middleware/authorization_middleware.js";

router.route("/").post(userSignUp).get(protect, admin, getAllProfiles);
router.post("/logout", userLogout);
router.post("/login", userLogin);
router.post("/login", userLogin);
router
  .route("/profile")
  .get(protect, usersProfile)
  .put(protect, updateUsersProfile);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUsersId)
  .put(protect, admin, updateUser);

export default router;
