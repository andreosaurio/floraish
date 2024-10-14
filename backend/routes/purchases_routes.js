import express from "express";
const router = express.Router();

import {
  addPurchaseItems,
  getPurchaseById,
  updatePurchaseToPaid,
  updatePurchaseToDelivered,
  getMyPurchases,
  getPurchases,
  checkoutSession
} from "../actions/purchase_actions.js";
import { protect, admin } from "../middleware/authorization_middleware.js";
import { createPaymentIntent } from "../actions/payment_actions.js"

router
  .route("/")
  .post(protect, addPurchaseItems)
  .get(protect, admin, getPurchases);
router.route("/mypurchases").get(protect, getMyPurchases);
router.route("/:id").get(protect, getPurchaseById);
router.route("/:id/pay").put(protect, updatePurchaseToPaid);
router.route("/:id/deliver").put(protect, admin, updatePurchaseToDelivered);
router.post("/create-payment-intent", protect, createPaymentIntent);
router.post('/checkout', protect, checkoutSession);

export default router;
