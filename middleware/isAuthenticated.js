const isAuthenticated = async (req,res,next)=>{
    if(!req.session.user){
        return res.redirect('http://localhost:3000/auth.html');
    }
    else{
        next();

    }
}

module.exports=isAuthenticated;