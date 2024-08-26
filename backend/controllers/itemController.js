import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";
import Item from '../models/itemModel.js'

const createItem = asyncHandler(async (req, res, next) => {
    const {
        name,
        price,
        type,
        description,
    } = req.body;
    const user_id = req.user._id;

    if(!name || !price || !type ){
        res.status(400);
        throw new Error("Erreur ! formulaire incomplet");
    }
    
    const new_item = await Item.create({
        name,
        price,
        type,
        description,
        userId: user_id,
        updatedBy: user_id
    });

    if(new_item){
        res.status(200).json({success: true, item: new_item});
    }else{
        res.status(400)
        throw new Error("Erreur! Verifier votre connection");
    }
});

const updateItem = asyncHandler(async (req, res, next) => {
    const {name, price, type, description, id} = req.body;
    const user_id = req.user._id;
    const item = await Item.findById(id);
    if(item){
        item.name = name || item.name;
        item.price = price || item.price;
        item.type = type || item.type;
        item.description = description || item.description;

        item.updatedBy = user_id;

        await item.save();
        res.status(200).json({success: true, item: item});

    }else{
        res.status(400)
        throw new Error("Erreur! ID Invalid")
    }
});

const deleteItem = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    console.log(id);
    await Item.findByIdAndDelete(id);
    res.status(200).json({success: true, message: "Item supprimé"})
});

const getItem = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const item = await Item.findById(id);
    if(item){
        res.status(200).json({success: true, item: item});
    }else{
        res.status(400)
        throw new Error("Erreur! ID invalide")
    }
});

const getItems = asyncHandler(async (req, res, next) => {
    const items = await Item.find();
    if(items){
        res.status(200).json({success: true, items: items});
    }else{
        res.status(400)
        throw new Error("Erreur!")
    }
});



export {createItem, updateItem, deleteItem, getItem, getItems};