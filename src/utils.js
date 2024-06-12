import { fileURLToPath } from 'url'
import { dirname } from 'path'
//Bcrypt
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const isValidPassword = (user,password) => bcrypt.compareSync(password,user.password)

export default {__dirname,createHash,isValidPassword}