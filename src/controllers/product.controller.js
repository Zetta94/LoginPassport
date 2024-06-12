import productModel from "../models/product.model.js"

export default class ProductManager{
    async getProduct(pid) {
        try {
            const productFind = await productModel.findById(pid)
            return productFind
        } catch (error) {
            console.log(error)
        }
    }
}