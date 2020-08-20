
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const nodemailer  = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const SEND_GRID_API_KEY = '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'

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:SEND_GRID_API_KEY
  }
}))


const { check,validationResult } = require("express-validator");
const isAuth = require('../middleware/auth')
const User = require("../../models/User");
const auth = require('../middleware/auth');

router.get("/", isAuth, async (req, res) => {
  try {
    const id = req.user._id?req.user._id:req.user.id;
    console.log(id)
    const user = await User.findById(id).select("-password").select("-confirmPassword");
    console.log(user,"usser")
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});




router.get("/:id", isAuth, async (req, res) => {
  try {
    
    const user = await User.findById(req.params.id);
    console.log(user,"usserid")
    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});







router.post('/register',[
    check('name','Name is required').not().isEmpty(),
    check('email','Include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more charecters').isLength({min:6}),
    check('confirmPassword','Please enter a password with 6 or more charecters').isLength({min:6})
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name,email,password,confirmPassword,image } =req.body;
    try {
        let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      user = new User({
        name,
        email,
        password,
        confirmPassword,
        image
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password,salt);
      const isMatch =await bcrypt.compare(confirmPassword,user.password);
      console.log(isMatch);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Both passwords must be same"}] });
      }
      await user.save();

    await  transporter.sendMail({
        to:user.email,
        
        subject:'Registration sucess',
        html:'<h3>Welcome to FriendsConnect!!</h3>'

      })

      console.log(user);
      const payload ={
          user
      };
      jwt.sign(payload,config.get("jwtSecret"),{
          expiresIn:'5 days'
      },(err,token)=>{
          if(err)throw err;

          res.json({token});
      }) 
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }

})

router.delete("/:id",isAuth,async(req,res)=>{
    const user = await User.updateMany({},{$pull:{following:"5f1c5db2ace95b2b8071a859"}});
    console.log(user);
})




router.post(
    "/signin",
    [
      check("email", "Please include a valid email").isEmail(),
      check("password", "Password is required").exists(),
    ],
    async (req, res) => {
      //console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
  
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "No user with this email.Please register" }] });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }
  
        const payload = {
          user: {
            id: user.id,
          },
        };
  
        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
      }
    }
  );

  router.get("/auth", async (req, res) => {
    try {

      console.log(req.user)
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  });

  router.delete("/:id",async(req,res)=>{
      try {
        
      const user = await User.findById(req.params.id);
      if(!user){
          res.status(404).json({msg:'User not found'})
      }   
      await user.remove();
      res.json({msg:"User deleted"});
      } catch (error) {
          res.status(500).json({msg:error.message})
      }
  })

router.get("/",async(reeq,res)=>{
    const users = await User.find();
    res.send(users);
})

router.put('/edit/:id',isAuth,async(req,res)=>{
  try {

    // if(req.user.id!==req.params.id){
    //   res.status(401).send({msg:"You are not authorized to edit other profile"})
    // }
    let user = await User.findById(req.params.id);
    
    let { name,image,email } = req.body
    let salt = await bcrypt.genSalt(10);
    // let isMatch=false
    //   password = await bcrypt.hash(password,salt)   
    //   isMatch =await bcrypt.compare(confirmPassword,user.password);
    //   console.log(isMatch);
        
  
      
        // confirmPassword = await bcrypt.hash(confirmPassword,salt);
        // console.log(confirmPassword)

    
    
    if(user){
    console.log(user) 
    await User.updateOne({_id:req.params.id},{$set:{name:req.body.name,image:req.body.image,email:req.body.email}})
    user = await User.findById(req.params.id) 
    res.status(200).send(user)
            
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


  router.get('/name/:id',isAuth,async(req,res)=>{
    try {
      
      const name = await User.findOne({_id:req.params.id},{name:1});
      console.log(name)
      res.send(name)

    } catch (error) {
      console.log(error)
    }
  })



  router.put("/follow/:id",isAuth,async(req,res)=>{
    try {
      
        if(req.user.id===req.params.id){
          res.status(400).send({msg:"You cannot follow yourself"})
        }  
        const myProfile = await User.find({following:req.params.id.toString(),_id:req.user.id});
        console.log(req.user.id);
        console.log(req.params.id)
    
        console.log(myProfile)
        //const followingID = await User.findById(req.user.id).select("-password");
        if(!myProfile.length){
              await User.update({
                _id:req.user.id
            },{
                $push:{following:req.params.id}
            })
            await User.update({
                _id:req.params.id

            },{
                $push:{followers:req.user.id}

            })
            }
            
            else{
                res.json({msg:"You already followed him/her"})
            }
     
        //const followingProfile = await User.findById(req.params.id)    
            
         res.json(myProfile.following)

        }
     catch (error) {
        console.log(error.message)
    }
  })


  router.put("/unfollow/:id",isAuth,async(req,res)=>{
    try {
        
        const user = await User.find({following:req.params.id.toString(),_id:req.user.id});
        console.log(req.user.id);
        console.log(req.params.id)
    
        console.log(user);
        if(!user.length){
            res.json({msg:"You did not follow him /her"})
        }
        console.log("Before unfollowing");
        const myProfile = await User.findById(req.user.id);
        const followingProfile = await User.findById(req.params.id);
        console.log(myProfile,followingProfile)


        await User.update({_id:req.user.id},{
            $pull:{following:req.params.id}
        })

        await User.update({_id:req.params.id},{
            $pull:{followers:req.user.id}
        })
        console.log("After unfollowing");
        console.log(myProfile,followingProfile)
        // res.send("You unfollowed him/her")
        // //const followingID = await User.findById(req.user.id).select("-password");
        // if(!myProfile.length){
        //     await User.update({
        //         _id:req.user.id
        //     },{
        //         $push:{following:req.params.id}
        //     })
        //     await User.update({
        //         _id:req.params.id

        //     },{
        //         $push:{followers:req.user.id}

        //     })
        //     }
            
        //     else{
        //         res.json({msg:"You already followed him/her"})
        //     }
     
        // //const followingProfile = await User.findById(req.params.id)    
            
        res.json(myProfile.following)

        }
     catch (error) {
        console.log(error.message)
    }
  })
  router.get("/followers/:id",isAuth,async(req,res)=>{
    console.log(req.params.id)
    //console.log(req.params.id)
    const user = await User.findById(req.params.id);
    
      const followers = await User.find({_id:{$in:user.followers}},{id:1,name:1,image:1,email:1}).sort({$natural:-1});
      console.log(followers)
      res.send(followers);
    
  })

  router.get("/following/:id",isAuth,async(req,res)=>{
    console.log(req.params.id)
    const user = await User.findById(req.params.id);
    
      const following = await User.find({_id:{$in:user.following}},{id:1,name:1,image:1,email:1}).sort({$natural:-1});
      console.log(following)
      res.send(following);
    
    })

router.post('/getUsers',isAuth,async(req,res)=>{
  try {
    console.log(req.body.query)
    let userPattern = new RegExp("^"+req.body.query);
    console.log(userPattern)
    const users = await User.find({name:{$regex:userPattern,$options:'i'}}).select("_id name image")
    console.log(users)
    res.status(200).send(users)
    


  } catch (error) {
    res.send(error.message);
  }
})







module.exports= router;