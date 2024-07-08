import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Ship_rocket_orderitem = sequelize.define("Ship_rocket_orderitem", {
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sku: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  units: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  selling_price: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tax: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  hsn: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Ship_rocket_orderitem.sync();
export default Ship_rocket_orderitem;
