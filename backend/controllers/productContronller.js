import db from '../models/db.js';


export const handleGetProducts = async (req,res) => {
    
    
    const page = parseInt(req.query.page ) || 1 
    const limit = parseInt(req.query.limit) || 10 
    const offset = (page -1 ) * limit 


    const sortType = req.query.sort || 'default';
    const category = req.query.category || ''

    
    try {
        
        let whereCategory = '';

        const params = [];

        if(category){
            whereCategory = 'WHERE iddm = ?';
            params.push(category)
        }
        

        const [countProduct] = await db.execute(`SELECT COUNT(*) as total  FROM products ${whereCategory} `,params);
        const totalProduct = countProduct[0].total 

        const totalPages = Math.ceil(totalProduct / limit)
      


        let orderBy = '' ;
        
        switch (sortType) {
            case 'newest':
             orderBy = ' ORDER BY id DESC '
                break;
            case 'lowest':
             orderBy = ' ORDER BY priceNew ASC '
                break;
                case 'highest':
             orderBy = ' ORDER BY priceNew DESC '
                break;
            default:
             orderBy = ''
                break;
        }
       
        const  [products] = await db.execute(`SELECT * , ((priceOld - priceNew) / priceOld * 100) AS priceDiscount FROM products ${whereCategory} ${orderBy} LIMIT ? OFFSET ?`,[...params, limit,offset])

        res.json({
            products,
            totalPages
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Lỗi server không trả về sản phẩm'})
    }
}

export const handleGetCategory = async (req,res) => {

   try {
     const [result] = await db.execute("SELECT * FROM category")

    const category = result;
    
    res.json({category})
   } catch (error) {
    res.status(500).json({message: 'Lỗi server không trả về danh mục'})
   }

}

export const handleProductDetails = async (req,res) => {
    
    const idProduct = req.params.id;
   
    try {
        const [productDetail] = await db.execute(" SELECT * , ((priceOld - priceNew) / priceOld * 100) AS priceDiscount  FROM products WHERE id = ?",[idProduct])
        
        if(productDetail.length === 0){
        res.status(500).json({message: 'Lỗi trả về sản phẩm chi tiết từ server !'})
        }    
         
        res.json({productDetail})
        
    } catch (error) {
        
    }

}

