
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
  },
});
Category.sync();
export default Category;