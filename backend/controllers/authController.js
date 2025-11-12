import bcrypt from 'bcrypt'
import db from '../models/db.js'
import jwt from 'jsonwebtoken'


export const generateAccessToken = (user) =>{

  return jwt.sign(
    user,
    process.env.JWT_SECRET,
    { expiresIn: '1m'}
  ) 
}

export const generateRefreshToken = (user) => {
   
  return jwt.sign(
    user,
    process.env.JWT_REFRESH_SECRET,
    {expiresIn: '7d'}
  )
}

export const handleRefreshToken =  (req,res) => {

const {refreshToken} = req.body


if(!refreshToken){
  return res.status(401).json({mesaage:'Server không nhận được refreshToken '})
}

try {

  const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET)

  const newAccessToken = jwt.sign(
    {id:decoded.id,userName:decoded.tenKH,role:decoded.role},
    process.env.JWT_SECRET,
    {expiresIn:'1m'}
  )

  res.json({accessToken: newAccessToken})
  
} catch (error) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' })
  
}

}

export const handleLogin = async (req,res) => {
  const {email,password} = req.body

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?',[email])

    if(rows.length === 0 ) {
      return res.status(404).json({mesaage: 'Email không tồn tại , vui lòng kiểm tra lại !'})
    }

    const user = rows[0];

    const checkPassword = await bcrypt.compare(password,user.pass)

    if(!checkPassword) {
      return res.status(401).json({mesaage:'Mật khẩu không chính xác !'})
    }
     
    const userInfor = {id:user.id,userName:user.tenKH,role:user.role}
    
    const accessToken = generateAccessToken(userInfor)
    const refreshToken = generateRefreshToken(userInfor)

    res.json({accessToken,refreshToken})

  } catch (error) {
    console.error('Lỗi đăng nhập:', error) 

    return res.status(500).json({mesaage: 'Lỗi server khi Login !',error: error.message})
  }
}

export const handleRegister = async (req,res) => {
  const {userName,email,password} = req.body

  try {
    const [existing] = await db.execute(
      'SELECT * FROM users WHERE email = ?',[email]
    )
    if(existing.length >0){
      return res.status(400).json({mesaage: 'Email đã được sử dụng'})
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const [result] = await db.execute(
      'INSERT INTO users (tenKH,email,pass,role) VALUES (?,?,?,?)',[userName,email,hashedPassword,'user']
    )

    const userId = result.insertId;
  
    const role = result.role;

    const userInfor = {id:userId,userName,role}

    const accessToken = generateAccessToken(userInfor);
    const refreshToken = generateRefreshToken(userInfor);

    res.json({accessToken,refreshToken})


  } catch (error) {
    console.error('Lỗi đăng ký:', error) 
    res.status(500).json({ message: 'Lỗi server', error: error.message })
  }
}











