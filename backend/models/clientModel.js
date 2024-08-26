import mongoose from 'mongoose';

const clientSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    roomNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    identityCard: {
        type: String,
    },
    identityCardNumber: {
        type: String,
    },
    balance: {type: Number, default: 0},
    total: {type: Number, required: true},
    roomId: {
        type: String
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    },
    days: {
        type: Number, required: true, default: 0,
    },
    history: [],
    credit: [],
    userId: {type: String}
},
{
    timestamps: true
}
);

const Client = mongoose.model("Client", clientSchema);

export default Client;