// Módulo: Modelo Candidato — PostgreSQL/Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Candidato = sequelize.define(
  'Candidato',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_candidato: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    nombre_completo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    universidad_origen: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['USAC', 'UCR', 'UES']],
      },
    },
    carrera: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cursos_aprobados: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    fecha_ingesta: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'ACTIVO',
    },
  },
  {
    tableName: 'candidatos',
    timestamps: false,
  }
);

module.exports = Candidato;
