/*
能操作products集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const productSchema = new mongoose.Schema({
  categoryId: {type: String, required: true}, // 所属分类的id
  name: {type: String, required: true}, // 名称
  price: {type: Number, required: true}, // 价格
  desc: {type: String},
  status: {type: Number, default: 1}, // 商品状态: 1:在售, 2: 下架了
  imgs: {type: Array, default: []}, // n个图片文件名的json字符串
  detail: {type: String}
})


// 3. 定义Model(与集合对应, 可以操作集合)
const ProductModel = mongoose.model('products', productSchema)
ProductModel.find().then(res=> {
  if(!res) {
    ProductModel.create(

    	{
                "status": 1,
                "imgs": [
                    "image-1559402448049.jpg",
                    "image-1559402450480.jpg"
                ],
                "_id": "5ca9e414b49ef916541160ce",
                "name": "华硕(ASUS) 飞行堡垒",
                "desc": "15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)",
                "price": 6799,
                "pCategoryId": "5ca9d6c0b49ef916541160bb",
                "categoryId": "5ca9db8ab49ef916541160cb",
                "detail": "<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">华硕(ASUS) 飞行堡垒6 15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)火陨红黑</span>&nbsp;</p>\n<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;\">【4.6-4.7号华硕集体放价，大牌够品质！】1T+256G高速存储组合！超窄边框视野无阻，强劲散热一键启动！</span>&nbsp;</p>\n",
                "__v": 0
            },
 {
                "status": 2,
                "imgs": [
                    "image-1554638240202.jpg"
                ],
                "_id": "5ca9e5bbb49ef916541160d0",
                "name": "美的(Midea) 213升-BCD-213TM",
                "desc": "爆款直降!大容量三口之家优选! *节能养鲜,自动低温补偿,36分贝静音呵护",
                "price": 1388,
                "pCategoryId": "5ca9d695b49ef916541160ba",
                "categoryId": "5ca9d9cfb49ef916541160c4",
                "detail": "<p style=\"text-align:start;\"><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial, \"microsoft yahei;\">美的(Midea) 213升 节能静音家用三门小冰箱 阳光米 BCD-213TM(E)</span></p>\n<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;font-family: tahoma, arial, \"Microsoft YaHei\", \"Hiragino Sans GB\", u5b8bu4f53, sans-serif;\">【4.8美的大牌秒杀日】爆款直降!大容量三口之家优选! *节能养鲜,自动低温补偿,36分贝静音呵护! *每天不到一度电,省钱又省心!</span>&nbsp;</p>\n",
                "__v": 0
            },
            {
                "status": 1,
                "imgs": [
                    "image-1554638403550.jpg"
                ],
                "_id": "5ca9e653b49ef916541160d1",
                "name": "美的（Midea）KFR-35GW/WDAA3",
                "desc": "正1.5匹 变频 智弧 冷暖 智能壁挂式卧室空调挂机",
                "price": 2499,
                "pCategoryId": "5ca9d695b49ef916541160ba",
                "categoryId": "5ca9da1ab49ef916541160c6",
                "detail": "<p style=\"text-align:start;\"><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">美的（Midea）正1.5匹 变频 智弧 冷暖 智能壁挂式卧室空调挂机 KFR-35GW/WDAA3@</span></p>\n<p style=\"text-align:start;\"></p>\n<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;\">【4.8美的大牌秒杀日】提前加入购物车！2299元成交价！前50名下单送赠品加湿型电风扇，赠完即止！8日0点开抢！</span><a href=\"https://sale.jd.com/mall/LKHdqZUIYk.html\" target=\"_blank\"><span style=\"color: rgb(94,105,173);background-color: rgb(255,255,255);font-size: 12px;\">更有无风感柜挂组合套购立减500元！猛戳！！</span></a>&nbsp;</p>\n",
                "__v": 0
            }
    	)
     
            .then(res => {
              console.log('初始化products')
            }).catch(err=>{console.log('products已存在')})

        }
})

// 4. 向外暴露Model
module.exports = ProductModel