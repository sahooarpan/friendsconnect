const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref:"User"    
  },
  heading: {
    type: String,
    required: true
  },

  content:{
    type: String,
    required: true
  },
  image:{
      type:String,
      required:true
  },
  
  name: {
    type: String
  },
 
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref:"User"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref:"User"
      },
      
      text: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);