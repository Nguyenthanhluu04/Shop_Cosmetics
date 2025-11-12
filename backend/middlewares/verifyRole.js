import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyRole = (roles) => {
   
    return (req,res,next) => {

        const authHeader = req.headers['authorization'];
      
        const token = authHeader && authHeader.split(' ')[1];
    
           if(!token){
            return res.status(401).json({message: 'Không có token !'})
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET);

        if(!roles.includes(decode.role)){
            res.status(403).json({message: 'không có quyền thực hiện !'})
        }
          
        req.user = decode;

        next();
    
    }

}
