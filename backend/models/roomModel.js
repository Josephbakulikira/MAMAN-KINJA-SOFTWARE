import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
    name: {
        type: String, required: true, unique: true
    },
    available: {
        type: Boolean,
        default: true
    },
    category: {
        type: String
    },
    occupiedBy: {
        type: String
    },
    price: {
        type: String,
    },
    checkIn: {
        type: Date
    },
    history: [],
    checkOut: {
        type: Date
    },
    userId: {type: String}
},
{
    timestamps: true
}
);

const Room = mongoose.model("Room", roomSchema);

export default Room;