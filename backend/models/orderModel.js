import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    clientName: {
        type: String,
    },
    clientNumber: {
        type: String,
    },
    items: [], // [ {item_name, item_id, item_price, quantity, total} , ...]
    table: {
        type: String,
        required: [true, "le numero du table est obligatoire"]
    },
    waiter: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "le nom du serveur est obligatoire"]
    },
    total: {
        type: Number
    },
    status: {
        type: String,
        default: "processing" // processing, confirmed, ready, deleted
    },
    placedTime: {
        type: Date
    },
    confirmedTime: {
        type: Date
    },
    deliveredTime: {
        type: Date
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},
{timestamps: true}
);

const Order = mongoose.model("Order", orderSchema);

export default Order;