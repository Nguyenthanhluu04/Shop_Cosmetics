import dotenv from 'dotenv';
dotenv.config();

export const verifyRole = (roles) => {
   
    return (req, res, next) => {
        
        // Lấy thông tin user từ req.user (đã được set bởi verifyToken middleware)
        if (!req.user) {
            return res.status(401).json({ message: 'Không có thông tin người dùng!' });
        }

        // Kiểm tra role
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({ message: 'Không có quyền thực hiện!' });
        }
          
        next();
    }
}

