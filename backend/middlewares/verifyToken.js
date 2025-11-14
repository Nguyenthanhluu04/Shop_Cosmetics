import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

export const verifyToken = (req, res, next) => {
    
 
    const authHeader = req.headers['authorization']
  
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không có token!' })
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {

        if (err) {
            return res.status(401).json({ message: 'Token không hợp lệ!' })
        }
         
        req.user = decode;

        next();
    })
}