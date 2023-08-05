const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const auth=require('../Middlewere/auth')
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });



router.post("/add", upload.single("coverImage"),async (req, res) => {
  const { title, body } = req.body;
  console.log(req.user)
  try {
    
    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user,
      coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.log(error)
  }
  // return res.render('addBlog')
});
router.get("/add",async (req, res) => {
 
  return res.render("addBlog", {
    user: req.user,
    username: req.username,
    item:"",
    role:req.role,
    active:"addBlog"
  });
});




router.get("/", async (req, res) => {
  try {
      const allBlogs = await Blog.find({}).sort({createdAt:'desc'}).exec();
      
        // for take some text
        const temp=[];
        allBlogs.forEach(element => {
          temp.push({title:element.title.slice(0,20)+".......",
            body:element.body.slice(0,200)+"...........",
            coverImageURL:element.coverImageURL,
            _id:element._id,
            createdBy:element.createdBy
          })
        })
    res.render("home", {
      user: req.user,
      username: req.username,
      blogs: temp,
      active:"home",
      role:req.role
    });
  } catch (error) {
    console.log(error)
  }
  
});


router.post("/comment/:blogId", async (req, res) => {
  try {
    
    const comments=await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user,
    });
    
    // console.log(comments)
  
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    
  }
});

router.get("/delete/:blogId",async(req,res)=>
{
  
  try {

    // console.log(req.params.blogId)
    if(req.role=="ADMIN")
    {
      const item=await Blog.findOneAndDelete({_id:req.params.blogId})
      if(!item)
    {
      return res.redirect('/blog')
    }
      await Comment.deleteMany({blogId:item._id})
      return res.redirect('/blog')

    }
    const item=await Blog.findOneAndDelete({_id:req.params.blogId,createdBy:req.user})
    if(!item)
    {
      return res.redirect('/blog')
    }
    
    await Comment.deleteMany({blogId:item._id})
   

    return res.redirect('/blog')
    
  } catch (error) {
    console.log(error)
  }

})


router.get("/:id", async (req, res) => {
  try {
    
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    // console.log(blog)
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
      role:req.role
    });
  } catch (error) {
    
    console.log(error)
  }
});
router.get('/update/:blogId',async(req,res)=>
{
  
  try {
    if(req.role=="ADMIN")
    {
      const item=await Blog.findOne({_id:req.params.blogId})
      if(!item)
      {
        return res.redirect('/blog')
      }
      return res.render('update',{
        item:item,
        user: req.user,
        username: req.username,

        
        role:req.role
      })
    }
    const item=await Blog.findOne({_id:req.params.blogId,createdBy:req.user})
    if(!item)
    {
      return res.redirect('/blog')
    }
    return res.render('update',{
      item:item,
      
      role:req.role,
      username: req.username,

      user:req.user
    })
  } catch (error) {
    console.log(error)
  }
  
})
router.post('/update/:blogId',async(req,res)=>
{
  try {
    
    const item=await Blog.findByIdAndUpdate({_id:req.params.blogId},
      { $set:{
        title:req.body.title,
        body:req.body.content

      }})
      return res.redirect(`/blog/${item._id}`);
  } catch (error) {
    console.log(error)
  }
  
})









module.exports = router;
