import mongoose from 'mongoose';

const inventorySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User Id est obligatoire"]
    },
    activities: [],
    description: {
        type: String,
    }
},
{
    timestamps: true
}
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;