const express = require('express')
const router = express.Router()
const UserController = require('../Controller/UserContoller')



// signup 
// need validation! 
router.post('/user',UserController.signup)

//login 

router.post('/login', UserController.login)

// view user
router.get('/user/:userId', UserController.AllowIfLoingin, UserController.getUser)

//view all users 
router.get('/users',UserController.AllowIfLoingin, UserController.grantAccess('readAny','profile'), UserController.getUsers)

//update user 
router.put('/user/:userId',UserController.AllowIfLoingin,UserController.grantAccess('updateAny','profile'),UserController.updateUser)

//delete user 
router.delete('/user/:userId',UserController.AllowIfLoingin,UserController.grantAccess('deleteAny','profile'),UserController.deleteUser)

//router.get('/users/active',UserController.active)





module.exports= router