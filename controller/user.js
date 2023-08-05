const Joi=require('joi')
const cookieParser=require('cookie-parser')
const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
const User=require('../models/user')
const {signToken,verifyToken}=require('../Services/jwt')


async function signInUser(req,res)
{
    
    
    const schema=Joi.object({
        name:Joi.string().min(4).max(18).required(),
        username:Joi.string().alphanum().min(4).max(18).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(4).max(10).required(),
        comfermPassword:Joi.ref('password')
    })
    const {error}=schema.validate(req.body)
    if(error)
    {
        
        return res.render('resister',{
            error:error.message,active:"resister"
        })
        
        
    }
    const {name,username, email, password } = req.body;

    try {
      const emailInUse = await User.exists({ email });

      const usernameInUse = await User.exists({ username });

      if (emailInUse) {       

        return res.render('resister',{
            error:"Email already registered, use another email!",
            active:"resister"
        })
        
      }

      if (usernameInUse) {
        
        return res.render('resister',{
            error:"Username not available, choose another username!",
            active:"resister"
        })
        

        
      }
    } catch (error) {
        
        return res.render('resister',{
            error:error,
            active:"resister"
        })
    }

    // 4. password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. store user data in db  
   
    try {
      const userToRegister = new User({
        name,
        username,
        email,        
        password: hashedPassword,
      });

      const user=await userToRegister.save();
     
    
      
     return res.redirect("/user/login");
    
    }
    catch(e)
    {
        return res.send(e)
    }

}
async function logInUser(req,res)
{
    const {username,password}=req.body
    try {
        if(!username || !password)
        {
            return res.render("login",{
                error:"Given field required",
                active:"login"
            })
           
        }
       const user= await User.findOne({username:username})
        if(!user)
        {
            return res.render("login",{
                error:"Incorrect User or Password ",
                active:"login"
            })
        }
        // console.log(user)
        const varify=await bcrypt.compare(password,user.password)
        
        if(!varify)
        {
            
            return res.render("login",{
                error:"Incorrect User or Password ",
                active:"login"
            })
        }
        const token=signToken({userId:user._id,username:username},"30m")
        res.cookie("TOKEN",token)
        return res.redirect("/blog");
    } catch (error) {
        return res.send(error)
    }
}
async function logout(req,res)
{
    res.clearCookie('TOKEN')
    return res.redirect("/blog");
}
module.exports={signInUser,logInUser,logout}