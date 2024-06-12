import {Router} from "express"
const router = Router()
import productModel from "../models/product.model.js"
import ProductManager from "../controllers/product.controller.js"
const manager = new ProductManager()
import { isAuthenticated} from '../middleware/auth.js'


router.get('/products',isAuthenticated, async (req, res) => {
    let { limit = 4, page = 1, sort, query } = req.query
    limit = parseInt(limit)
    page = parseInt(page)

    try {
        // Construir filtro de búsqueda
        let filter = {}
        if (query) {
            // Buscar por categoría o disponibilidad
            filter = {
                $or: [
                    { category: query },
                    { available: query.toLowerCase() === 'true' } // Comparar como booleano
                ]
            }
        }

        // Opciones de sorteo
        let sortOptions = {}
        if (sort) {
            sortOptions.price = sort === 'asc' ? 1 : -1
        }

        // Obtener el total de productos que coinciden con el filtro
        const totalProducts = await productModel.countDocuments(filter)

        // Calcular la paginación
        const totalPages = Math.ceil(totalProducts / limit)
        const offset = (page - 1) * limit

        // Obtener productos paginados
        const products = await productModel.find(filter).lean()
            .sort(sortOptions)
            .skip(offset)
            .limit(limit)

        //Obtengo las categorias
        const categories = await productModel.distinct('category')
        // Construir la respuesta
        const response = {
            status: "success",
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `?limit=${limit}&page=${page - 1}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: page < totalPages ? `?limit=${limit}&page=${page + 1}&sort=${sort || ''}&query=${query || ''}` : null
        }
        res.render('products',{response, categories, user: req.session.user })
    } catch (error) {
        console.error("Error fetching products:", error)
        res.status(500).json({ status: "error", message: "Internal server error" })
    }
})

router.get("/product/:pid",async (req,res)=>{
    try{
        const {pid}= req.params
        const product = await manager.getProduct(pid)
        res.render('addProduct',{product})
    
    }
    catch(error) {
        console.error("Error fetching products:", error)
        res.status(500).json({ status: "error", message: "Internal server error" })
    }
})

// router.post('/', async (req, res) => {
//     try{
//         let { title, price, available } = req.body
//         if (!title || !price) {
//             res.send({ status: "error", error: "Faltan parametros" })
//         }
//         let result = await productModel.create({ title, price, available })
//         res.send({ result: "success", payload: result })
//     }catch(error){
//         console.log(error)
//     }
// })

// router.put('/:uid', async (req, res) => {
//     try {
//         let { uid } = req.params
//         let { title, price, available } = req.body

//         if (!title || !price) {
//             return res.send({ status: "error", error: "Faltan parametros" })
//         }
        
//         let productToUpdate = { title, price, available}
//         let result = await productModel.updateOne({ _id: uid }, productToUpdate)

//         return res.send({ result: "success", payload: productToUpdate  })
//     } catch(error) {
//         console.log(error)
//     } 
// })

// router.delete('/:uid', async (req, res) => {
//     let { uid } = req.params
//     let result = await productModel.deleteOne({ _id: uid })
//     res.send({ result: "success", payload: result })
// })

export default router