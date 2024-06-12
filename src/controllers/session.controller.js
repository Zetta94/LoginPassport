import MODEL_USER from '../models/user.model.js'
import utils from '../utils.js'
const {isValidPassword} = utils

//Con la implementacion de passport, este archivo queda sin uso por el momento.

export default class SessionManager {
    async register(first_name, last_name, email, age, password) {
        const exists = await MODEL_USER.findOne({ email })
        if (exists) {
            return { code: 400, status: 'User exists' }
        }

        const isAdmin = email.startsWith('admin')

        const user = {
            first_name,
            last_name,
            email,
            age,
            password,
            role: isAdmin ? 'admin' : 'usuario'
        }
    
        const result = await MODEL_USER.create(user)
        return { code: 200, status: `Usuario creado con id: ${result.id}` }
    }

    async login(email, password) {
        try {
            // El 1 es para que dentro de la base de datos tenga un valor y así buscarlo.
            const user = await MODEL_USER.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1 })
    
            if (!user) {
                return { code: 401, status: "User not exist" }
            }
    
            if (!isValidPassword(user, password)) {
                return { code: 403, status: "Incorrect Password" }
            }
    
            // Eliminar el password del objeto usuario antes de devolverlo
            const { first_name, last_name, email: userEmail, age, role } = user
            const sessionUser = {
                name: `${first_name} ${last_name}`,
                email: userEmail,
                age: age,
                role: role,
            }
    
            return { code: 200, message: `Bienvenido ${sessionUser.name}`, sessionUser }
        } catch (error) {
            // Manejo de errores genérico
            return { code: 500, status: "Internal Server Error", error: error.message }
        }
    }
    
      
}