const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {roles} = require('../roles/roles.js')

// hash password function 

const hashPassword = async (password)=>{  s = await bcrypt.hash(password,10); return s }

// valid password function 

const validatePassword = async (plainPassword, Password)=>{
        return  await bcrypt.compare(plainPassword,Password);
}

// grantAccess function 

exports.grantAccess = (action, resource)=>{
        return (req,res,next)=>{

                try {
                    const permission =  roles.can(req.user.role)[action](resource);
                    console.log('PERMISSION IS '+permission.granted);
                    //if permission not granted
                    if(!permission.granted){
                        return res.status(401).json({error:'You don"t have enough permission to preform this action'})
                        
                        
                    }else {  
                    // if update has rate, trigger pass noly rate value from DB to rate function
                     next()
                    
                    }
                   
                   

                } catch (error) {   next(error)}
            }
    }


exports.AllowIfLoingin = async (req,res,next)=>{
        
        try {
            const user = res.locals.loggedInUser;
            if(!user) return res.status(401).json({ error:'You need to logged in to access this route'})
                req.user = user;
                next()

        } catch (error) {
            next(error)
        }
}



exports.signup = async (req,res,next)=>{
    try {
        const {role ,email,password,name} = req.body
        console.log(req.body);
        const hashedPassword = await hashPassword(password); console.log(hashedPassword);
        const newUser = new User({email:email,name:name,password:hashedPassword, role: role||'basic'});
        await newUser.save();

       return res.json({  data:newUser, message:'You have signed up successfully'})
    } catch (error) {
        next(error)
    }
}


exports.login = async (req,res,next)=>{
        try {
            const {email,password} = req.body;
            const user= await User.findOne({email});
            if(!user)return next(new Error('Email not exisit'))
            const validPassword = await validatePassword(password,user.password);
            if(!validPassword)return next(new Error('Passwrod is not correct'))
            const Accesstoken = jwt.sign({userId:user._id},'secretKey',{expiresIn:300})
            res.cookie('token',Accesstoken,{ maxAge:60*1000} )

            await User.findByIdAndUpdate(user._id,{Accesstoken})
            res.status(200).json({
                data:{email:user.email, role:user.role}, Accesstoken
            })


        } catch (error) {
            next(error)
        }
}



exports.getUser = async (req,res,next)=>{
    try {
        
        const userId = req.params.userId
        const user = await User.findById(userId)
        if (!user) return res.json({error:'User does not exisit'})
        res.status(200).json({
            data:user
        })


    } catch (error) {
        next(error)
    }
}

exports.getUsers = async (req,res ,next)=>{
    const users = await  User.find({})
    res.status(200).json({
        data:users
    })
}


exports.updateUser = async (req,res,next)=>{
    try {
        const {role,name,email} = req.body
        const userId = req.params.userId; 
        await User.findByIdAndUpdate(userId ,{role,name,email})
        const user = await User.findById(userId)
        if (!user) return res.json({error:'User does not exisit'})

        res.status(200).json({
            data:user
        })
    } catch (error) {
        next(error)
    }
}


exports.deleteUser = async (req,res,next)=>{
    try {
        const userId  = req.params.userId
        const user = await User.findById(userId)
        console.log(userId);
        if (!user) return res.json({error:'User does not exisit'})

        await User.findByIdAndDelete(userId)
  
        res.status(200).json({
            data:null, message:'User hase been deleted'
        })

    } catch (error) {
        next(error)
    }
}




exports.active= async (req,res,next)=>{
        const users =   await User.find({})
        let activeUsers=[]
        
            try {
                let {userId , exp} =await  jwt.verify(users[0].Accesstoken,'secretKey')
            
                if(exp<  Date.now().valueOf()/1000 ){
                    console.log("JWT token has expired")}
                console.log(users[0].role + ' :active');
           
            res.status(200).json({
                data:users[0].Accesstoken
            })
                
            } catch (error) {
                    if(error instanceof jwt.JsonWebTokenError) console.log("JWT token has expired");
                    else{
                        console.log(error);
                    }
            }
 
}