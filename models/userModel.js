const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    departmentName:{
        type:String,
        required:[true, "User name must be provided"],
        trim:true,
        maxlength:[255, 'Name can not be more than 255 characters'], 
        minlength:[2, 'Name can not be less than 2 characters']
    },
    email:{
        type:String,
        required:[true, 'User email must be provided'],
        trim:true
    },
    password:{
        type:String,
        required:[true, 'User password must be provided'],
        trim:true,
        maxlength:[20, 'password can not be more than 20 characters'], 
        minlength:[2, 'Name can not be less than 3 characters']
    },
    binPoints:{
        type:Number,
        default:0
    },
    reward:{
        type:String,
        default:""
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    

})

UserSchema.pre('save', async function (next) {
    const user = this;
  
    if (!user.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  });
  
  

module.exports = mongoose.model('User', UserSchema)