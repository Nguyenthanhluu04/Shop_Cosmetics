import db from '../../models/db.js';

// Tạo đơn hàng mới từ giỏ hàng
export const createOrder = async (req, res) => {
  const { items, shippingInfo, paymentMethod, note } = req.body;
  const userId = req.user.id;

  console.log('Create order request:', { userId, items, shippingInfo, paymentMethod });

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Giỏ hàng trống' });
  }

  if (!shippingInfo || !shippingInfo.customerName || !shippingInfo.phoneNumber || !shippingInfo.yourAddress) {
    return res.status(400).json({ message: 'Thiếu thông tin giao hàng' });
  }

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Tính tổng tiền và chuẩn bị dữ liệu
    let totalAmount = 0;
    const orderDetails = [];

    for (const item of items) {
      // Lấy thông tin sản phẩm
      const [products] = await connection.execute(
        'SELECT id, title, priceNew, urlImg FROM products WHERE id = ?',
        [item.product_id]
      );

      if (products.length === 0) {
        throw new Error(`Sản phẩm ${item.product_id} không tồn tại`);
      }

      const product = products[0];
      // priceNew có dạng "100.000", cần chuyển thành số
      const price = parseInt(product.priceNew.replace(/\./g, ''));
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      orderDetails.push({
        product_id: product.id,
        product_name: product.title,
        product_image: product.urlImg,
        price: product.priceNew,
        quantity: item.quantity,
        subtotal: subtotal.toLocaleString('vi-VN')
      });
    }

    // Format lại totalAmount
    const totalAmountFormatted = totalAmount.toLocaleString('vi-VN');

    // Xử lý phoneNumber an toàn
    const phoneNumberValue = typeof shippingInfo.phoneNumber === 'string' 
      ? parseInt(shippingInfo.phoneNumber.replace(/\D/g, '')) 
      : shippingInfo.phoneNumber;

    console.log('Inserting order:', {
      userId,
      customerName: shippingInfo.customerName,
      phoneNumber: phoneNumberValue,
      totalAmount: totalAmountFormatted
    });

    // Tạo đơn hàng
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (userId, customerName, phoneNumber, yourAddress, totalAmount, status, payment_method, note)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [
        userId,
        shippingInfo.customerName,
        phoneNumberValue,
        shippingInfo.yourAddress,
        totalAmountFormatted,
        paymentMethod || 'cod',
        note || null
      ]
    );

    const orderId = orderResult.insertId;

    // Thêm chi tiết đơn hàng
    for (const item of orderDetails) {
      await connection.execute(
        `INSERT INTO order_details (order_id, product_id, product_name, product_image, price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.product_name, item.product_image, item.price, item.quantity, item.subtotal]
      );
    }

    // Xóa giỏ hàng sau khi đặt hàng thành công
    await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      orderId: orderId,
      totalAmount: totalAmountFormatted
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql
    });
    res.status(500).json({ 
      message: error.sqlMessage || error.message || 'Lỗi khi tạo đơn hàng',
      error: error.code 
    });
  } finally {
    connection.release();
  }
};

// Lấy danh sách đơn hàng của user
export const getMyOrders = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const [orders] = await db.execute(
      `SELECT id, customerName, phoneNumber, yourAddress, totalAmount, status, payment_method, note, created_at, updated_at
       FROM orders 
       WHERE userId = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderDetail = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  try {
    // Lấy thông tin đơn hàng
    const [orders] = await db.execute(
      `SELECT id, userId, customerName, phoneNumber, yourAddress, totalAmount, status, payment_method, note, created_at, updated_at
       FROM orders 
       WHERE id = ? AND userId = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Lấy chi tiết sản phẩm trong đơn hàng
    const [items] = await db.execute(
      `SELECT id, product_id, product_name, product_image, price, quantity, subtotal
       FROM order_details
       WHERE order_id = ?`,
      [orderId]
    );

    res.json({
      success: true,
      order: orders[0],
      items: items
    });
  } catch (error) {
    console.error('Get order detail error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng' });
  }
};

// Hủy đơn hàng (chỉ khi đơn hàng đang ở trạng thái pending)
export const cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  try {
    const [orders] = await db.execute(
      'SELECT id, status FROM orders WHERE id = ? AND userId = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (orders[0].status !== 'pending') {
      return res.status(400).json({ message: 'Không thể hủy đơn hàng đã được xác nhận' });
    }

    await db.execute(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['cancelled', orderId]
    );

    res.json({ success: true, message: 'Hủy đơn hàng thành công' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Lỗi khi hủy đơn hàng' });
  }
};

// Lấy địa chỉ đã lưu của user
export const getUserAddresses = async (req, res) => {
  const userId = req.user.id;

  try {
    const [addresses] = await db.execute(
      'SELECT id, userName, phoneNumber, userAddress FROM address WHERE userId = ?',
      [userId]
    );

    res.json({ success: true, addresses });
  } catch (error) {
    console.error('Get user addresses error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách địa chỉ' });
  }
};

// Thêm địa chỉ mới
export const addAddress = async (req, res) => {
  const userId = req.user.id;
  const { userName, phoneNumber, userAddress } = req.body;

  if (!userName || !phoneNumber || !userAddress) {
    return res.status(400).json({ message: 'Thiếu thông tin địa chỉ' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO address (userId, userName, phoneNumber, userAddress) VALUES (?, ?, ?, ?)',
      [userId, userName, phoneNumber, userAddress]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm địa chỉ thành công',
      addressId: result.insertId
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Lỗi khi thêm địa chỉ' });
  }
};
