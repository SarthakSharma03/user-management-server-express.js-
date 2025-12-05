import jwt from 'jsonwebtoken'
import {config as envConfig} from 'dotenv'


envConfig()


 const secretKey = process.env.JWT_SECRET

 if (!secretKey){
   throw new Error("Missing JWT_SECRET environment variable")
 }

export function generateToken(payload){
    return jwt.sign(payload ,secretKey,{expiresIn:'1h'})
}

export function verifyToken (req){
  const token = req.headers.authorization?.split(' ')[1]
  console.log(token,'token')
  if (!token) {
    throw new Error('Unauthorized')
  }
  try {
    const decoded = jwt.verify(token, secretKey)
    console.log(decoded,'decoded')
    return decoded
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}
