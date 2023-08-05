const express=require('express')
const ejs=require('ejs')
const path = require("path");
const userRoute = require("./Route/user");
const adminRoute = require("./Route/admin");

const {PORT}=require('./config/index')


const blogRoute = require("./Route/blog");
const auth=require('./Middlewere/auth')
const Blog=require('./models/blog')
const Comment=require('./models/comment')
const Contact=require('./models/contact')



const mongodb=require('./connection')
const cookieParser=require('cookie-parser')

const app=express()
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(__dirname+'/public'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
mongodb()




app.use("/user", userRoute);
app.use("/blog",auth,blogRoute);
app.use("/admin",auth,adminRoute);

app.get('/contact',(req,res)=>
{
  
  return res.render('contact',{active:"contact",user:""})
})
app.post('/contact',async(req,res)=>
{
  const {name,email,message}=req.body
  if(!name || !email || !message)
  {
    return res.render("contact",{error:"given field require",active:"contact",user:""})
  }
  try
  {
    await Contact.create({
      name:name,
      email:email,
      message:message
    })
    return res.render("contact",{
      success:"message has been send",
      active:"contact",
      user:""
    })
  } catch(error)
  {
    console.log(error)
  }


})
app.get("/",async (req, res) => {
    if(req.user)
    {
        return res.redirect('/blog')
        
    }
    try {
        const allBlogs = await Blog.find({}).sort({createdAt:'desc'}).exec();

        // for take some text
        const temp=[];
        allBlogs.forEach(element => {
          temp.push({title:element.title.slice(0,20)+".......",
            body:element.body.slice(0,200)+"...........",
            coverImageURL:element.coverImageURL,
            _id:element._id,
            
          })
          
        });

        
        
        
        res.render("home", {
          user: req.user,
          username:req.username,
          blogs: temp,
          active:"home"
         
        });
     
        
    } catch (error) {
        console.log(error)
    }
})
app.get("/:id", async (req, res) => {
    try {
      
      const blog = await Blog.findById(req.params.id).populate("createdBy");
      console.log(blog)
      const comments = await Comment.find({ blogId: req.params.id }).sort({createdAt:'desc'}).populate(
        "createdBy"
      );
      // console.log(comments)
    
      return res.render("blog", {
        user: req.user,
        username: req.username,   
        blog,
        comments,
        active:"blog",
      });
    } catch (error) {
      console.log(error)
    }
  });
  


app.listen(PORT,(req,res)=>
{
    console.log(`server is running at ${PORT}`)
})
