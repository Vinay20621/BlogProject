const express=require('express')
const router=express.Router()
const User=require('../models/user')
const Blog=require('../models/blog')
const Comment=require('../models/comment')
router.get('/users',async(req,res)=>
{
    
    try {
        
        if(req.role!="ADMIN")
        {
            return res.redirect('/blog')
        }
        const allUsers=await User.find({})
        if(!allUsers)
        {
            return res.render('user',{message:"No User is Present",active:"User",role:req.role,user:req.user,username:req.username})
        }
        return res.render('user',{allUsers:allUsers,active:"User",role:req.role,user:req.user,username:req.username})
        
    } catch (error) {
        console.log(error)
    }
})
router.get('/delete/:id',async(req,res)=>
{
    try {
        const comment= await Comment.deleteMany({createdBy:req.params.id})
       const blog= await Blog.deleteMany({createdBy:req.params.id})
        const item=await User.findByIdAndDelete({_id:req.params.id})

    

        

        return res.redirect('/admin/users')
        
    } catch (error) {
        console.log(error)
    }
})
module.exports=router