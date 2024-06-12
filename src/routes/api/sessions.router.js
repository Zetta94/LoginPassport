import { Router } from 'express'
import passport from 'passport'
const router = Router()


router.post('/register', passport.authenticate('register', {
    successRedirect: '/login',
    failureRedirect: '/register',
    failureFlash: true
}),(req,res)=>{
    res.send({status:"success",message : "New User Registered"})
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/login'}),async (req,res)=>{
    if(!req.user) return res.status(400).send({status: "error", error: "Incomplete data"})
    try{
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }
        console.log(req.session.user)
        res.redirect('/products')   
    }catch(error){
        res.status(500).send({error:"error",message: error.message})
    }
})

router.get('/github',passport.authenticate('github',{ scope: ['user:email']}), async(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
    req.session.user = req.user
    res.redirect('/products')
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión')
        res.redirect('/login')
    })
})

export default router