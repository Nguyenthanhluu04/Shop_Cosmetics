import db from '../../models/db.js';

// Lấy danh sách sản phẩm (có phân trang, tìm kiếm, lọc)
export const getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    try {
        let whereClause = '';
        const params = [];

        if (search && category) {
            whereClause = 'WHERE title LIKE ? AND iddm = ?';
            params.push(`%${search}%`, category);
        } else if (search) {
            whereClause = 'WHERE title LIKE ?';
            params.push(`%${search}%`);
        } else if (category) {
            whereClause = 'WHERE iddm = ?';
            params.push(category);
        }

        // Đếm tổng số sản phẩm
        const [countResult] = await db.execute(
            `SELECT COUNT(*) as total FROM products ${whereClause}`,
            params
        );
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        // Lấy danh sách sản phẩm
        const [products] = await db.execute(
            `SELECT p.*, c.loaisanpham as categoryName 
             FROM products p 
             LEFT JOIN category c ON p.iddm = c.id 
             ${whereClause} 
             ORDER BY p.id DESC 
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        res.json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách sản phẩm' });
    }
};

// Lấy chi tiết một sản phẩm
export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const [products] = await db.execute(
            `SELECT p.*, c.loaisanpham as categoryName 
             FROM products p 
             LEFT JOIN category c ON p.iddm = c.id 
             WHERE p.id = ?`,
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        res.json({ success: true, product: products[0] });
    } catch (error) {
        console.error('Get product by id error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin sản phẩm' });
    }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
    const {
        title,
        urlImg,
        priceOld,
        priceNew,
        quantity,
        sold,
        brand,
        nation,
        evaluate,
        discount,
        size,
        available,
        iddm
    } = req.body;

    console.log('Create product request:', req.body);

    try {
        // Validate dữ liệu
        if (!title || !priceNew || quantity === undefined || !iddm) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc (tên, giá, số lượng, danh mục)' 
            });
        }

        const [result] = await db.execute(
            `INSERT INTO products (title, urlImg, priceOld, priceNew, quantity, sold, brand, nation, evaluate, discount, size, available, iddm) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                urlImg || null,
                priceOld || null,  // Lưu dưới dạng string
                priceNew,          // Lưu dưới dạng string
                quantity,
                sold || '0',
                brand || null,
                nation || null,
                evaluate || '0',
                discount || '0',
                size || null,
                available || 'Còn hàng',
                iddm
            ]
        );

        console.log('Product created with ID:', result.insertId);

        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm thành công',
            productId: result.insertId
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi tạo sản phẩm: ' + error.message });
    }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        urlImg,
        priceOld,
        priceNew,
        quantity,
        sold,
        brand,
        nation,
        evaluate,
        discount,
        size,
        available,
        iddm
    } = req.body;

    console.log('Update product request:', { id, body: req.body });

    try {
        // Kiểm tra sản phẩm tồn tại
        const [existing] = await db.execute('SELECT id FROM products WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        // Validate dữ liệu
        if (!title || !priceNew || quantity === undefined || !iddm) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
            });
        }

        await db.execute(
            `UPDATE products 
             SET title = ?, urlImg = ?, priceOld = ?, priceNew = ?, quantity = ?, 
                 sold = ?, brand = ?, nation = ?, evaluate = ?, discount = ?, 
                 size = ?, available = ?, iddm = ? 
             WHERE id = ?`,
            [
                title,
                urlImg || null,
                priceOld || null,  // Lưu dưới dạng string
                priceNew,          // Lưu dưới dạng string
                quantity,
                sold || '0',
                brand || null,
                nation || null,
                evaluate || '0',
                discount || '0',
                size || null,
                available || 'Còn hàng',
                iddm,
                id
            ]
        );

        console.log('Product updated successfully:', id);

        res.json({ success: true, message: 'Cập nhật sản phẩm thành công' });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật sản phẩm: ' + error.message });
    }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    console.log('Delete product request:', id);

    try {
        // Kiểm tra sản phẩm tồn tại
        const [existing] = await db.execute('SELECT id FROM products WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        await db.execute('DELETE FROM products WHERE id = ?', [id]);

        console.log('Product deleted successfully:', id);

        res.json({ success: true, message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa sản phẩm: ' + error.message });
    }
};

// Lấy danh sách danh mục
export const getCategories = async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM category ORDER BY id');
        res.json({ success: true, categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh mục' });
    }
};
