const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Producto = sequelize.define('Producto', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del producto es obligatorio'
        }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La descripción del producto es obligatoria'
        }
      }
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'El código del producto debe ser único'
      },
      validate: {
        notEmpty: {
          msg: 'El código del producto es obligatorio'
        }
      }
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'El precio debe ser un valor decimal válido'
        },
        min: {
          args: [0],
          msg: 'El precio no puede ser negativo'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'El stock debe ser un número entero'
        },
        min: {
          args: [0],
          msg: 'El stock no puede ser negativo'
        }
      }
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'categoria_id',
      references: {
        model: 'categorias',
        key: 'id'
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'productos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'ultima_actualizacion'
  });

  return Producto;
};