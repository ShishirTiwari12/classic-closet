const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const connectDb=async ()=>{
    await mongoose.connect(process.env.URI).then(()=>{
        console.log("database connected succesfully");
    }).catch((err)=>{
        console.error(`error connecting database ${err}`);
    })
}

module.exports=connectDb;