var Sequelize = require('sequelize'),
    sequelize = new Sequelize('postgres://darelogbonna@localhost:5432/battleshipdb')

module.exports = sequelize;
