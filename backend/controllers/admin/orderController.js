import db from '../../models/db.js';

// Lấy tất cả đơn hàng (có thể lọc theo status)
export const getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let sql = `SELECT o.id, o.userId, o.customerName, o.phoneNumber, o.yourAddress, 
                      o.totalAmount, o.status, o.payment_method, o.note, 
                      o.created_at, o.updated_at,
                      u.tenKH as user_name
               FROM orders o
               LEFT JOIN users u ON o.userId = u.id`;
    
    const params = [];
    
    if (status) {
      sql += ' WHERE o.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await db.execute(sql, params);

    // Đếm tổng số đơn hàng
    let countSql = 'SELECT COUNT(*) as total FROM orders';
    if (status) {
      countSql += ' WHERE status = ?';
    }
    const [countResult] = await db.execute(countSql, status ? [status] : []);

    res.json({
      success: true,
      orders,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderDetail = async (req, res) => {
  const orderId = req.params.id;

  try {
    // Lấy thông tin đơn hàng
    const [orders] = await db.execute(
      `SELECT o.*, u.tenKH as user_name
       FROM orders o
       LEFT JOIN users u ON o.userId = u.id
       WHERE o.id = ?`,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Lấy chi tiết sản phẩm
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

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đơn hàng' });
  }
};

// Xóa đơn hàng
export const deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const [result] = await db.execute('DELETE FROM orders WHERE id = ?', [orderId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.json({ success: true, message: 'Xóa đơn hàng thành công' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Lỗi khi xóa đơn hàng' });
  }
};

// Thống kê đơn hàng
export const getOrderStats = async (req, res) => {
  try {
    // Tổng số đơn hàng theo trạng thái
    const [statusStats] = await db.execute(
      `SELECT status, COUNT(*) as count, SUM(CAST(REPLACE(totalAmount, '.', '') AS UNSIGNED)) as total
       FROM orders
       GROUP BY status`
    );

    // Tổng số đơn hàng
    const [totalOrders] = await db.execute(
      'SELECT COUNT(*) as total FROM orders'
    );

    // Đơn hàng hôm nay
    const [todayOrders] = await db.execute(
      `SELECT COUNT(*) as total FROM orders 
       WHERE DATE(created_at) = CURDATE()`
    );

    // Doanh thu tháng này
    const [monthlyRevenue] = await db.execute(
      `SELECT SUM(CAST(REPLACE(totalAmount, '.', '') AS UNSIGNED)) as revenue
       FROM orders
       WHERE MONTH(created_at) = MONTH(CURDATE()) 
       AND YEAR(created_at) = YEAR(CURDATE())
       AND status != 'cancelled'`
    );

    res.json({
      success: true,
      stats: {
        totalOrders: totalOrders[0].total,
        todayOrders: todayOrders[0].total,
        monthlyRevenue: monthlyRevenue[0].revenue || 0,
        statusStats: statusStats
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thống kê đơn hàng' });
  }
};
