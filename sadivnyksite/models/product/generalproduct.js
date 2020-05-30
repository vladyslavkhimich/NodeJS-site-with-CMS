module.exports = (sequelize, DataTypes) => {
    let generalProduct = sequelize.define('General_Product', {
        General_Product_ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Product_Name: DataTypes.STRING,
        Average_Rating: DataTypes.FLOAT,
        Recommend_Percentage: DataTypes.INTEGER,
        General_Product_Description: DataTypes.TEXT,
        General_Product_Image_Path: DataTypes.STRING,
        Category_ID_FK: {
            type: DataTypes.INTEGER,
            references: {
                model: 'categories',
                key: 'Category_ID'
            }
        },
        Manufacturer_ID_FK: {
            type: DataTypes.INTEGER,
            references: {
                model: 'manufacturers',
                key: 'Manufacturer_ID'
            }
        }
    });
    return generalProduct;
};