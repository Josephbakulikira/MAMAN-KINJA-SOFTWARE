import mongoose from 'mongoose';

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "le nom de la nourriture est obligatoire"]
    },
    image: {
        type: String
    },
    quantity: {
        type: Number,
        required: false,
    },
    hasStock: {
        type: Boolean,
        default: false,
    },
    stockRef: {
        type: mongoose.Schema.ObjectId,
    },
    stockOffset: {
        type: Number 
    },
    price: {
        type: Number,
        required: [true, "le prix est obligatoire"]
    },
    type: {
        type: String,
        default: "nourriture" // nourriture or boisson
    },
    description: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Item UserId est obligatoire"]
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Item UserId est obligatoire"]
    }
},
{
    timestamps: true
}
);

const Item = mongoose.model("Item", itemSchema);

export default Item;