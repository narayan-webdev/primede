import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Custom_courier = sequelize.define("Custom_courier", {
  trackingId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courierName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courierEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Custom_courier.sync();
export default Custom_courier;