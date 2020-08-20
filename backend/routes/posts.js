const express = require('express');
const { check,validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../../models/Post')
const User = require("../../models/User");
const { Types } = require('mongoose');
const paginate = require('../middleware/paginatedResults')



// router.delete("/",async(req,res)=>{
//     await Post.deleteMany({});
//     res.send("All posts deleted");
// })


router.get("/posts",paginate(Post),async(req,res)=>{
   
    res.send(res.paginatedResults);
})




router.get("/",async(req,res)=>{
    const posts = await Post.find().sort({$natural:-1});
    res.send(posts);
})


router.put('/edit/:id',auth,async(req,res)=>{
    try {
  
      // if(req.user.id!==req.params.id){
      //   res.status(401).send({msg:"You are not authorized to edit other profile"})
      // }
      let post = await Post.findById(req.params.id);
      
      let { heading,image,content } = req.body
      
    if(req.user.id!==post.user.toString()){
        
        
        
        res.status(401).send("You are not authorized to edit")
    }


      // let isMatch=false
      //   password = await bcrypt.hash(password,salt)   
      //   isMatch =await bcrypt.compare(confirmPassword,user.password);
      //   console.log(isMatch);
          
    
        
          // confirmPassword = await bcrypt.hash(confirmPassword,salt);
          // console.log(confirmPassword)
  
      
      
      if(post){
      console.log(post) 
      await Post.updateOne({_id:req.params.id},{$set:{heading:req.body.heading,image:req.body.image,content:req.body.content}})
      post = await Post.findById(req.params.id) 
      res.status(200).send(post)
              
      }
      
      else{
        res.status(404).send("Post not found")
      }
      // if(user){
      //   user.name=req.body.name,
      //   user.email=req.body.email,
      //   user.image=req.body.image,
      //   user.password,
      //   user.confirmPassword
        
      //   const updatedUser = await user.save();
      //   if(updatedUser){
      //     res.status(200).send(updatedUser);
      //   }
      // }
      // return res.status(500).send({ message: ' Error in Updating User.' });
      
    } catch (error) {
      console.log(error.message)
      return res.status(500).send({ message: error.message });
    }
    })
  





router.get("/:id",async(req,res)=>{
    const posts = await Post.find({user:req.params.id}).sort({$natural:-1});
    console.log(posts);
    if(posts){
        console.log(true)
    }
    res.status(200).send(posts);
})




router.post('/',[
auth,
[
    check('heading',"Heading is needed").not().isEmpty(),
    check('content',"Content is needed").not().isEmpty(),
    check('image',"Image is needed").not().isEmpty()
    

]],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try {
    const user = await User.findById(req.user.id).select('-password');
    console.log(user);
    const newPost = new Post({
        heading:req.body.heading,
        name:user.name,
        content:req.body.content,
        image:req.body.image,
        user:req.user.id
    })
    console.log(newPost,"np");
    const post = await newPost.save()
    res.json(post)   
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
        
    }
    


})





router.get("/",async(req,res)=>{
    try {
        
        const posts = await Post.find({}).sort({date:-1});
        res.json(posts);


    } catch (error) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

router.get('/post/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findOne({_id:req.params.id})
        .populate('comments.user',"name image")
        if(!post){
            return res.status(404).json({
                msg:'Post not found'
            })
        }

        res.json(post);
    } catch (err) {
        console.log(err.message);
        if(err.kind==='ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server error');
        
    }


 })

 
 
router.delete("/:id",auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post not found"})
        }
        if(post.user.toString()!==req.user.id){
            return res.status(401).json({msg:"User not Authorized"})
        }
        await post.remove();
        res.json({msg:"Post was removed"});
    } catch (error) {
        console.log(err.message);
        if(err.kind==='ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        res.status(500).send('Server error');
    }
})


