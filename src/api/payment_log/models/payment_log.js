import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Payment_log = sequelize.define("Payment_log", {
  order_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payment_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  amount_refunded: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  method: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  captured: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  card_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  card: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last4: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  network: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bank: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  wallet: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vpa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  client: {
    type: DataTypes.STRING, // Change the data type as needed
    allowNull: true,
  },
});

Payment_log.sync();
export default Payment_log;