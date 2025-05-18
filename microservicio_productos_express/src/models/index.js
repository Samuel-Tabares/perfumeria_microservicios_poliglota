const { Sequelize } = require('sequelize');
const config = require('../config/config');

// Crear instancia de Sequelize
const sequelize = new Sequelize({
  dialect: config.db.dialect,
  storage: config.db.storage,
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  logging: config.db.logging,
  define: config.db.define
});

// Definir modelos
const Categoria = require('./categoria')(sequelize);
const Producto = require('./producto')(sequelize);
const Promocion = require('./promocion')(sequelize);

// Definir asociaciones
Categoria.hasMany(Producto, { as: 'productos', foreignKey: 'categoriaId' });
Producto.belongsTo(Categoria, { as: 'categoria', foreignKey: 'categoriaId' });

Producto.hasMany(Promocion, { as: 'promociones', foreignKey: 'productoId' });
Promocion.belongsTo(Producto, { as: 'producto', foreignKey: 'productoId' });

// Exportar modelos y conexión
module.exports = {
  sequelize,
  Sequelize,
  Categoria,
  Producto,
  Promocion
};