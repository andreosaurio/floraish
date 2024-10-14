import mongoose from "mongoose";

const purchaseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserData",
    },
    purchasedItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "ProductData",
        },
        unitPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentDone: {
      id: { type: String },
      status: { type: String },
      lastModified: { type: String },
      emailAccount: { type: String },
    },
    unitPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingRate: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    hasBeenPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentDate: {
      type: Date,
    },
    deliveryCompleted: {
      type: Boolean,
      requiered: true,
      default: false,
    },
    deliveryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseData = mongoose.model("PurchaseData", purchaseSchema);

export default PurchaseData;