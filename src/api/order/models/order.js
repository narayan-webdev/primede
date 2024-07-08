import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Order = sequelize.define("Order", {
  slug: {
    type: DataTypes.STRING,
  },
  payment_order_id: {
    type: DataTypes.STRING,
  },
  payment_id: {
    type: DataTypes.STRING,
  },
  payment_signature: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DECIMAL,
  },
  payment_mode: {
    type: DataTypes.ENUM("COD", "PREPAID", "WALLET"),
  },
  is_paid: {
    type: DataTypes.BOOLEAN,
  },
  consumer_name: {
    type: DataTypes.STRING,
  },
  consumer_email: {
    type: DataTypes.STRING,
  },
  consumer_phone: {
    type: DataTypes.STRING,
  },
});

Order.sync();
export default Order;
