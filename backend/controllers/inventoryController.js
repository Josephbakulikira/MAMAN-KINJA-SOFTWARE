import Bill from "../models/billModel.js";
import Inventory from "../models/inventoryModel.js";
import asyncHandler from "express-async-handler";


const generateInventory = asyncHandler(async (req, res, next) => {
    const user_id = req.user._id;
    // console.log(user_id);
    const bills = await Bill.find({processed: false});
    if(bills && bills?.length === 0){
        // console.log(bills, "here");
        return res.status(404).json({success: false, message: "Pas de facture disponible pour generer l'inventaire"});
    }
    if(bills && bills?.length > 0){
        processBills(bills).then(async () => {
            const new_inv = await Inventory.create({
                userId: user_id,
                description: req.body.description,
                activities: bills
            });

            res.status(200).json({success: true, inventory: new_inv})
        }).catch((error)=>{
            console.log(error, "error here processing bills");
            res.status(400).json({success: false, message: "Error processing bills"})
        })
    }
    

});

async function processBills(bills) {
    try{
        for(let i = 0; i < bills.length; i++){
            bills[i].processed = true;
            await bills[i].save();
        }
    }catch(err){
        console.log(err);
        throw new Error("Error")
    }
}

const getAllInventories = asyncHandler(async(req, res, next) => {
    const invs = await Inventory.find().sort({_id: -1});;
    res.status(200).json({success: true, inventories: invs})
});

export  {generateInventory, getAllInventories}