import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Item from "../models/itemModel.js";

const createItem = asyncHandler(async (req, res, next) => {
  const { name, price, type, description, quantity, hasStock } = req.body;
  const user_id = req.user._id;

  if (!name || !price || !type) {
    res.status(400);
    throw new Error("Erreur ! formulaire incomplet");
  }

  const new_item = await Item.create({
    name,
    price,
    type,
    description,
    userId: user_id,
    updatedBy: user_id,
    hasStock: hasStock,
    quantity: Number(quantity) || 0,
  });

  if (new_item) {
    res.status(200).json({ success: true, item: new_item });
  } else {
    res.status(400);
    throw new Error("Erreur! Verifier votre connection");
  }
});

const updateItem = asyncHandler(async (req, res, next) => {
  const { name, price, type, description, id, hasStock } = req.body;
  const user_id = req.user._id;
  const item = await Item.findById(id);
  if (item) {
    item.name = name || item.name;
    item.price = price || item.price;
    item.type = type || item.type;
    item.description = description || item.description;
    item.hasStock = hasStock || item.hasStock;
    // item.quantity = Number(quantity) || item.quantity;

    item.updatedBy = user_id;

    await item.save();
    res.status(200).json({ success: true, item: item });
  } else {
    res.status(400);
    throw new Error("Erreur! ID Invalid");
  }
});

const deleteItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  await Item.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "Item supprimé" });
});

const getItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (item) {
    res.status(200).json({ success: true, item: item });
  } else {
    res.status(400);
    throw new Error("Erreur! ID invalide");
  }
});

const getItems = asyncHandler(async (req, res, next) => {
  const items = await Item.find();
  if (items) {
    res.status(200).json({ success: true, items: items });
  } else {
    res.status(400);
    throw new Error("Erreur!");
  }
});

const buyItems = asyncHandler(async (req, res, next) => {
  const { items } = req.body;
  for (let i = 0; i < items.length; i++) {
    let currentItem = await Item.findById(items[i].id);
    if (currentItem) {
      if (currentItem.hasStock) {
        currentItem.quantity =
          Number(currentItem.quantity) - Number(items[i].quantity);
        await currentItem.save();
      }
    }
  }

  res.status(200).json({ success: true, message: "Items updated" });
});

const localUpdateStock = async (items) => {
  try {
    for (let i = 0; i < items.length; i++) {
      let currentItem = await Item.findById(items[i].id);
      if (currentItem) {
        if (currentItem.hasStock) {
          currentItem.quantity =
            Number(currentItem.quantity) - Number(items[i].quantity);
          await currentItem.save();
        }
      }
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const itemUpdateStock = asyncHandler(async (req, res, next) => {
  const { id, offset } = req.body;
  console.log(req.body);
  const item = await Item.findById(id);
  if (!item) {
    res.status(400);
    throw new Error("Erreur! ce produit n'existe pas !");
    return;
  }
  if (Number(offset) <= 0) {
    return res.status(400).json({ success: false, message: "Erreur" });
  }

  let temp_quant = item.quantity >= 0 ? item.quantity : 0;
  console.log(offset);
  let new_history = {
    value: offset,
    initialStock: temp_quant,
    stock: temp_quant + Number(offset),
    date: new Date()
  };

  item.history = item?.history?.length > 0 ? [new_history] : [...item.history, new_history];
  item.quantity = Number(temp_quant) +  Number(offset);

  await item.save();

  res.status(200).json({success: true, item: item})
});

export {
  createItem,
  updateItem,
  deleteItem,
  getItem,
  getItems,
  buyItems,
  localUpdateStock,
  itemUpdateStock
};
