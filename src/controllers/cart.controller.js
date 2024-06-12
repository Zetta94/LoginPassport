import cartModel from "../models/cart.model.js"

export default class CartManager{
    //Funcion que crea un nuevo carrito
    async addCart() {
        try {
            const newCart = {
                products: []
            }
            const result = await cartModel.create(newCart)
            return { code: 200, status: `New cart - id: ${result.id}` }
        } catch (error) {
            console.log(error)
        }
    }
    //Funcion que busca los carritos existentes
    async getCarts() {
        try {
            const carts = await cartModel.find()
            return carts.map(cart => cart.toObject())
        } catch (error) {
            console.log(error)
        }
    }
    //Funcion que trae un carrito por id
    async getProductsOfCartById(id) {
        try {
            const cart = await cartModel.findById(id).populate('products.product')
            return cart ? cart.products : false
        } catch (error) {
            console.log(error)
        }
    }
    //Funcion que agrega un nuevo producto a un carrito
    async addProductToCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid)
            if (!cart) {
                return { code: 404, status: 'Cart not found' }
            }
            const productExist = cart.products.find(e => e.product.toString() === pid)
            if (productExist) {
                productExist.quantity += 1
            } else {
                cart.products.push({ product: pid, quantity: 1 })
            }
            await cart.save()
            return { code: 200, status: 'Product added' }
        } catch (error) {
            console.log(error)
        }
    }
    //Funcion que elimina todos los productos de un tipo en un carrito
    async removeProductFromCart(cid, pid) {
        try {
            const result = await cartModel.updateOne(
                { _id: cid },
                { $pull: { products: { product: pid } } }
            )
            if (result.acknowledged === true) {
                return { code: 200, status: 'Cart updated - Product deleted' }
            }
            return { code: 404, status: 'Product not found' }
        } catch (error) {
            console.log(error)
        }
    }
    //Funcion que actualiza los productos de un determinado carrito
    async updateCart(cid, products) {
        try {
            const result = await cartModel.updateOne(
                { _id: cid },
                { products: products }
            )
            if (result.acknowledged === true) {
                return { code: 200, status: 'Cart updated' }
            }
            return { code: 404, status: 'Cart not found' }
        } catch (error) {
            console.log(error)
        }
    }
    //Funcion que actualiza la cantidad de productos en un carrito determinado
    async updateProductQuantity(cid, pid, quantity) {
        try {
            const result = await cartModel.updateOne(
                { _id: cid, 'products.product': pid },
                { $set: { 'products.$.quantity': quantity } }
            )
            if (result.acknowledged === true) {
                return { code: 200, status: 'Quantity updated' }
            }
            return { code: 404, status: 'Product not found' }
        } catch (error) {
            console.log(error)
        }
    }
    //Funcion que elimina todos los productos de un carrito
    async removeAllProductsFromCart(cid) {
        try {
            const result = await cartModel.updateOne(
                { _id: cid },
                { products: [] }
            )
            if (result.acknowledged === true) {
                return { code: 200, status: 'All products have been removed from the cart' }
            }
            return { code: 404, status: 'Cart not found' }
        } catch (error) {
            console.log(error)
        }
    }
}