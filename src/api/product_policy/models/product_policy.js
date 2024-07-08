import { DataTypes } from 'sequelize';
import sequelize from '../../../../database/index.js';
const Product_policy = sequelize.define("Product_policy", {
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
});

Product_policy.sync();
export default Product_policy;
