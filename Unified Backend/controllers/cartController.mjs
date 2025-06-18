import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";


//add to cart controller
const addToCart = (req, res) =>{
    res.status(200).json({
        message: "Add to cart controller is working",
        data: req.body
    });
}

//remove from cart
const removeFromCart = (req, res) => {
    res.status(200).json({
        message: "Remove from cart controller is working",
        data: req.body
    });
}

//increase quantity in cart
const increaseQuantity = (req, res) => {
    res.status(200).json({
        message: "Increase quantity in cart controller is working",
        data: req.body
    }); 
}

//decrease quantity in cart
const decreaseQuantity = (req, res) => {
    res.status(200).json({
        message: "Decrease quantity in cart controller is working",
        data: req.body
    });
}


export {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
}