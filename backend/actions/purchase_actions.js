import handle_async from "../middleware/handle_async.js";
import PurchaseData from "../schemas/purchase-data.js";
import stripe from "stripe";
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

const addPurchaseItems = handle_async(async (req, res) => {
  const {
    purchasedItems,
    shippingAddress,
    unitPrice,
    shippingRate,
    totalAmount,
  } = req.body;

  const parsedUnitPrice = parseFloat(unitPrice);
  const parsedShippingRate = parseFloat(shippingRate);
  const parsedTotalAmount = parseFloat(totalAmount);

  if (purchasedItems && purchasedItems.length === 0) {
    res.status(400);
    throw new Error("No hay productos para la compra");
  } else {
    const purchase = new PurchaseData({
      purchasedItems: purchasedItems.map((i) => ({
        ...i,
        product: i._id,
        unitPrice: i.unitPrice,
        _id: undefined,
      })),
      user: req.user._id,
      purchasedItems,
      shippingAddress,
      unitPrice: parsedUnitPrice,
      shippingRate: parsedShippingRate,
      totalAmount: parsedTotalAmount,
    });

    const createdPurchase = await purchase.save();

    res.status(201).json(createdPurchase);
  }
});

const getPurchaseById = handle_async(async (req, res) => {
  const purchase = await PurchaseData.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (purchase) {
    res.status(200).json(purchase);
  } else {
    res.status(404);
    throw new Error("Compra no encontrada");
  }
});

const updatePurchaseToPaid = handle_async(async (req, res) => {
  const purchase = await PurchaseData.findById(req.params.id);

  if (purchase) {
    purchase.hasBeenPaid = true;
    purchase.paymentDate = Date.now();
    purchase.paymentDone = {
      id: req.body.id,
      status: req.body.status,
      lastModified: req.body.lastModified,
      emailAccount: req.body.emailAccount,
    };

    const updatedPurchase = await purchase.save();

    res.status(200).json(updatedPurchase);
  } else {
    res.status(404);
    throw new Error("Pedido no encontrado");
  }
});

const updatePurchaseToDelivered = handle_async(async (req, res) => {
  const purchase = await PurchaseData.findById(req.params.id);

  if (purchase) {
    purchase.deliveryCompleted = true;
    purchase.deliveryDate = Date.now();

    const updatedPurchase = await purchase.save();

    res.status(200).json(updatedPurchase);
  } else {
    res.status(400);
    throw new Error("Pedido no encontrado");
  }
});

const getMyPurchases = handle_async(async (req, res) => {
  const purchases = await PurchaseData.find({ user: req.user._id });
  res.status(200).json(purchases);
});

const getPurchases = handle_async(async (req, res) => {
  const purchases = await PurchaseData.find({}).populate("user", "id name");
  res.status(200).json(purchases);
});

const checkoutSession = handle_async(async (req, res) => {
  const { items } = req.body;

  const line_items = items.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: item.unitPrice * 100, 
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`, 
      cancel_url: `${process.env.FRONTEND_URL}/cancel`, 
    });

    res.json({ id: session.id }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export {
  addPurchaseItems,
  getPurchaseById,
  updatePurchaseToPaid,
  updatePurchaseToDelivered,
  getMyPurchases,
  getPurchases,
  checkoutSession,
};
