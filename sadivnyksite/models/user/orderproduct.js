const { sequelize, Sequelize } = require('../../models/sequelize');

const Order = require('../../models/user/order')(Sequelize, sequelize);
const SubProduct = require('../../models/product/subproduct')(Sequelize, sequelize);

module.exports = (sequelize, DataTypes) => {
  let OrderProduct = sequelize.define('Order_Product', {
        Order_Product_ID: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
      Product_Amount: DataTypes.INTEGER,
      Order_ID_FK: {
          type: DataTypes.INTEGER,
          references: {
              model: 'orders',
              key: 'Order_ID'
          }
        },
      Sub_Product_ID_FK: {
        type: DataTypes.INTEGER,
          references: {
              model: 'sub_products',
              key: 'Sub_Product_ID'
    }
      }
  });
  OrderProduct.beforeCreate((orderProduct, options) => {
      Order.findByPk(orderProduct.Order_ID_FK).then(order => {
          let orderSum;
          if (!order.Order_Sum)
              orderSum = 0;
          else
              orderSum = order.Order_Sum;
          SubProduct.findByPk(orderProduct.Sub_Product_ID_FK).then(subProduct => {
              orderSum += subProduct.Price * orderProduct.Product_Amount;
              Order.update({Order_Sum: orderSum}, {where: {Order_ID: orderProduct.Order_ID_FK}}).then(result => {
                if (result)
                    console.log('Update successful');
                else
                    console.log('Update failed');
              })
          });

      });
  });
  return OrderProduct;
};