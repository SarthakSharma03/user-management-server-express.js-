import { jsonResponse } from "../utility/jsonResponse.js";
import { verifyToken } from "../utility/token.js";

export const checkIsAdmin=(req,res,next)=>{
  try { verifyToken(req,res); } 
  catch (e) { 
    return jsonResponse(res,{message:"unauthorized"}
    );}
    next()
}

