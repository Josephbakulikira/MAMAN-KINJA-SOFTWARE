import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";
import Order from '../models/orderModel.js';
import Bill from '../models/billModel.js';

const createBill = asyncHandler(async (req, res, next) => {
    const {
        paid,
        payement,
        table,
        waiter,
        total,
        orderId,
        items,
        note
    } = req.body;
    const user_id = req.user._id;
    // console.log(req.body)

    if(!items || !total || !orderId || !waiter || !table ){
        res.status(400);
        throw new Error("Erreur ! formulaire incomplet");
    }
    
    const new_bill = await Bill.create({
        paid,
        payement,
        table,
        waiter,
        total,
        orderId,
        items,
        userId: user_id,
        updatedBy: user_id,
        note
    });

    if(new_bill){
        res.status(200).json({success: true, bill: new_bill});
    }else{
        res.status(400)
        throw new Error("Erreur! Verifier votre connection");
    }
});

const updateBill = asyncHandler(async (req, res, next) => {
    const {name, price, type, description, id} = req.body;
    const user_id = req.user._id;
    const bill = await Bill.findById(id);
    if(bill){
        bill.name = name || bill.name;
        bill.price = price || bill.price;
        bill.type = type || bill.type;
        bill.description = description || bill.description;

        bill.updatedBy = user_id;

        await bill.save();
        res.status(200).json({success: true, bill: bill});

    }else{
        res.status(400)
        throw new Error("Erreur! ID Invalid")
    }
});

const deleteBill = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    await Bill.findByIdAndDelete(id);
    res.status(200).json({success: true, message: "Facture supprimé"})
});

const removeBill =asyncHandler(async (req, res, next) => {
    const {id} = req.body;
    const bill = await Bill.findById(id);
    if(bill){
        bill.deleted = true;
        await bill.save();
        res.status(200).json({success: true, message: "Facture supprimé"})
    }else{
        res.status(400);
        throw new Error("Erreur! Facture n'existe pas")
    }
})

const getBill = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const bill = await Bill.findById(id);
    if(bill){
        res.status(200).json({success: true, bill: bill});
    }else{
        res.status(400)
        throw new Error("Erreur! ID invalide")
    }
});

const getAllBills = asyncHandler(async(req, res, next) => {
    const bills = await Bill.find();
    res.status(200).json({success: true, bills: bills})
})

const getBills = asyncHandler(async (req, res, next) => {
    const bills = await Bill.find({deleted: false});
    if(bills){
        res.status(200).json({success: true, bills: bills});
    }else{
        res.status(400)
        throw new Error("Erreur!")
    }
})

export {createBill, updateBill, deleteBill, removeBill, getBill, getAllBills, getBills};