router.put("/like/:id",auth,async(req,res)=>{
    let post = await Post.findOne({$and:[{_id:req.params.id},{'likes.user':req.user.id}]})
   console.log("post",post)
    if(!post){
    await Post.updateOne({_id:req.params.id},{$push:{likes:{user:req.user.id}}})
    post = await Post.findOne({$and:[{_id:req.params.id},{'likes.user':req.user.id}]})    
    console.log(post.likes)
    res.send(post.likes)    
}else{
        res.status(400).json({msg:"You already liked it :)"})
    }
})


router.put("/unlike/:id",auth,async(req,res)=>{
    let post = await Post.findOne({$and:[{_id:req.params.id},{'likes.user':req.user.id}]})
   console.log("post",post)
    if(post){
    await Post.updateOne({_id:req.params.id},{$pull:{likes:{user:req.user.id}}})
    post = await Post.findOne({_id:req.params.id})    
    console.log(post.likes)
    res.send(post.likes)    
}else{
        res.status(400).json({msg:"You not yet liked it :)"})
    }
})







// router.put("/unlike/:id",auth,async(req,res)=>{
//     try {
//         let post = await Post.findById(req.params.id);
//         console.log(post)
//         if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
//             console.log("err")
//             return res.status(400).json({message:"Post not yet liked by you"});
//         }
//         let removeIndex = await post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
//         console.log(removeIndex,"index")
//         post.likes.splice(removeIndex,1);
        
//         await post.save();
//         res.json(post.likes);
//     } catch (error) {
//         res.status(500).send('Server error');
//     }

// })

router.put("/comment/:id",auth,async(req,res)=>{
   
    try {
        console.log("rid",req.user.id)     
        let post = await Post.findOne({_id:req.params.id})
    

        // let post = await Post.find({'comments.user':req.user.id});
        // console.log(post);
        // res.send('11')
        //let user = await User.findById(req.user.id)
          let newComment = {
            text:req.body.text,
            user:req.user.id
         }; 
         console.log(newComment)
        //  let comm=[]
        //  comm.push(newComment)
        //  console.log(comm)
        // //  res.send(comm)
        //await Post.updateOne({_id:req.params.id},{$push:{comments:{$each:[newComment],$positon:0}}});
        post.comments.unshift(newComment)
        await post.save(); 
         post = await Post.findOne({$and:[{_id:req.params.id},{'comments.user':req.user.id}]})
        console.log(post.comments)
        res.send(post.comments) 
    
    } catch (error) {
        console.log(error.message)
    }
        
    })


router.delete("/comment/:id/:comment_id",auth,async(req,res)=>{
    try {
        
        
        let post = await Post.findOne({_id:req.params.id,'comments.user':req.user.id});
        console.log(post) 
        //post.comments.find(comment=>comment.id===req.params.comment_id);
        if(!post){
            return res.status(401).json({Msg:"You cannot delete the comment as you not commented"})
        }
        let comment = await Post.find({_id:req.params.id,'comments.user':req.user.id},{comments:1})

        // if(comment.user.toString()!==req.user.id){
        //     return res.status(401).json({Msg:"You cannot delete others comment"});
        // }

        await Post.updateOne({_id:req.params.id,'comments.user':req.user.id},{$pull:{"comments":{'user':req.user.id},"comments":{'_id':req.params.comment_id}} })
        post = await Post.findOne({_id:req.params.id})
        res.status(200).send(post.comments);


        // post.comments = post.comments.filter(
        //     ({ id }) => id !== req.params.comment_id
        //   );

        //   await post.save();

        //   return res.json(post.comments)



    } catch (error) {
        console.error(error.message);
      return res.status(500).send('Server Error');
    }
})


// router.get('/getUsers',auth,async(req,res)=>{
//     try {
//         let post = 
//         await Post.findOne({_id:req.params.id})
//     } catch (error) {
        
//     }
// })



// router.get("/:id",async(req,res)=>{

//     const posts = await Post.find({user:req.params.id});
//     console.log(posts)
//     res.status(200).send(posts);
// })





module.exports = router;