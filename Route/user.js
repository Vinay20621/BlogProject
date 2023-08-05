const express=require('express')
const {signInUser,logInUser,logout}=require('../controller/user')
const router=express.Router()

router.get('/resister',(req,res)=>
{
    return res.render('resister',{active:"resister"})
})

router.post('/resister',signInUser)
router.get('/login',(req,res)=>
{
    return res.render('login',{active:"login"})
})

router.post('/login',logInUser)
router.get('/logout',logout)


module.exports=router