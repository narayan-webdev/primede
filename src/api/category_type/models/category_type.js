
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Category_type = sequelize.define("Category_type", {
  name: {
    type: DataTypes.STRING,
  },
});
Category_type.sync();
export default Category_type;