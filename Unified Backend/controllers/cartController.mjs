import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";


//add to cart controller
const addToCart = (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      message: "Invalid product ID or quantity",
    });
  }

  let foundProduct;

  // Step 1: Check if product exists and has enough stock
  Product.findById(productId).lean()
    .then(product => {
      if (!product) {
        return Promise.reject({ status: 404, message: "Product not found" });
      }

      if (product.stock_level < quantity) {
        return Promise.reject({
          status: 400,
          message: `Insufficient stock for product ${product.name}. Available stock: ${product.stock_level}`,
        });
      }

      foundProduct = product; // Store product info for later use

      return Cart.findOne({ userId: req.user.id });
    })
    .then(userCart => {
      if (!userCart) {
        // New cart for user
        const newCart = new Cart({
          userId: req.user.id,
          products: [{ productId, quantity }],
        });
        return newCart.save();
      }

      // Update existing cart
      const existingProduct = userCart.products.find(p =>
        p.productId.toString() === String(productId)
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        userCart.products.push({ productId, quantity });
      }

      return userCart.save();
    })
    .then(finalCart => {
      res.status(200).json({
        message: "Product added to cart successfully",
        cart: finalCart,
      });
    })
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({
          message: "Server error",
          error: err.message || err,
        });
      }
    });
};

//get cart controller
const getCart = (req, res) => {
  Cart.findOne({ userId: req.user.id })
    .populate({
      path: 'products.productId',
      model: 'Products'
    })
    .then(userCart => {
      if (!userCart) {
        return res.status(404).json({
          message: "Cart not found"
        });
      }

      res.status(200).json({
        message: "Cart retrieved successfully",
        cart: userCart,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Server error",
        error: err.message || err,
      });
    });
};

//remove from cart
const removeFromCart = (req, res) => {
  const { productId } = req.body;

  //validate productId
  if (!productId) {
    return res.status(400).json({ 
      message: "Product ID is required" 
    });
  }

  //find the user's cart
  Cart.findOne({ userId: req.user.id })
    .then(userCart => {
      if (!userCart) {
        return res.status(404).json({ 
          message: "Cart not found" 
        });
      }

      //find the product in the cart
      const productIndex = userCart.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex === -1) {
        return res.status(404).json({ 
          message: "Product not found in cart" 
        });
      }

      //remove the product from the cart
      userCart.products.splice(productIndex, 1);
      return userCart.save();
    })
    .then(updatedCart => {
      res.status(200).json({
        message: "Product removed from cart successfully",
        cart: updatedCart,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Server error",
        error: err.message || err,
      });
    });
};

//increase quantity in cart
const increaseQuantity = (req, res) => {
  const { productId, quantity } = req.body;

  // Step 1: Validate input
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      message: "Invalid product ID or quantity",
    });
  }

  let userCart;
  let productInCart;

  Cart.findOne({ userId: req.user.id })
    .then(cart => {
      if (!cart) {
        throw { status: 404, message: "Cart not found" };
      }

      userCart = cart;

      productInCart = userCart.products.find(p => p.productId.toString() === productId);
      if (!productInCart) {
        throw { status: 404, message: "Product not found in cart" };
      }

      return Product.findById(productId);
    })
    .then(product => {
      if (!product) {
        throw { status: 404, message: "Product not found in database" };
      }

      const newQuantity = productInCart.quantity + quantity;

      if (newQuantity > product.stock_level) {
        throw {
          status: 400,
          message: `Cannot increase quantity. Only ${product.stock_level} item(s) in stock.`,
        };
      }

      productInCart.quantity = newQuantity;
      return userCart.save();
    })
    .then(updatedCart => {
      res.status(200).json({
        message: "Product quantity increased successfully",
        cart: updatedCart,
      });
    })
    .catch(err => {
      res.status(err.status || 500).json({
        message: err.message || "Server error",
        error: err,
      });
    });
};

//decrease quantity in cart
const decreaseQuantity = (req, res) => {
  const { productId, quantity } = req.body;

  // Step 1: Validate input
  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      message: "Invalid product ID or quantity",
    });
  }

  let userCart;
  let productInCart;

  Cart.findOne({ userId: req.user.id })
    .then(cart => {
      if (!cart) {
        throw { status: 404, message: "Cart not found" };
      }

      userCart = cart;

      productInCart = userCart.products.find(p => p.productId.toString() === productId);
      if (!productInCart) {
        throw { status: 404, message: "Product not found in cart" };
      }

      const newQuantity = productInCart.quantity - quantity;

      if (newQuantity < 1) {
        // Option 1: Auto-remove product when quantity < 1
        userCart.products = userCart.products.filter(
          p => p.productId.toString() !== productId
        );
      } else {
        // Option 2: Just reduce quantity
        productInCart.quantity = newQuantity;
      }

      return userCart.save();
    })
    .then(updatedCart => {
      res.status(200).json({
        message: "Product quantity decreased successfully",
        cart: updatedCart,
      });
    })
    .catch(err => {
      res.status(err.status || 500).json({
        message: err.message || "Server error",
        error: err,
      });
    });
};

export {
    addToCart,
    getCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
}