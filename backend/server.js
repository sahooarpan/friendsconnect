const express = require("express");
const app = express();
const connectDB = require('../config/db');
const bodyParser = require('body-parser')
const path = require('path')


connectDB();
app.use(bodyParser.json())
app.use('/api/uploadRoute',require('./routes/uploadRoute'))
app.use('/api/users',require('./routes/users'))
app.use('/api/posts',require('./routes/posts'))


app.use('/uploads',express.static(path.join(__dirname,'/../uploads')))


if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
});
}


const port =  process.env.PORT || 5000


app.listen(port, () => { console.log("Server started at http://localhost:5000") })
