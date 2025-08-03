
import db from '../models/db.js'

export const getTodos = async (req,res) => {
    const userId = req.user.id;

    try {
        const [todos] = await db.execute('SELECT * FROM todos WHERE userId = ?', [userId]);
    
         res.json(todos);
    } catch (err) {
        res.status(500).json({message: 'Lỗi trả todo từ Server',error: err.message})
    }

}

export const createTodo = async (req,res) => {
    const {taskName , level } = req.body
    const userId = req.user.id;

    try {
        const [result] = await db.execute('INSERT INTO todos (userId,task,level) VALUES (?,?,?)',[userId,taskName,level]);

     
        res.status(200).json({message: 'Tạo Todo Thành Công'});
    } catch (err) {
        res.status(500).json({message: 'Lỗi server khi tạo todo !', error: err.message})
    }
}

export const deleteTodo = async (req,res) => {
    const {idTodo} = req.body;
    const userId = req.user.id;
   
    console.log(idTodo , userId)
    try {
        await db.execute('DELETE FROM todos WHERE id = ? AND userId = ?',[idTodo,userId])

        res.status(200).json({message: 'Xóa Todo Thành Công'})
    } catch (err) {
        res.status(500).json({message: 'Lỗi server khi xóa todo!',error: err.message})
        
    }
}

export const updateTodo = async (req,res) => {
    const {idTodo,taskEdit,levelEdit} = req.body;
    const userId = req.user.id;
    
    console.log(idTodo,taskEdit,levelEdit,userId)
    try {
        
        await db.execute('UPDATE todos SET task = ? , level = ? WHERE id = ? AND userId = ? ' , [taskEdit,levelEdit,idTodo,userId])

        res.status(200).json({message: 'Update Todo Thành Công'})

    } catch (err) {
        res.status(500).json({message: 'Lỗi server khi update todo!',error: err.message})
        
    }
}

export const sortTodo = async (req,res) => {
    const {sortBy,order} = req.query;
    const userId = req.user.id;

    // Bảo vệ injection 

    const allowedSortBy = ['task','level'];
    const allowedOrder = ['ASC','DESC']
   
    if(!allowedSortBy.includes(sortBy) || !allowedOrder.includes(order)){
        res.status(400).json({message: ' Client tham số sắp xếp không hợp lệ ! '})
    }
     
    try {

        const [results] = await db.execute(`SELECT * FROM todos WHERE userId = ? ORDER BY ${sortBy} ${order} `,[userId])

        res.json(results);
        
    } catch (err) {

        res.status(500).json({message: 'Lỗi server khi sắp xếp Todo !'})
        
    }


    
   
}