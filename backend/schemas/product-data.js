import mongoose from "mongoose";

const opinionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserData",
    },
    name: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserData",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    cares: {
      type: String,
      required: true,
    },
    opinions: [opinionSchema],
    score: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    totalOpinions: {
      type: Number,
      required: true,
      default: 0,
    },
    stockItems: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ProductData = mongoose.model("ProductData", productSchema);

export default ProductData;
