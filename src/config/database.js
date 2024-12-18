const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // O arquivo local onde os dados serão armazenados
});

module.exports = sequelize;
