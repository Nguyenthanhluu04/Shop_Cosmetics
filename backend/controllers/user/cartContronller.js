import db from '../../models/db.js'

export const handleAddToCart = async (req,res) => {


    
    const userId = req.user.id;

    const {productId,quantity} = req.body;
   
    try {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const [existingItem] = await db.execute(
        'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', 
        [userId, productId]
      );

      let result;
      
      if (existingItem.length > 0) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        const newQuantity = existingItem[0].quantity + quantity;
        [result] = await db.execute(
          'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
          [newQuantity, userId, productId]
        );
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
        [result] = await db.execute(
          'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', 
          [userId, productId, quantity]
        );
      }
       
      return res.json({
        success: true,
        message: existingItem.length > 0 ? "Đã cập nhật số lượng sản phẩm trong giỏ hàng" : "Đã thêm sản phẩm vào giỏ hàng",
        result
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
      return res.status(500).json({message: "Lỗi server khi thêm vào giỏ hàng"})
    }
}

export const handleGetCartItems = async (req,res) => {
   
   const userId = req.user.id ;

   try {
    const [listCartItems] = await db.execute(
      'SELECT cart_items.id, products.title, products.urlImg, products.priceNew, cart_items.quantity, cart_items.product_id FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_items.user_id = ?',
      [userId]
    );
     
    // Xử lý dữ liệu: chuyển đổi priceNew từ string sang number và tính totalPrice
    const formattedCartItems = listCartItems.map(item => {
      // Loại bỏ dấu chấm phân cách hàng nghìn và chuyển sang số
      const priceNumber = parseInt(item.priceNew.replace(/\./g, ''));
      const totalPrice = priceNumber * item.quantity;
      
      // Format lại totalPrice thành dạng có dấu chấm phân cách hàng nghìn
      const formattedTotalPrice = totalPrice.toLocaleString('vi-VN');
      
      return {
        ...item,
        totalPrice: formattedTotalPrice
      };
    });
    
    
    return res.json({listCartItems: formattedCartItems})    
   } catch (error) {
      return res.status(500).json({message: "Lỗi server lấy danh sách giỏ hàng "})
    
   }
}

export const handleUpdateQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
  }

  try {
    const [result] = await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    return res.json({
      success: true,
      message: "Đã cập nhật số lượng sản phẩm"
    });
  } catch (error) {
    console.error('Error updating quantity:', error);
    return res.status(500).json({ message: "Lỗi server khi cập nhật số lượng" });
  }
}

export const handleRemoveCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const [result] = await db.execute(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    return res.json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng"
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return res.status(500).json({ message: "Lỗi server khi xóa sản phẩm" });
  }
}