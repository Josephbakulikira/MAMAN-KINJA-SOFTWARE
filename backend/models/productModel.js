import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String
    },
    stock: {
        type: Number,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    description: {
        type: String,
    }
},
{
    timestamps: true
}
);

const Product = mongoose.model("Product", productSchema);

export default Product;