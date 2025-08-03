
import db from '../models/db.js';
import jwt from 'jsonwebtoken'


const generateAccessToken = (user) => {
 return jwt.sign(
    user,
    process.env.JWT_SECRET,
    {expiresIn: '15m'}
    )
   
}

const generateRefreshToken = (user) => {
return jwt.sign(user,process.env.JWT_REFRESH_SECRET,{
    expiresIn: '7d'
  })
}

export const refreshToken = async (req,res) => {

  const  {refreshToken} = req.body

  if(!refreshToken) {
    return res.status(401).json({message: 'server không nhận được refreshToken !'})
  }
 
 try {
  const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET)
   
  const newAccessToken = jwt.sign(
    {id: decoded.id, username: decoded.username},
    process.env.JWT_SECRET,
    {expiresIn: '15m'}
  )

  res.json({accessToken: newAccessToken})

 } catch (err) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' })

 }

}

export const login =  async (req, res) => {
  const { email, password } = req.body
  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' })
    }

    const user = rows[0]

    const inforUser = {id: user.id, username: user.username}

    const accessToken = generateAccessToken(inforUser)
    const refreshToken = generateRefreshToken(inforUser)
    


    res.json({ accessToken,refreshToken }) 
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message })
  }
  
}

 export const register = async (req,res) => {
  const {username, email, password } = req.body;

  try {
      const [existing ] = await db.execute(
        'SELECT * FROM users WHERE username = ?', [username]
      )

      if(existing.length >0){
        return res.status(400).json({message: 'tài khoản đã tồn tại'})
      }

     const [result] =   await db.execute(
        'INSERT INTO users  (username,email, password ) VALUES (?,?,?)' , [username,email,password]
     )
    
     const userId = result.insertId;

     const inforUser = {id: userId , username}

     const accessToken = generateAccessToken(inforUser)
      const refreshToken = generateRefreshToken(inforUser)

 
    res.json({ accessToken,refreshToken })
  } catch (err) {
    console.error('Lỗi đăng ký:', err) 
    res.status(500).json({ message: 'Lỗi server', error: err.message })
    
  }
}
