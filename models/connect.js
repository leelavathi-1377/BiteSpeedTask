const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize("cnaps", "postgres", "postgres", {
    host: "localhost",
    dialect: 'postgres',
});

module.exports = sequelize;
