const express = require('express')
const router = express.Router()
const BookController = require('../Controller/BookController')
const UserController = require('../Controller/UserContoller')



// view all books 
router.get('/books',BookController.index)

//view single book
router.get('/book/:bookId',BookController.view)

//new book
router.post('/book',UserController.AllowIfLoingin,UserController.grantAccess('createAny','book') ,BookController.new)


//update book 
router.put('/book/:bookId',UserController.AllowIfLoingin,UserController.grantAccess('updateAny','book'),BookController.update)

//delete book
router.delete('/book/:bookId',UserController.AllowIfLoingin,UserController.grantAccess('deleteAny','book'),BookController.delelte)



// //login 
// router.post('/login', Controller.login)

// // view user
// router.get('/user/:userId', Controller.AllowIfLoingin, Controller.getUser)

// //view all users 
// router.get('/users',Controller.AllowIfLoingin, Controller.grantAccess('readAny','profile'), Controller.getUsers)

// //update user 
// router.put('/user/:userId',Controller.AllowIfLoingin,Controller.grantAccess('updateAny','profile'),Controller.updateUser)

// //delete user 
// router.delete('/user/:userId',Controller.AllowIfLoingin,Controller.grantAccess('deleteAny','profile'),Controller.deleteUser)

// router.get('/users/active',Controller.active)

module.exports = router;