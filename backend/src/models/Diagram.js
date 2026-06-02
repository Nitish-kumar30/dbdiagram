import mongoose from 'mongoose';

const diagramSchema = new mongoose.Schema(
  {
    title:{
      type:String,
      default:'Untitled Diagram',
      trim:true,
      maxlength:120,
    },
    schema: {
      type:String,
      default: '',
      maxlength: 200000,
    },
    shareToken:{
      type:String,
      unique:true,
      sparse:true,
      index:true,
    },
    isPublic:{
      type: Boolean,
      default: false,
    },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required:true,
      index:true,
    },
  },
  {timestamps:true },
);


export default mongoose.model('Diagram', diagramSchema);
