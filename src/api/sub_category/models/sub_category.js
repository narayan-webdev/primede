// models/sub_category.js
import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Sub_category = sequelize.define(
  "Sub_category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);


Sub_category.sync();
export default Sub_category;