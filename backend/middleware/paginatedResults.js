module.exports=function paginatedResults(model){
    return async (req,res,next)=>{
        
        try {
            
            
        
        const limit = 5;
        const page = parseInt(req.query.page)
        console.log(page)
        const startIndex = (page -1) * limit;
        const endIndex = page * limit

        const results = {}
        results.results = await model.find().populate('user','name').sort({date:-1}).limit(limit).skip(startIndex).exec()
        results.count = await model.countDocuments()
        res.paginatedResults = results
        
        next()



            


        } catch (error) {
            res.status(500).json({ message: e.message })            
        }

    }
}