module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Category', {
        Category_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Category_Name: DataTypes.STRING
    })
};