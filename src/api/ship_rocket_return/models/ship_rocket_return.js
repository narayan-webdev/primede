import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Ship_rocket_return = sequelize.define("Ship_rocket_return", {
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
});

Ship_rocket_return.sync();
export default Ship_rocket_return;