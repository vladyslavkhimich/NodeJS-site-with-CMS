module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Order', {
      Order_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      Order_Datetime: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
      },
      City: DataTypes.STRING,
      Area: DataTypes.STRING,
      Street: DataTypes.STRING,
      House_Number: DataTypes.STRING,
      Apartment_Number: DataTypes.STRING,
      Order_Sum: DataTypes.DOUBLE,
      Name: DataTypes.STRING,
      Last_Name: DataTypes.STRING,
      Mobile_Phone_Number: DataTypes.STRING(9),
      User_ID_FK: {
          type: DataTypes.INTEGER,
          references: {
              model: 'users',
              key: 'User_ID'
          }
      }
  })
};