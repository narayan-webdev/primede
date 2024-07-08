import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Ship_rocket_order = sequelize.define("Ship_rocket_order", {
  order_id: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  order_date: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pickup_location: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  billing_customer_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  billing_city: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  billing_pincode: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  billing_state: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  billing_country: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  billing_email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  billing_phone: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shipping_charges: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  giftwrap_charges: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  transaction_charges: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  total_discount: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sub_total: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  length: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  breadth: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  height: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  weight: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  billing_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shiprocket_order_id: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shipment_id: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Ship_rocket_order.sync();
export default Ship_rocket_order;