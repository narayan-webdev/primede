
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Product_review = sequelize.define("Product_review", {
  name: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.INTEGER,
  },
  review: {
    type: DataTypes.TEXT,
  },
});

Product_review.sync();
export default Product_review;