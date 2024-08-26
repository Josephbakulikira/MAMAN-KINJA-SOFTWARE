import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Product from "../models/productModel.js";

const createProduct = asyncHandler(async (req, res, next) => {
    const {
        name,
        stock,
        description
    } = req.body;
    const user_id = req.user._id;

    if(!name ){
        res.status(400);
        throw new Error("Erreur ! formulaire incomplet");
    }
    
    const new_product = await Product.create({
        name,
        stock,
        description,
        userId: user_id,
    });

    if(new_product){
        res.status(200).json({success: true, product: new_product});
    }else{
        res.status(400)
        throw new Error("Erreur! Verifier votre connection");
    }
});

const deleteProduct = asyncHandler(async (req, res, next) => {
    const {product_id} = req.body;
    const user_id = req.user._id;

    if(!product_id ){
        res.status(400);
        throw new Error("Erreur ! formulaire incomplet");
    }
    
    await Product.findByIdAndDelete(product_id);
    res.status(200).json({success: true, message: "Product deleted"});

});

const updateStock = asyncHandler(async (req, res, next) => {
    const {stock_id, stock_offset} = req.body;
    const user_id = req.user._id;

    if(!stock_id || !stock_offset){
        res.status(400);
        throw new Error("Erreur ! formulaire incomplet");
    }
    const stock = await Product.findById(stock_id);
    stock.stock = Number(stock.stock) - Number(stock_offset);

    await stock.save();

    res.status(200).json({success: true, message: "updated"})
});

export {
    createProduct,
    updateStock,
    deleteProduct
}