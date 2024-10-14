import express from "express";
import { protect, admin } from "../middleware/authorization_middleware.js";
import {
  getAllProducts,
  getProductById,
  createNewProduct,
  editProduct,
  removeProduct,
  newProductOpinion,
  getBestScoreProducts,
} from "../actions/products_actions.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(protect, admin, createNewProduct);
router.get("/topscore", getBestScoreProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, editProduct)
  .delete(protect, admin, removeProduct);

router.route("/:id/opinions").post(protect, newProductOpinion);

export default router;
