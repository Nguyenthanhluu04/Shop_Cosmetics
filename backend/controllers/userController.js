import db from '../models/db.js';

// Lấy thông tin người dùng
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id; // Từ token đã verify
    
    const [rows] = await db.query(
      'SELECT  tenKH, email FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật thông tin người dùng
export const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tenKH, email } = req.body;

    // Kiểm tra email đã tồn tại chưa (ngoại trừ user hiện tại)
    const [existingUser] = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    await db.query(
      'UPDATE users SET tenKH = ?, email = ? WHERE id = ?',
      [tenKH, email, userId]
    );

    res.json({ message: 'Cập nhật thông tin thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách địa chỉ của người dùng
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      'SELECT * FROM address WHERE userId = ? ORDER BY id DESC',
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách địa chỉ:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Thêm địa chỉ mới
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userName, phoneNumber, userAddress } = req.body;

    if (!userName || !phoneNumber || !userAddress) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const [result] = await db.query(
      'INSERT INTO address (userId, userName, phoneNumber, userAddress) VALUES (?, ?, ?, ?)',
      [userId, userName, phoneNumber, userAddress]
    );

    res.status(201).json({ 
      message: 'Thêm địa chỉ thành công',
      addressId: result.insertId 
    });
  } catch (error) {
    console.error('Lỗi khi thêm địa chỉ:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật địa chỉ
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { userName, phoneNumber, userAddress } = req.body;

    // Kiểm tra địa chỉ có thuộc về user không
    const [existing] = await db.query(
      'SELECT id FROM address WHERE id = ? AND userId = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    await db.query(
      'UPDATE address SET userName = ?, phoneNumber = ?, userAddress = ? WHERE id = ? AND userId = ?',
      [userName, phoneNumber, userAddress, id, userId]
    );

    res.json({ message: 'Cập nhật địa chỉ thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật địa chỉ:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa địa chỉ
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Kiểm tra địa chỉ có thuộc về user không
    const [existing] = await db.query(
      'SELECT id FROM address WHERE id = ? AND userId = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    await db.query(
      'DELETE FROM address WHERE id = ? AND userId = ?',
      [id, userId]
    );

    res.json({ message: 'Xóa địa chỉ thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa địa chỉ:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
