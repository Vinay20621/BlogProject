const { verifyToken} = require("../Services/jwt");
const User=require('../models/user')

async function auth(req,res,next)
{
  
    // console.log(req.cookies.TOKEN)
    const token=req.cookies.TOKEN
    
    if(!token)
    {
       next();
    }
    try {
      
      const isvalid=verifyToken(token)
      if(!isvalid)
      {
         next();
      }
      req.user=isvalid.userId
      req.username=isvalid.username

      try {
        const FindUser=await User.findById({_id:req.user})
        if(FindUser.role=="ADMIN")
        {
          req.role="ADMIN"
        }
        
      } catch (error) {
      
        
      }
      // req.role=isvalid.role

    
      next();
    } catch (error) {
     
    }
  
  
}

module.exports = auth
