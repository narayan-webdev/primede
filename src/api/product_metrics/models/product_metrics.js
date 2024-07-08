import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Product_metrics = sequelize.define("Product_metric", {
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ordered_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  return_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  shares_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  revenue_generated: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Product_metrics.sync();
export default Product_metrics;