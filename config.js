const dotenv = require('dotenv')
dotenv.config();

 module.exports=keys={
    accessKeyId:process.env.accessKeyId || accessKeyId,
    secretAccessKey:process.env.secretAccessKey || secretAccessKey 
}