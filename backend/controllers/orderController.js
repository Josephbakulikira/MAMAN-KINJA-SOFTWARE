import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";
import Order from '../models/orderModel.js';

const createOrder = asyncHandler(async (req, res, next) => {
    const {
        clientName,
        clientNumber,
        items,
        table,
        waiter,
        total,
    } = req.body;
    const user_id = req.user._id;

    if(!items || !table || !waiter || !total){
        res.status(400);
        throw new Error("Erreur ! formulaire incomplet");
    }
    
    const new_order = await Order.create({
        clientName: clientName || "",
        clientNumber: clientNumber || "",
        items,
        table,
        waiter,
        total,
        placedTime: new Date(Date.now()),
        userId: user_id,
        updatedBy: user_id
    });

    if(new_order){
        res.status(200).json({success: true, order: new_order});
    }else{
        res.status(400)
        throw new Error("Erreur! Verifier votre connection");
    }
});

const updateOrder = asyncHandler(async (req, res, next) => {
    
    const user_id = req.user._id;
    const order = await Order.findById(req.body?._id);
    if(order){
        order.clientName = req.body?.clientName || order.clientName;
        order.clientNumber = req.body?.clientNumber || order.clientNumber;
        order.items = req.body?.items || order.items;
        order.table = req.body?.table || order.table;
        order.waiter = req.body?.waiter || order.waiter;
        order.total = req.body?.total || order.total;
        order.updatedBy = user_id;  


        await order.save();
        res.status(200).json({success: true, order: order});

    }else{
        res.status(400)
        throw new Error("Erreur! ID Invalid")
    }
});

const deleteOrder = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({success: true, message: "Commande supprimé"})
});

const getOrder = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const order = await Order.findById(id);
    if(order){
        res.status(200).json({success: true, order: order});
    }else{
        res.status(400)
        throw new Error("Erreur! ID invalide")
    }
});

const getOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find().sort({_id: -1});
    if(orders){
        res.status(200).json({success: true, orders: orders.filter(ordr => ordr.status !== "deleted")});
    }else{
        res.status(400)
        throw new Error("Erreur!")
    }
});

const updateStatus = asyncHandler(async(req, res, next) => {
    const {id, new_status} = req.body;
    const user_id = req.user._id;
    const order = await Order.findById(id);
    if(order){
        order.status = new_status || order.status;
        if(new_status === "processing"){
            order.confirmedTime = null;
            order.deliveredTime = null;
        }
        else if(new_status === "confirmed"){
            order.confirmedTime = new Date(Date.now());
        }else if(new_status === "ready"){
            order.deliveredTime = new Date(Date.now());
        }
        order.updatedBy = user_id;

        await order.save();
        res.status(200).json({success: true, order: order})
    }else{
        res.status(400);
        throw new Error("Commande n'exsite pas")
    }
});

export {createOrder, updateOrder, deleteOrder, getOrder, getOrders, updateStatus};