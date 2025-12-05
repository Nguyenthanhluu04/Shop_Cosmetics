## README - Shop My Pham - Thành Lưu

### Prerequisites

- Node.js >= 14.x
- npm hoặc yarn
- MySQL database
- Code editor (VS Code recommended)

---

### 1. Clone & Install

```bash
# Clone repository (nếu chưa có)
git clone <repository-url>
cd Shop_MyPham

# Install dependencies
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure Database

```bash
# Backend .env
cd backend
cp .env.example .env

# Edit .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shop_mypham
PORT=3000
JWT_SECRET=your_secret_key
```

### 3. Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm start
# hoặc: node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Access Admin Panel

1. Open browser: `http://localhost:5173`
2. Login với admin account
3. Navigate to: `http://localhost:5173/admin`

---
