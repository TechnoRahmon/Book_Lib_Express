 const express = require('express')
 const bodyParser = require('body-parser')
 const cookieParser = require('cookie-parser')
 const mongoose = require('mongoose')
 const path = require('path')
 const jwt = require('jsonwebtoken')
const app = express()

 const PORT = process.env.PORT || 7000

 const userRoutes = require('./routes/userRoutes.js')
 const bookRoutes = require('./routes/bookRoutes.js')

const User = require('./models/UserModel')

 // set the bodyparser and cookieparser 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cookieParser())


//check the token in cookies
app.use(async(req,res,next)=>{
    //if the token is exisit in the cookie
    if(req.cookies['token']){

          try {
              // retrive the token 
              const accesstoken = req.cookies['token']
              const { userId , exp } = await jwt.verify(accesstoken,"secretKey")
              // if token has expired 
              if(exp<  Date.now().valueOf()/1000 ){
                return res.status(401).json({error:"JWT token has expired"})  }
                res.locals.loggedInUser = await User.findById(userId)
                //console.log('app :'+res.locals.loggedInUser);

                next()
          } catch (error) {
            next(error)
          }

    }else{
        next()
    }})

//go to routes
app.use('/api',userRoutes)
app.use('/api',bookRoutes)


 /*********************DataBase Connection************************/
let mongoURI = 'mongodb+srv://Admin:<password>@cluster0.tehth5j.mongodb.net/?retryWrites=true&w=majority';
  mongoose.connect(mongoURI,{dbName:'BookLibDB',useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex: true},()=>{
  try {
    console.log('DB is connected ');
  } catch (error) {
    console.log('====================================');
    console.log('something went wrong with MongoDB');
    console.log('====================================');
  }  
  
  })

  /******************************************************************/

// listen port
app.listen(PORT,()=>{
    console.log('server running at port :'+PORT);
})