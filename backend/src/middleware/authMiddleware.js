import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authMiddleware(req, res, next){
  try{
    const header = req.headers.authorization ||"";
    const [scheme, token] =  header.split(" ");

    if (scheme!=="Bearer" || !token){

      return res.status(401).json({message:"authentication required" });
    }

    const payload =jwt.verify(token,process.env.JWT_SECRET);
    const user =await User.findById(payload.sub);

    if(!user){
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  }catch(error){
    return res.status(401).json({message:"invalid or expired token"});
  }
}
