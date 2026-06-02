import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export async function register(req,res,next){
  try{

    const { name,email,password} = req.body;

    if(!email || !password){

      return res.status(400).json({message: "email and pass required"});
    }

    const existingUser =await User.findOne({email});


    if(existingUser){


      return res.status(409).json({ message:"email is already registered"});
    }

    const hashedPassword =await bcrypt.hash(password, 12);
    const user = await User.create({name,email,password:hashedPassword});

    

    res.status(201).json({token:createAuthToken(user), user:formatUser(user)});
  }catch (error){
    next(error);
  }
}

export async function login(req, res, next) {
  try{

    const {email, password} = req.body;

    if(!email||!password){

      return res.status(400).json({ message:"email and pass required" });
    }

    const user = await User.findOne({ email });
    if(!user){
      return res.status(401).json({message:"Invalid email or pass" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({message:"Invalid email or pass"});
    }


    res.json({token: createAuthToken(user),user: formatUser(user) });
  }catch (error) {
    next(error);
  }
}

function createAuthToken(user){
  return jwt.sign(
    {email:user.email, name:user.name},
    process.env.JWT_SECRET,
    {
      subject:user.id,
      expiresIn:process.env.JWT_EXPIRES_IN ||"7d",
    },
  );
}


export async function me(req, res) {
  res.json({ user: formatUser(req.user) });
}
function formatUser(user) {
  return {id:user.id, name:user.name, email:user.email};
}