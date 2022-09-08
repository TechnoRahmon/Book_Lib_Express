const { json } = require('body-parser')
const Book = require('../models/BookModel')


/****************************************************/
        // view all books function
/****************************************************/
exports.index =  (req,res,next)=>{

    if (res.locals.loggedInUser && res.locals.loggedInUser.role == 'AdminUser'){
            /***************************for AdminUser *************************/
                // view all data 
                Book.getAll((err,books)=>{
                        if(err) {throw err}
        
                        // check if the db (books) is empty
                        if(books.length > 0){
                            res.status(200).json({
                                message:'view All Books', 
                                books:books
                            })
        
                        }else{
                                res.status(200).json({
                                message:"view all books",
                                books:'there is no data to view '
                                })
                            }
                    })
        
                
    }else if(!res.locals.loggedInUser || res.locals.loggedInUser.role =='BasicUser'){
            /***************************for BasicUser And Guest*************************/
                // view all book information without rates details.    
                Book.getOnlyWithTotalRates.then(data=>{
                    if(data.length > 0){
                        res.status(200).json({
                            message:"view all books",
                            books:data 
                        })
        
                    }else{
                        res.status(200).json({
                            message:"view all books",
                            books:'there is no data to view '
                        })
                        }
                     
                }).catch(err=>{
                    res.status(200).json({
                        error:err,
                        })
                  
                        
                    })
            }
   
 

}
/****************************************************/
            // view single book function
/****************************************************/
exports.view =async (req,res,next)=>{

/********************** for AdminUser ******************************/
    if(res.locals.loggedInUser && res.locals.loggedInUser.role =='AdminUser'){
        

            try {
                const bookId = req.params.bookId
                let book = await (await Book.findById(bookId))
                //console.log(book);
                if (!book){
                    res.json({
                        message:'book does not exisit'
            
                    })
                    }else{
            
                        res.json({
                            status:'success',
                            message:book
                
                        })
                    }   
            
               } catch (error) {
                  res.json({
                      error : error.kind
                  })
                }
      
        

/********************** for guest and basicUser ******************************/
    }else if(!res.locals.loggedInUser || res.locals.loggedInUser.role =='BasicUser'){
        try {
            const bookId = req.params.bookId
            let book = await (await Book.findById(bookId,{rates:0}))
            //console.log(book);
            if (!book){
                res.json({
                    message:'book does not exisit'
        
                })
                }else{
        
                    res.json({
                        status:'success',
                        message:book
            
                    })
                }   
        
           } catch (error) {
              res.json({
                  error : error.kind
              })
            }
    }
 
  
 
}

/****************************************************/
            // add new book function
/****************************************************/
exports.new = (req,res)=>{

    var book = new Book(); 
    console.log(req.body);
    book.title= req.body.title? req.body.title: book.title ; 
    book.author = req.body.author; 
    book.genre = req.body.genre; 
    

    //save the book and check for err 
    book.save((err)=>{
        if (err) res.json(err)
        res.json({
            message:"New book created !",
            data:book
        })
    })
}



/****************************************************/
            // update  book function
/****************************************************/
exports.update=  (req,res)=>{
    Book.findById(req.params.bookId,(err,book)=>{

        //if wrong book id
        if(err)res.json({error:'wrong book id'})
        
        // if book exisit
        if (book){

/********************************for BasicUser*****************************************/
            if(res.locals.loggedInUser.role == 'BasicUser'){
            // if Basic user updating a book >> update only the rate
            // push the rating data in rate array !
                console.log('PUSING DATA .....');
                book.rates.push({
                    stars: Number(req.body.stars),
                    _id : res.locals.loggedInUser._id
                })
                // calculating avreage of the new stars
                let total=0
                 book.rates.forEach(element => {
                        total+= element.stars
                 });
                book.TotalRates = Number((total/book.rates.length).toFixed(2))
                
             
             
                
    
/********************************for AdminUser*****************************************/
            }else if(res.locals.loggedInUser.role == 'AdminUser'){
                // if adminUser updating book
                console.log(req.params.bookId);
                
                book.title= req.body.title? req.body.title: book.title ; 
                book.author = req.body.author; 
                book.genre = req.body.genre; 
                if(req.body.stars){
                    //if rates is empty
                    book.rates.push({
                        stars: Number(req.body.stars),
                        _id : res.locals.loggedInUser._id
                    })
                }
            }
/********************************save IN DB*****************************************/
                book.save((err)=>{
                        if(err)res.json(err)
        
                        res.json({
                            message:"Book info updated!",
                            data :book
                        })
                    })
        //if the book does not exisit return error message 
        }else{
            res.status(200).json({
                status:'unsuccess',
                message:'the book does not exisit'
            })
        }
        
  
    })
}


/****************************************************/
            //Handle delete book
/****************************************************/
 
exports.delelte = (req,res)=>{
    //let book = Book.findById()
    //console.log();
    Book.deleteOne({
        _id:req.params.bookId
    },(err,book)=>{
        if (err)res.send(err)
        if(book.deletedCount==0){
            res.json({
                status:"unsccess",
                message:'book does not exisit'
                
            })
        }else{
            res.json({
                status:"success",
                message:'1 book deleted'
                
            })
        }
      
    })
}

