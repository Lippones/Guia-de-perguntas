const Sequelize = require('sequelize');
const connect = new Sequelize('guia','postgres', 'dwpq2jnza4',{
    host:'localhost',
    dialect:'postgres',
    dialectOptions: {
      },
})

module.exports = connect