const app = require('./app');
const config = require('./config/config');

// Sincronizar modelos con la base de datos
const { sequelize } = require('./models');

// Iniciar el servidor
app.listen(config.port, () => {
  console.log(`Servidor iniciado en el puerto ${config.port}`);
  console.log(`Entorno: ${config.env}`);
  console.log(`API docs disponibles en http://localhost:${config.port}/api-docs`);
});