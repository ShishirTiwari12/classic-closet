const User=require('../models/user');



const signup=async(req,res)=>{
    const {username,email,password}=req.body;

    if(!email || !username || !password){
        return res.send('<h1> all fields are required</h1>');
    }
    

    try{

        const isExistingUser=await User.find({email:email});
            if(isExistingUser.length>0){
                return res.json({message : "email already used"});
            }
            await User.create({username,email,password});
            return res.redirect('/auth.html');
        }
    catch(err){
        return res.send('<h1>database error :<a href="/signup.html">clicke here to go back</a></h1>');
    }
}

const login= async (req,res)=>{
    const {email,password}=req.body;
    try{
        if(email == 'admin' && password == 'admin123'){
            req.session.user={email,username:'admin'};
            return res.json({location:'/admin',});
        }
        const existingUser=await User.findOne({email:email});
        if(!existingUser){
            return res.send('<h1>account not found</h1><a href="/index.html">click here to go back</a>');
        }
        if(existingUser.password != password){
            return res.json({message:"incorrect password",location:'/auth.html'});
        }
        const user=await User.findOne({email:email});
        const username=user.username;
        req.session.user={email,username};
        // return res.send(`<h1>welcome Mr.${user.username} your session created succesfully<a href="../index.html">click to go to homepage</a></h1>`);
        // return res.redirect('http://localhost:3000/index.html');
        return res.json({location:'/',});
    }
    catch(err){
        console.log(`database error : ${err}`);
        return res.send('<h1>database  error </h1><a href="/index.html">click here to go back</a>');
    }
}

const logout = (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            
            return res.json({message : "error logging out"});
        }
        req.session=null;
        return res.json({message :"succesfully logged out", location :'/'});
    })
}
module.exports={signup,login,logout};
