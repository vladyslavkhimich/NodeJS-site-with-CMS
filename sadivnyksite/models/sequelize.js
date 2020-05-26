const sequelize = require('sequelize');

const Sequelize = new sequelize('sadivnyk_database', 'Vladyslav', 'mypassword123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = {
  sequelize, Sequelize
};