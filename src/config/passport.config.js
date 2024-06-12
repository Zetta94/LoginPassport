import passport from "passport"
import GitHubStrategy from "passport-github2"
import local from "passport-local"
import MODEL_USER from "../models/user.model.js"
import utils from "../utils.js"

const { createHash, isValidPassword } = utils

const LocalStrategy = local.Strategy

const initializePassport = () => {

    //Estategia de Git
    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await MODEL_USER.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 20,
                    email: profile._json.email,
                    password: "",
                    role: "usuario"
                }
                let result = await MODEL_USER.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    // Estrategia de registro
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            try {
                let user = await MODEL_USER.findOne({ email: username })
                if (user) {
                    console.log("User exists")
                    return done(null, false)
                }
                const isAdmin = email.startsWith('admin')
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role: isAdmin ? 'admin' : 'usuario'
                }
                let result = await MODEL_USER.create(newUser)
                return done(null, result)
            } catch (error) {
                return done(error)
            }
        }
    ))

    // Estrategia de login
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await MODEL_USER.findOne({ email: username })
                if (!user) {
                    console.log("User not exists")
                    return done(null, user)
                }
                if (!isValidPassword(user, password)) {
                    console.log("Password is not ok")
                    return done(null, false)
                }
                console.log("user: ", user)
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))


    // Serialización del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    // Deserialización del usuario
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await MODEL_USER.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}

export default  initializePassport
