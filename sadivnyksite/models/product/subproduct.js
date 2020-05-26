module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Sub_Product', {
        Sub_Product_ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Sub_Product_Description: DataTypes.TEXT,
        Sub_Product_Code: DataTypes.STRING,
        Price: DataTypes.DOUBLE
    })
};