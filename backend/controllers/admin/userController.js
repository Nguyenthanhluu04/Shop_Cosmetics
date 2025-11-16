import db from '../../models/db.js';
import bcrypt from 'bcrypt';

// Lấy danh sách user, có thể lọc theo role (user|staff|admin)
export const getUsers = async (req, res) => {
  const role = req.query.role || '';
  try {
    let sql = 'SELECT id, tenKH, email, role FROM users';
    const params = [];
    if (role) {
      sql += ' WHERE role = ?';
      params.push(role);
    }
    const [rows] = await db.execute(sql, params);
    res.json({ users: rows });
  } catch (error) {
    console.error('getUsers error', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

// Tạo tài khoản nhân viên (staff)
export const createStaff = async (req, res) => {
  const { tenKH, email, password } = req.body;
  if (!tenKH || !email || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
  }
  try {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (tenKH, email, pass, role) VALUES (?, ?, ?, ?)',
      [tenKH, email, hashed, 'staff']
    );

    res.json({ id: result.insertId, tenKH, email, role: 'staff' });
  } catch (error) {
    console.error('createStaff error', error);
    res.status(500).json({ message: 'Lỗi server khi tạo nhân viên' });
  }
};

// Cập nhật thông tin user
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { tenKH, email, role, password } = req.body;
  try {
    const fields = [];
    const params = [];
    if (tenKH) {
      fields.push('tenKH = ?');
      params.push(tenKH);
    }
    if (email) {
      fields.push('email = ?');
      params.push(email);
    }
    if (role) {
      fields.push('role = ?');
      params.push(role);
    }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push('pass = ?');
      params.push(hashed);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Không có trường để cập nhật' });
    }

    params.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await db.execute(sql, params);
    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error('updateUser error', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật người dùng' });
  }
};

// Xóa user
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('deleteUser error', error);
    res.status(500).json({ message: 'Lỗi server khi xóa người dùng' });
  }
};
