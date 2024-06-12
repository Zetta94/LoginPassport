import { Router } from "express"
import CartManager from "../controllers/cart.controller.js"

const router = Router()
const manager = new CartManager()

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params
    const cartProducts = await manager.getProductsOfCartById(cid)
    if(cartProducts) {
        res.render('carts',{cartProducts,cid})
    }else {
      res.status(404).json({'error': 'Cart not found'})
    }
})

router.post('/api/carts', async (req, res) => {
    try {
        let status = await manager.addCart()
        res.status(status.code).json({status: status.status})
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        let status = await manager.addProductToCart(cid, pid)
        res.status(status.code).json({status: status.status})
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

router.put('/api/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const { products } = req.body
        const status = await manager.updateCart(cid, products)
        res.status(status.code).json({ status: status.status })
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

router.put('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body
        const status = await manager.updateProductQuantity(cid, pid, quantity)
        res.status(status.code).json({ status: status.status })
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

router.delete('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const status = await manager.removeProductFromCart(cid, pid)
        res.status(status.code).json({ status: status.status })
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

router.delete('/api/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const status = await manager.removeAllProductsFromCart(cid)
        res.status(status.code).json({ status: status.status })
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error}` })
    }
})

export default router