var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const CategoryModel = require('../models/CategoryModel')
const UserModel = require('../models/UserModel')
const  ProductModel = require('../Models/ProductModel');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



//login
router.post('/login', (req, res) => {
  const {username,password} = req.body.values
//console.log(req.body.values)
  // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
  UserModel.findOne({username, password: md5(password)})
    .then(user => {
      if (user) { // 登陆成功
        // 生成一个cookie(userid: user._id), 并交给浏览器保存
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
        // if (user.role_id) {
        //   RoleModel.findOne({_id: user.role_id})
        //     .then(role => {
        //       user._doc.role = role
        //       console.log('role user', user)
        //       res.send({status: 0, data: user})
        //     })
        // } else {
        //   user._doc.role = {menus: []}
        //   // 返回登陆成功信息(包含user)
         res.send({status: 0, data: user})
        // }

      } else {// 登陆失败
        res.send({status: 1, msg: '用户名或密码不正确!'})
      }
    })
    .catch(error => {
      console.error('登陆异常', error)
      res.send({status: 1, msg: '登陆异常, 请重新尝试'})
    })
})

// 添加分类
router.post('/manage/category/add', (req, res) => {
  const {categoryName,parentId} = req.body
 // console.log(req.body)
  //console.log(categoryName)
  CategoryModel.findOne({name: categoryName})
    .then(category => {
      if (category) {
        res.send({status: 1, msg: '此分类已存在'})
      } else {
         CategoryModel.create({name:categoryName,parentId:parentId})
          .then(category => {
            res.send({status: 0, data: category})
          })
          .catch(error => {
           // console.error('添加分类异常', error)
            res.send({status: 1, msg: '添加分类异常, 请重新尝试'})
          })

     
  






      }
    })

  
})

// 获取分类列表
// router.get('/manage/category/list', (req, res) => {
//   CategoryModel.find({})
//     .then(categorys => {
//       res.send({status: 0, data: categorys})
//     })
//     .catch(error => {
//       console.error('获取分类列表异常', error)
//       res.send({status: 1, msg: '获取分类列表异常, 请重新尝试'})
//     })
// })
/* 
获取一级或某个二级分类列表
|参数   |是否必选 |类型     |说明
|parentId    |Y       |string   |父级分类的ID
*/
router.get('/manage/category/list',(req,res,next)=>{
    let parentId = req.query.parentId;

 //console.log(req.query.parentId)
   CategoryModel.find({parentId:parentId}).then(val=>{
        return res.send({
            "status": 0,
            "data":val
        })
    }).catch(err=>{
        return res.send ({
            "status": 1,
            "msg":err.message
        })
    });
});


// 根据分类ID获取分类
router.get('/manage/category/info', (req, res) => {
  const categoryId = req.query.categoryId
  CategoryModel.findOne({_id: categoryId})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('获取分类信息异常', error)
      res.send({status: 1, msg: '获取分类信息异常, 请重新尝试'})
    })
})
// 更新分类名称
router.post('/manage/category/update', (req, res) => {
  const {categoryId, categoryName} = req.body
  CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName})
    .then(oldCategory => {
      res.send({status: 0,data:oldCategory })
    })
    .catch(error => {
      console.error('更新分类名称异常', error)
      res.send({status: 1, msg: '更新分类名称异常, 请重新尝试'})
    })
})












/* 
获取商品分页列表
|参数   |是否必选 |类型     |说明
|pageNum    |Y       |Number   |页码
|pageSize   |Y       |Number   |每页条目数
*/
// options:{skip:(pageNum-1)*pageSize,limit:Number(pageSize)}
// .skip((query.pageNo - 1) * query.pageSize).limit(parseInt(query.pageSize)||20) 
// .skip((pageNum-1)*pageSize).limit(Number(pageSize))
router.get('/product/list',async (req,res)=>{
    let count =  await ProductModel.count().then(val=>{
        return val
   
    }).catch(err=>{
        return res.send ({
            "status": 1,
            "msg":err.message
        })
    });
     //console.log(count)
    let {pageNum,pageSize} = req.query;
    console.log(pageNum,pageSize)
     ProductModel.find().skip((pageNum-1)*pageSize).limit(Number(pageSize)).then(val=>{
        return res.send ( {
            "status": 0,
            "data": {
                "pageNum": pageNum,
                "total": count,
                "pages": Math.ceil(count/pageSize),
                "pageSize": pageSize,
                "list": val
            }
        })
    }).catch(err=>{
        return res.send ({
            "status": 1,
            "msg":err.message
        })
    });    })


