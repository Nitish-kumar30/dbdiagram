import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      trim:true,
      default:'User',
      maxlength: 80,
    },
    email:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      maxlength:160,
    },
    password:{
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {timestamps: true },
);



export default mongoose.model('User', userSchema);
