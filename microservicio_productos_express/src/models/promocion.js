const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Promocion = sequelize.define('Promocion', {
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
          msg: 'El nombre de la promoción es obligatorio'
        }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La descripción de la promoción es obligatoria'
        }
      }
    },
    descuentoPorcentaje: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'descuento_porcentaje',
      validate: {
        isDecimal: {
          msg: 'El descuento debe ser un valor decimal válido'
        },
        min: {
          args: [0],
          msg: 'El descuento no puede ser negativo'
        },
        max: {
          args: [100],
          msg: 'El descuento no puede ser mayor que 100%'
        }
      }
    },
    fechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fecha_inicio',
      validate: {
        isDate: {
          msg: 'La fecha de inicio debe ser una fecha válida'
        }
      }
    },
    fechaFin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fecha_fin',
      validate: {
        isDate: {
          msg: 'La fecha de fin debe ser una fecha válida'
        },
        validarFechaFin(value) {
          if (new Date(value) <= new Date(this.fechaInicio)) {
            throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
          }
        }
      }
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'producto_id',
      references: {
        model: 'productos',
        key: 'id'
      }
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'promociones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Promocion;
};