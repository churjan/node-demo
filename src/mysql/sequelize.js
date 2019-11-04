;(async () => {
  const Sequelize = require('sequelize')

  // 建立连接
  const sequelize = new Sequelize('test', 'root', 'example', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
  })
  // 定义模型
  const Fruit = sequelize.define('Fruit', {
    name: { type: Sequelize.STRING(20), allowNull: false },
    price: { type: Sequelize.FLOAT, allowNull: false },
    stock: { type: Sequelize.INTEGER, defaultValue: 0 },
  })

  //同步
  let ret = await Fruit.sync()

  //插入
  // ret = await Fruit.create({
  //   name: '香蕉',
  //   price: 2.3,
  // })
  // console.log('create:', ret)

  //查询
  ret = await Fruit.findAll()
  console.log('findAll:', JSON.stringify(ret, null, 2))
})()
