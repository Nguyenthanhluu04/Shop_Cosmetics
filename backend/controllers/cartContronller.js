import db from '../models/db.js'

export const handleAddToCart = async (req,res) => {

    const userId = req.user.id;

    const {productId,quantity} = req.body;
   
    try {
      
      const [cartItems] = await db.execute('INSERT INTO cart_items (user_id,product_id,quantity) VALUES (?,?,?)', [userId,productId,quantity])
       
      res.json(cartItems);

    } catch (error) {
      res.status(500).json({message: "Lỗi server khi thêm vào giỏ hàng "})
    }
 
    
}

export const handleGetCartItems = async (req,res) => {
   const userId = req.user.id ;

   try {
    const [listCartItems] = await db.execute('SELECT products.title , products.urlImg, products.priceNew,cart_items.quantity ,(products.priceNew * cart_items.quantity) AS totalPrice FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_items.user_id = ? ',[userId])
     
    console.log('listCartItems',listCartItems);
    
    res.json({listCartItems})    
   } catch (error) {
      res.status(500).json({message: "Lỗi server lấy danh sách giỏ hàng "})
    
   }
}