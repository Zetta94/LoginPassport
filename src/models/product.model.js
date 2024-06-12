import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 300 },
    price: { type: Number, required: true}, 
    status: { type: Boolean, required: true},
    code: { type: String, required: true},
    stock: { type: Number, required: true},
    category: { type: String, required: true, max: 100 },
    thumbnail: { type: String, required: true }
});

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productCollection, productSchema)

export default productModel