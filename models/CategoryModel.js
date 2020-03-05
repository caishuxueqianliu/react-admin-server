/*
能操作categorys集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const categorySchema = new mongoose.Schema({
  parentId:{type:String,required:true},
  name: {type: String, required: true},
})
const categoryChildrenSchema = new mongoose.Schema({
  parentId:{type:String,required:true},
  name: {type: String, required: true},

})
// 3. 定义Model(与集合对应, 可以操作集合)
const CategoryModel = mongoose.model('categorys', categorySchema)
CategoryModel.findOne({name: '食品'}).then(category=> {
  if(!category) {
    CategoryModel.create(
{name: '食品', parentId:'0',_id: "5c2ed631f352726338607046"},
  {                      name:'飞机',
                        parentId:'5c2ed631f352726338607046'},

                   {     name:'火箭',
                        parentId:'5c2ed631f352726338607046',
                       
})
     
            .then(category => {
              console.log('初始化categorys')
            })




     
            
  }


})
// 4. 向外暴露Model
module.exports = CategoryModel

