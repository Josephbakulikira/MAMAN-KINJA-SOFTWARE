import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";
import Client from '../models/clientModel.js';
import Room from '../models/roomModel.js';

const createClient = asyncHandler(async (req, res, next) => {
    const {
        fullname,
        address,
        identityCard,
        identityCardNumber,
        roomNumber,
        days,
        total,
        checkIn,
        checkOut,
        phoneNumber,
        email,
        balance
    } = req.body;
    const user_id = req.user._id;
    
    const room = await Room.findOne({name: roomNumber});
    if(!room){
        return res.status(400).json({success: false, message: "Cette chambre n'existe pas !"})
    }

    const new_client = await Client.create({
        fullname,
        address,
        identityCard,
        identityCardNumber,
        roomNumber,
        days,
        phoneNumber,
        total,
        email,
        checkIn,
        checkOut,
        balance,
        userId: user_id,
        history: [{checkIn, checkOut, roomNumber, type: "hotel", date: new Date()}, {type: "hotel", deposit: balance, date: new Date()}]
    });

    room.available = false;
    room.occupiedBy = new_client?._id;
    room.checkOut = checkOut;
    room.checkIn = checkIn;
    room.history = [...room.history, {checkOut, checkIn, client: fullname, phoneNumber, date: new Date()}];
    
    if(new_client){
        await room.save();
        res.status(200).json({success: true, client: new_client});
    }else{
        res.status(400)
        throw new Error("Erreur! Verifier votre connection");
    }
});

const deleteClient = asyncHandler(async (req, res, next) => {
    const {client_id} = req.body;
    const user_id = req.user._id;

    if(!client_id ){
        res.status(400);
        throw new Error("Erreur ! formulaire incomplet");
    }
    
    await Client.findByIdAndDelete(client_id);
    res.status(200).json({success: true, message: "client deleted"});

});

const updateHistory = asyncHandler(async (req, res, next) => {
    const {amount, description, client_id} = req.body;
    const user_id = req.user._id;

    if(!amount){
        res.status(400);
        throw new Error("Erreur ! formulaire incomplet");
    }
    const client = await Client.findById(client_id);
    client.history = {type: "hotel", description: description, amount: amount};
    client.balance += Number(amount);

    await client.save();

    res.status(200).json({success: true, message: "updated", client: client})
});

const updateHistoryCheckInCheckOutRoom = asyncHandler(async (req, res, next) => {
    const {checkIn, checkOut, roomNumber, client_id, total, days} = req.body;
    const user_id = req.user._id;

    // console.log(user_id);
    
    const client = await Client.findById(client_id);
    const room = await Room.findOne({name: roomNumber});
    if(!client)
    {
        return res.status(400).json({success: false, message: "Error! Client introuvables"});
    }
    if(!room)
    {
        return res.status(400).json({success: false, message: "Error! Client introuvables"});
    }
    
    client.history = [...client.history, {checkIn, checkOut, roomNumber, type: "hotel", date: new Date()}];
    
    room.history = [...room.history, {checkOut, checkIn, client: client.fullname, phoneNumber: client?.phoneNumber, date: new Date()}]

    client.checkIn = checkIn;
    client.checkOut = checkOut;
    client.roomNumber = roomNumber;
    client.total = total;
    client.days = days;
    // client.balance = 0;
    // room.available = 
    await client.save();

    res.status(200).json({success: true, message: "updated", client: client})
});

const getClient = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const client = await Client.findById(id);
    if(client){
        res.status(200).json({success: true, client: client});
    }else{
        res.status(400)
        throw new Error("Erreur! ID invalide")
    }
});

const getClients = asyncHandler(async (req, res, next) => {
    const clients = await Client.find();

    if(clients){
        res.status(200).json({success: true, clients: clients});
    }else{
        res.status(400)
        throw new Error("Erreur!")
    }
});

export {
    createClient,
    updateHistory,
    deleteClient,
    getClient,
    getClients,
    updateHistoryCheckInCheckOutRoom
}