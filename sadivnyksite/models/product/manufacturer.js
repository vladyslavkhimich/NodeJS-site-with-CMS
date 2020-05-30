module.exports = (sequelize, DataTypes) => {
    let manufacturer = sequelize.define('Manufacturer', {
        Manufacturer_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Manufacturer_Name: DataTypes.STRING,
        Manufacturer_Logo_Path: DataTypes.STRING
    });
    return manufacturer;
};