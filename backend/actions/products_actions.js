import asyncHandler from "express-async-handler";
import ProductData from "../schemas/product-data.js";
import PurchaseData from "../schemas/purchase-data.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const pageLimit = 8;
  const page = Number(req.query.pageNumber) || 1;
  const searchTerm = req.query.searchTerm
    ? { name: { $regex: req.query.searchTerm, $options: "i" } }
    : {};

  const count = await ProductData.countDocuments({...searchTerm});

  const products = await ProductData.find({ ...searchTerm })
    .sort({ createdAt: -1 })
    .limit(pageLimit)
    .skip(pageLimit * (page - 1));
  
  res.json({ products, page, pages: Math.ceil(count / pageLimit) });
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await ProductData.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar producto", error: error.message });
  }
});

const createNewProduct = asyncHandler(async (req, res) => {
  const { name, price, image, cares, stockItems, description } = req.body;

  if (!name || !price || !image || !cares || !stockItems) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const product = new ProductData({
      name,
      price,
      user: req.user._id,
      image,
      cares,
      stockItems,
      totalReview: 0,
      description,
    });

    const createdNewProduct = await product.save();
    res.status(201).json(createdNewProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
});

const editProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, cares, stockItems } = req.body;

  const product = await ProductData.findById(req.params.id);
  if (product) {
    (product.name = name),
      (product.price = price),
      (product.description = description),
      (product.image = image),
      (product.cares = cares),
      (product.stockItems = stockItems);

    const editedProduct = await product.save();
    res.json(editedProduct);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  const product = await ProductData.findById(req.params.id);

  if (product) {
    await ProductData.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Producto eliminado" });
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

const newProductOpinion = asyncHandler(async (req, res) => {
  const { score, note } = req.body;
  const productId = req.params.id;

  const purchaseExists = await PurchaseData.findOne({
    user: req.user._id,
    "purchasedItems.product": productId, 
  });

  if (!purchaseExists) {
    return res.status(403).json({
      message:
        "Solo los usuarios que han comprado este producto pueden dejar una reseña.",
    });
  }

  const product = await ProductData.findById(productId);

  if (product) {
    const alreadyReviewed = product.opinions.find(
      (opinion) => opinion.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Ya has hecho una reseña sobre este producto.");
    }

    const review = {
      name: req.user.name,
      score: Number(score),
      note,
      user: req.user._id,
    };

    product.opinions.push(review);
    product.totalOpinions = product.opinions.length;
    product.score =
      product.opinions.reduce((acc, opinion) => opinion.score + acc, 0) /
      product.opinions.length;

    await product.save();
    res.status(201).json({ message: "Reseña añadida" });
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

const getBestScoreProducts = asyncHandler(async (req, res) => {
  const products = await ProductData.find({}).sort({ rating: -1 }).limit(6);
  res.status(200).json(products);

})

export {
  getAllProducts,
  getProductById,
  createNewProduct,
  editProduct,
  removeProduct,
  newProductOpinion,
  getBestScoreProducts
};