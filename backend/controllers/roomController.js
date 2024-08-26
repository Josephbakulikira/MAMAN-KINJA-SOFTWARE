import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Client from "../models/clientModel.js";
import Room from "../models/roomModel.js";

const createRoom = asyncHandler(async (req, res, next) => {
  const { name, price, category } = req.body;
  // console.log(req.body);
  const user_id = req.user._id;

  const new_room = await Room.create({
    name,
    price,
    category,
    userId: user_id,
  });

  if (new_room) {
    return res.status(200).json({ success: true, room: new_room });
  } else {
    res.status(400);
    throw new Error("Erreur! Verifier votre connection");
  }
});

const deleteRoom = asyncHandler(async (req, res, next) => {
  const { room_id } = req.body;
  const user_id = req.user._id;

  if (!room_id) {
    res.status(400);
    throw new Error("Erreur ! formulaire incomplet");
  }

  await Room.findByIdAndDelete(room_id);
  res.status(200).json({ success: true, message: "Room deleted" });
});

const updateAvailability = asyncHandler(async (req, res, next) => {
  const { new_client, room_id } = req.body;
  const user_id = req.user._id;

  if (!room_id) {
    res.status(400);
    throw new Error("Erreur ! formulaire incomplet");
  }
  const room = await Room.findById(room_id);
  room.occupiedBy = new_client;
  if (new_client === "") {
    room.available = true;
  } else {
    room.available = false;
  }

  await room.save();

  res.status(200).json({ success: true, message: "updated", room: room });
});

const getRoom = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const room = await Room.findById(id);
  if (room) {
    res.status(200).json({ success: true, room: room });
  } else {
    res.status(400);
    throw new Error("Erreur! ID invalide");
  }
});

const getRooms = asyncHandler(async (req, res, next) => {
  const rooms = await Room.find();
  var today = new Date().valueOf();

  if (rooms) {
    rooms.map((single_room, index) => {
      // console.log(single_room.name);
      // console.log(single_room?.checkIn.valueOf());
      // console.log(single_room?.checkOut.valueOf());
    //   console.log(single_room?.checkIn);
    //   console.log(single_room?.checkOut);

      if (
        today <= single_room?.checkOut?.valueOf() &&
        today >= single_room?.checkIn?.valueOf()
      ) {
        return Room.findOneAndUpdate(
            { _id: single_room._id },
            { $set: { available: false } }
          )
            .then(() => console.log(`Room ${single_room.name} updated`))
            .catch((err) => console.log("Error while updating"));
      } else if (
        !single_room?.checkIn?.valueOf() ||
        !single_room?.checkOut?.valueOf() ||
        !today
      ) {
        return Room.findOneAndUpdate(
            { _id: single_room._id },
            { $set: { available: true } }
          )
            .then(() => console.log(`Room ${single_room.name} updated`))
            .catch((err) => console.log("Error while updating"));
      } 
      else if(single_room?.checkIn === undefined || single_room?.checkOut === undefined){
        return Room.findOneAndUpdate(
            { _id: single_room._id },
            { $set: { available: true } }
          )
            .then(() => console.log(`Room ${single_room.name} updated`))
            .catch((err) => console.log("Error while updating"));
      }
      else {
        return Room.findOneAndUpdate(
          { _id: single_room._id },
          today >= single_room?.checkOut?.valueOf()
            ? { $set: { available: true, checkIn: null, checkOut: null } }
            : { $set: { available: true } }
        )
          .then(() => console.log(`Room ${single_room.name} updated`))
          .catch((err) => console.log("Error while updating"));
      }
    });
    res.status(200).json({ success: true, rooms: rooms });
  } else {
    res.status(400);
    throw new Error("Erreur!");
  }
});

export { createRoom, updateAvailability, deleteRoom, getRoom, getRooms };
