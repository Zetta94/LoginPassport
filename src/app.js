//Express
import express from 'express'
//Session
import session from 'express-session'
import bodyParser from 'body-parser'
//Handlebars
import utils from './utils.js'
const {__dirname} = utils
import handlebars from 'express-handlebars'
//Mongoose
import mongoose from './config/database.js'
//MongoStore
import MongoStore from 'connect-mongo'
//Rutas
import sessionsRouter from './routes/api/sessions.router.js'
import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/carts.router.js"
import viewsRouter from './routes/views.router.js'
//Passport
import passport from 'passport'
import initializePassport from './config/passport.config.js'
//dotenv
import dotenv from 'dotenv'
dotenv.config()


const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const hbs = handlebars.create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
}))

//Inicializo Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(__dirname + '/public'))

//Rutas
app.get('/',(req,res)=>{
    res.redirect('/login')
})
app.use('/api/sessions', sessionsRouter)
app.use('/', viewsRouter)
app.use('/', cartRouter)
app.use('/', productRouter)

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})