
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Tag = sequelize.define("Tag", {
  name: {
    type: DataTypes.STRING,
  },
});

Tag.sync();
export default Tag;