/* 
根据ID/Name搜索产品分页列表
|参数   |是否必选 |类型     |说明
|pageNum       |Y       |Number   |页码
|pageSize      |Y       |Number   |每页条目数
|productName   |N       |String   |根据商品名称搜索
|productDesc   |N       |String   |根据商品描述搜索
$regex表示一个正则表达式，匹配了key
$or为模糊查询  格式:$or:[{name:{$regex: String(key),$options: '$i'}},{}....]
*/
router.get('/product/search',async (req,res)=>{
    let {pageNum,pageSize,productName = null,productDesc = null} = req.query;
    let condition = {};
   // let query = new RegExp(searchName,'i');
    if(productName){
        condition = {$or: [{"name": {$regex: String(productName)}}]};
    }else{
        condition = {$or: [{"desc": {$regex: String(productDesc)}}]};
    }
    //  if(productName){
    //     condition = {$or:[{name:productName }]};
    // }else{
    //     condition ={$or: [{desc:productDesc }]};
    // }
   // let count = await db.count({tableName:'products',conditions:condition,schema:ProductsSchema}).then(val=>{
    let count = await ProductModel.count().then(val=>{
        return val;
    }).catch(err=>{
        return res.send({
            "status": 1,
            "msg":err.message
        })
    });
    await ProductModel.find( condition).skip((pageNum-1)*pageSize).limit(Number(pageSize)).then(val=>{
      //console.log(val)
        return res.send({
            "status": 0,
            "data": {
                "pageNum": pageNum,
                "total": count,
                "pages": Math.ceil(count/pageSize),
                "pageSize": pageSize,
                "list": val
            }
        })
    }).catch(err=>{
        return res.body = {
            "status": 1,
            "msg":err.message
        }
    });
});

// /* 
// 添加商品
// |参数   |是否必选 |类型     |说明
// |categoryId    |Y       |string   |分类ID
// |pCategoryId   |Y       |string   |父分类ID
// |name          |Y       |string   |商品名称
// |desc          |N       |string   |商品描述
// |price         |N       |string   |商品价格
// |detail        |N       |string   |商品详情
// |imgs          |N       |array   |商品图片名数组
// */
router.post('/product/add',async (req,res,next)=>{
    // console.log(res.request.body);
    let {name,desc,price,imgs,detail,pCategoryId,categoryId} = req.body;
    await  ProductModel.insert({name,desc,price,imgs,detail,pCategoryId,categoryId,status:1}).then(val=>{
        return res.send( {
            "status": 0,
            "data":val
        })
    }).catch(err=>{
        return res.send({
            "status": 1,
            "msg":err.message
        }) 
    });
});

// /* 
// 更新商品
// |参数   |是否必选 |类型     |说明
// |_id           |Y       |string   |商品ID
// |categoryId    |Y       |string   |分类ID
// |pCategoryId   |Y       |string   |父分类ID
// |name          |Y       |string   |商品名称
// |desc          |N       |string   |商品描述
// |price         |N       |string   |商品价格
// |detail        |N       |string   |商品详情
// |imgs          |N       |array   |商品图片名数组
// */
router.post('/product/update',async (req,res,next)=>{
    let {_id,name,desc,price,imgs,detail,pCategoryId,categoryId} = req.body;
    await  ProductModel.update(_id,{name,desc,price,imgs,detail,pCategoryId,categoryId}).then(val=>{
        return res.send({
            "status": 0
        })
    }).catch(err=>{
        return res.send({
            "status": 1
        })
    });
});

// /* 
// 对商品进行上架/下架处理
// |参数   |是否必选 |类型     |说明
// |productId    |Y       |string   |商品名称
// |status       |Y       |number   |商品状态值
// */
router.post('/product/updateStatus',async (req,res,next)=>{
    let {productId,status} = reqbody;
    await  ProductModel.update({_id:productId},{$set:{status}}).then(val=>{
        return res.send({
            "status": 0
        })
    }).catch(err=>{
        return res.send({
            "status": 1
        })
    });
});
module.exports = router;
