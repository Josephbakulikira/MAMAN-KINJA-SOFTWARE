import mongoose from 'mongoose';

const billSchema = mongoose.Schema({
    paid: {
        type: Boolean,
        default: false
    },
    payement: {
        type: String,
        default: "cash", // cash, airtel money, mpesa, carte, credit,
    },
    table: {
        type: String,
        required: [true, "numero de table est obligatoire"]
    },
    waiter: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "le nom du serveur est obligatoire"]
    },
    total: {
        type: Number,
    },
    clientId: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    note: {
        type: String
    },
    items: [],
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    processed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
);

const Bill = mongoose.model("Bill", billSchema);

export default Bill;